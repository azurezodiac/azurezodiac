import { NextResponse } from "next/server";
import { getByTrackingNumber } from "@/lib/store";
import { STATUS_LABELS } from "@/lib/types";

export async function GET(
  _request: Request,
  context: { params: Promise<{ trackingNumber: string }> },
) {
  const { trackingNumber } = await context.params;
  const found = await getByTrackingNumber(trackingNumber);

  if (!found) {
    return NextResponse.json(
      { error: "No request found for this tracking number." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    request: {
      trackingNumber: found.trackingNumber,
      concernTitle: found.concernTitle,
      name: found.name,
      location: found.location,
      status: found.status,
      statusLabel: STATUS_LABELS[found.status],
      statusNote: found.statusNote,
      createdAt: found.createdAt,
      updatedAt: found.updatedAt,
    },
  });
}
