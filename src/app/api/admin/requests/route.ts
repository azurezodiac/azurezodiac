import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listRequests, updateRequest } from "@/lib/store";
import type { RequestStatus } from "@/lib/types";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const requests = await listRequests();
  return NextResponse.json({ requests });
}

async function updateLead(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    trackingNumber?: string;
    status?: RequestStatus;
    statusNote?: string;
  };

  if (!body.trackingNumber) {
    return NextResponse.json(
      { error: "trackingNumber is required." },
      { status: 400 },
    );
  }

  const updated = await updateRequest(body.trackingNumber, {
    status: body.status,
    statusNote: body.statusNote,
  });

  if (!updated) {
    return NextResponse.json({ error: "Request not found." }, { status: 404 });
  }

  return NextResponse.json({ request: updated });
}

/** POST preferred for cPanel PHP; PATCH kept for compatibility. */
export async function POST(request: Request) {
  return updateLead(request);
}

export async function PATCH(request: Request) {
  return updateLead(request);
}
