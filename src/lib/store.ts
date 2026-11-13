import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { Pool, type QueryResultRow } from "pg";
import {
  OPEN_STATUSES,
  type ConsultationRequest,
  type RequestStatus,
} from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "requests.json");

type StoreShape = {
  requests: ConsultationRequest[];
};

let pool: Pool | null = null;

function db(): Pool | null {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return null;
  if (!pool) pool = new Pool({ connectionString: url });
  return pool;
}

function rowToRequest(row: QueryResultRow): ConsultationRequest {
  return {
    id: row.id,
    trackingNumber: row.tracking_number,
    concernId: row.concern_id,
    concernTitle: row.concern_title,
    name: row.name,
    motherName: row.mother_name,
    location: row.location,
    phone: row.phone,
    note: row.note ?? "",
    status: row.status,
    statusNote: row.status_note ?? "",
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
    clearedAt: row.cleared_at ? new Date(row.cleared_at).toISOString() : null,
  };
}

async function ensureFileStore(): Promise<StoreShape> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as StoreShape;
    if (!Array.isArray(parsed.requests)) return { requests: [] };
    return parsed;
  } catch {
    const empty = { requests: [] };
    await fs.writeFile(DATA_FILE, JSON.stringify(empty, null, 2));
    return empty;
  }
}

async function saveFileStore(store: StoreShape): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2));
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

function makeTrackingNumber(): string {
  const year = new Date().getFullYear();
  const token = randomBytes(3).toString("hex").toUpperCase();
  return `RS-${year}-${token}`;
}

export async function findOpenByPhone(
  phone: string,
): Promise<ConsultationRequest | null> {
  const normalized = normalizePhone(phone);
  const database = db();
  if (database) {
    const result = await database.query(
      `SELECT * FROM consultation_requests
       WHERE phone = $1 AND status = ANY($2::text[])
       ORDER BY created_at DESC
       LIMIT 1`,
      [normalized, OPEN_STATUSES],
    );
    return result.rows[0] ? rowToRequest(result.rows[0]) : null;
  }

  const store = await ensureFileStore();
  return (
    store.requests.find(
      (request) =>
        normalizePhone(request.phone) === normalized &&
        OPEN_STATUSES.includes(request.status),
    ) ?? null
  );
}

export async function createRequest(input: {
  concernId: string;
  concernTitle: string;
  name: string;
  motherName: string;
  location: string;
  phone: string;
  note?: string;
}): Promise<
  | { ok: true; request: ConsultationRequest }
  | { ok: false; code: "duplicate"; request: ConsultationRequest }
> {
  const phone = normalizePhone(input.phone);
  const existing = await findOpenByPhone(phone);
  if (existing) {
    return { ok: false, code: "duplicate", request: existing };
  }

  const now = new Date().toISOString();
  const request: ConsultationRequest = {
    id: randomBytes(8).toString("hex"),
    trackingNumber: makeTrackingNumber(),
    concernId: input.concernId,
    concernTitle: input.concernTitle,
    name: input.name.trim(),
    motherName: input.motherName.trim(),
    location: input.location.trim(),
    phone,
    note: input.note?.trim() ?? "",
    status: "pending",
    statusNote: "Your request is received and waiting for review.",
    createdAt: now,
    updatedAt: now,
    clearedAt: null,
  };

  const database = db();
  if (database) {
    await database.query(
      `INSERT INTO consultation_requests (
        id, tracking_number, concern_id, concern_title, name, mother_name,
        location, phone, note, status, status_note, created_at, updated_at, cleared_at
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14
      )`,
      [
        request.id,
        request.trackingNumber,
        request.concernId,
        request.concernTitle,
        request.name,
        request.motherName,
        request.location,
        request.phone,
        request.note,
        request.status,
        request.statusNote,
        request.createdAt,
        request.updatedAt,
        request.clearedAt,
      ],
    );
    return { ok: true, request };
  }

  const store = await ensureFileStore();
  store.requests.unshift(request);
  await saveFileStore(store);
  return { ok: true, request };
}

export async function getByTrackingNumber(
  trackingNumber: string,
): Promise<ConsultationRequest | null> {
  const needle = trackingNumber.trim().toUpperCase();
  const database = db();
  if (database) {
    const result = await database.query(
      `SELECT * FROM consultation_requests WHERE upper(tracking_number) = $1 LIMIT 1`,
      [needle],
    );
    return result.rows[0] ? rowToRequest(result.rows[0]) : null;
  }

  const store = await ensureFileStore();
  return (
    store.requests.find(
      (request) => request.trackingNumber.toUpperCase() === needle,
    ) ?? null
  );
}

export async function listRequests(): Promise<ConsultationRequest[]> {
  const database = db();
  if (database) {
    const result = await database.query(
      `SELECT * FROM consultation_requests ORDER BY created_at DESC`,
    );
    return result.rows.map(rowToRequest);
  }
  const store = await ensureFileStore();
  return store.requests;
}

export async function updateRequest(
  trackingNumber: string,
  patch: Partial<Pick<ConsultationRequest, "status" | "statusNote">>,
): Promise<ConsultationRequest | null> {
  const current = await getByTrackingNumber(trackingNumber);
  if (!current) return null;

  const nextStatus = patch.status ?? current.status;
  const updated: ConsultationRequest = {
    ...current,
    status: nextStatus,
    statusNote:
      patch.statusNote !== undefined ? patch.statusNote : current.statusNote,
    updatedAt: new Date().toISOString(),
    clearedAt:
      nextStatus === "cleared" ? new Date().toISOString() : current.clearedAt,
  };

  const database = db();
  if (database) {
    await database.query(
      `UPDATE consultation_requests
       SET status = $1, status_note = $2, updated_at = $3, cleared_at = $4
       WHERE upper(tracking_number) = $5`,
      [
        updated.status,
        updated.statusNote,
        updated.updatedAt,
        updated.clearedAt,
        trackingNumber.trim().toUpperCase(),
      ],
    );
    return updated;
  }

  const store = await ensureFileStore();
  const index = store.requests.findIndex(
    (request) =>
      request.trackingNumber.toUpperCase() ===
      trackingNumber.trim().toUpperCase(),
  );
  if (index < 0) return null;
  store.requests[index] = updated;
  await saveFileStore(store);
  return updated;
}

export function isOpenStatus(status: RequestStatus): boolean {
  return OPEN_STATUSES.includes(status);
}
