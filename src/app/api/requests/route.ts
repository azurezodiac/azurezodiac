import { NextResponse } from "next/server";
import { CONCERNS, type ConcernId } from "@/lib/consultation";
import { createRequest, normalizePhone } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      concernId?: string;
      name?: string;
      motherName?: string;
      location?: string;
      phone?: string;
      note?: string;
    };

    const concern = CONCERNS.find((item) => item.id === body.concernId);
    if (!concern) {
      return NextResponse.json(
        { error: "Please choose a valid concern." },
        { status: 400 },
      );
    }

    const name = body.name?.trim() ?? "";
    const motherName = body.motherName?.trim() ?? "";
    const location = body.location?.trim() ?? "";
    const phone = normalizePhone(body.phone ?? "");
    const note = body.note?.trim() ?? "";

    if (name.length < 2 || motherName.length < 2 || location.length < 2) {
      return NextResponse.json(
        { error: "Name, mother's name, and location are required." },
        { status: 400 },
      );
    }

    if (phone.length < 10) {
      return NextResponse.json(
        { error: "Please enter a valid WhatsApp / mobile number." },
        { status: 400 },
      );
    }

    const result = await createRequest({
      concernId: concern.id as ConcernId,
      concernTitle: concern.title,
      name,
      motherName,
      location,
      phone,
      note,
    });

    if (!result.ok) {
      return NextResponse.json(
        {
          error: "duplicate",
          message:
            "A request is already pending for this number. Please wait until the admin clears it, or track your existing request.",
          request: {
            trackingNumber: result.request.trackingNumber,
            status: result.request.status,
            statusNote: result.request.statusNote,
            createdAt: result.request.createdAt,
          },
        },
        { status: 409 },
      );
    }

    return NextResponse.json({ request: result.request }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to create request right now." },
      { status: 500 },
    );
  }
}
