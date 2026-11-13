import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
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

async function ensureStore(): Promise<StoreShape> {
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

async function saveStore(store: StoreShape): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2));
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function normalizeKey(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
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
  const store = await ensureStore();
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

  const store = await ensureStore();
  store.requests.unshift(request);
  await saveStore(store);
  return { ok: true, request };
}

export async function getByTrackingNumber(
  trackingNumber: string,
): Promise<ConsultationRequest | null> {
  const store = await ensureStore();
  const needle = trackingNumber.trim().toUpperCase();
  return (
    store.requests.find(
      (request) => request.trackingNumber.toUpperCase() === needle,
    ) ?? null
  );
}

export async function listRequests(): Promise<ConsultationRequest[]> {
  const store = await ensureStore();
  return store.requests;
}

export async function updateRequest(
  trackingNumber: string,
  patch: Partial<
    Pick<ConsultationRequest, "status" | "statusNote">
  >,
): Promise<ConsultationRequest | null> {
  const store = await ensureStore();
  const index = store.requests.findIndex(
    (request) =>
      request.trackingNumber.toUpperCase() ===
      trackingNumber.trim().toUpperCase(),
  );
  if (index < 0) return null;

  const current = store.requests[index];
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

  store.requests[index] = updated;
  await saveStore(store);
  return updated;
}

export function isOpenStatus(status: RequestStatus): boolean {
  return OPEN_STATUSES.includes(status);
}
