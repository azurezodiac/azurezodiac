export type RequestStatus =
  | "pending"
  | "in_review"
  | "active"
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

export const OPEN_STATUSES: RequestStatus[] = [
  "pending",
  "in_review",
  "active",
];

export const STATUS_LABELS: Record<RequestStatus, string> = {
  pending: "Pending",
  in_review: "In review",
  active: "Active / in progress",
  resolved: "Resolved",
  cleared: "Cleared — new request allowed",
};
