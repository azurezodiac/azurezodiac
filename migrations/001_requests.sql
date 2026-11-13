CREATE TABLE IF NOT EXISTS consultation_requests (
  id TEXT PRIMARY KEY,
  tracking_number TEXT NOT NULL UNIQUE,
  concern_id TEXT NOT NULL,
  concern_title TEXT NOT NULL,
  name TEXT NOT NULL,
  mother_name TEXT NOT NULL,
  location TEXT NOT NULL,
  phone TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL,
  status_note TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  cleared_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS consultation_requests_phone_status_idx
  ON consultation_requests (phone, status);

CREATE INDEX IF NOT EXISTS consultation_requests_created_at_idx
  ON consultation_requests (created_at DESC);
