import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { dbQuery, getDb, type DbRow } from "@/lib/db";
import {
  OPEN_STATUSES,
  STATUS_NOTES_DEFAULT,
  type ConsultationRequest,
  type RequestStatus,
} from "@/lib/types";

const DATA_DIR = path.join(
  process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
    ? "/tmp"
    : process.cwd(),
  "redeemysoul-data",
);
const DATA_FILE = path.join(DATA_DIR, "requests.json");

type StoreShape = {
  requests: ConsultationRequest[];
};

let schemaReady = false;

function rowToRequest(row: DbRow): ConsultationRequest {
  return {
    id: String(row.id),
    trackingNumber: String(row.tracking_number),
    concernId: String(row.concern_id),
    concernTitle: String(row.concern_title),
    name: String(row.name),
    motherName: String(row.mother_name),
    location: String(row.location),
    phone: String(row.phone),
    note: String(row.note ?? ""),
    status: row.status as RequestStatus,
    statusNote: String(row.status_note ?? ""),
    createdAt: new Date(String(row.created_at)).toISOString(),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
    clearedAt: row.cleared_at
      ? new Date(String(row.cleared_at)).toISOString()
      : null,
  };
}

async function ensureSchema(): Promise<void> {
  if (schemaReady || !getDb()) return;
  const dialect = getDb()!.dialect;
  const file =
    dialect === "mysql"
      ? path.join(process.cwd(), "migrations", "mysql", "001_schema.sql")
      : path.join(process.cwd(), "migrations", "001_requests.sql");
  const raw = await fs.readFile(file, "utf8");
  const statements = raw
    .split(/;\s*\n/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0 && !part.startsWith("--"));
  for (const statement of statements) {
    await dbQuery(statement);
  }
  schemaReady = true;
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
  if (getDb()) {
    await ensureSchema();
    const placeholders = OPEN_STATUSES.map(() => "?").join(",");
    const result = await dbQuery(
      `SELECT * FROM consultation_requests
       WHERE phone = ? AND status IN (${placeholders})
       ORDER BY created_at DESC
       LIMIT 1`,
      [normalized, ...OPEN_STATUSES],
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

  if (getDb()) {
    await ensureSchema();
    await dbQuery(
      `INSERT INTO consultation_requests (
        id, tracking_number, concern_id, concern_title, name, mother_name,
        location, phone, note, status, status_note, created_at, updated_at, cleared_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
  if (getDb()) {
    await ensureSchema();
    const result = await dbQuery(
      `SELECT * FROM consultation_requests WHERE UPPER(tracking_number) = ? LIMIT 1`,
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
  if (getDb()) {
    await ensureSchema();
    const result = await dbQuery(
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
      patch.statusNote !== undefined
        ? patch.statusNote
        : nextStatus !== current.status && STATUS_NOTES_DEFAULT[nextStatus]
          ? STATUS_NOTES_DEFAULT[nextStatus]!
          : current.statusNote,
    updatedAt: new Date().toISOString(),
    clearedAt:
      nextStatus === "cleared" ? new Date().toISOString() : current.clearedAt,
  };

  if (getDb()) {
    await ensureSchema();
    await dbQuery(
      `UPDATE consultation_requests
       SET status = ?, status_note = ?, updated_at = ?, cleared_at = ?
       WHERE UPPER(tracking_number) = ?`,
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
