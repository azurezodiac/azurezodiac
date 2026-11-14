export type RequestStatus =
  | "pending"
  | "in_review"
  | "active"
  | "diagnosis_completed"
  | "resolved"
  | "cleared";

export type ConsultationRequest = {
  id: string;
  trackingNumber: string;
  concernId: string;
  concernTitle: string;
  name: string;
  motherName: string;
  location: string;
  phone: string;
  note: string;
  status: RequestStatus;
  statusNote: string;
  createdAt: string;
  updatedAt: string;
  clearedAt: string | null;
};

/** Blocks creating another request until admin clears. */
export const OPEN_STATUSES: RequestStatus[] = [
  "pending",
  "in_review",
  "active",
  "diagnosis_completed",
];

export const STATUS_LABELS: Record<RequestStatus, string> = {
  pending: "Pending",
  in_review: "In review",
  active: "Active / in progress",
  diagnosis_completed: "Diagnosis completed",
  resolved: "Resolved",
  cleared: "Cleared — new request allowed",
};

export const STATUS_NOTES_DEFAULT: Partial<Record<RequestStatus, string>> = {
  diagnosis_completed:
    "Initial spiritual diagnosis is completed. Further guidance, if needed, will be shared privately. Shifa is from Allah alone; no guarantee of healing.",
};
