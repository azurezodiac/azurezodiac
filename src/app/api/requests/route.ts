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
      hadiyaRegion?: string;
      hadiyaTxnLast5?: string;
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
    let note = body.note?.trim() ?? "";
    const hadiyaTxnLast5 = (body.hadiyaTxnLast5 ?? "").replace(/\D/g, "");

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

    if (hadiyaTxnLast5.length !== 5) {
      return NextResponse.json(
        {
          error:
            "Please enter the last 5 digits of your Hadiya transaction for spiritual diagnosis.",
        },
        { status: 400 },
      );
    }

    if (!note.includes(hadiyaTxnLast5)) {
      const region =
        body.hadiyaRegion === "international" ? "International" : "Pakistan";
      note = note
        ? `${note}\n\nHadiya (${region}) txn last 5: ${hadiyaTxnLast5}`
        : `Hadiya (${region}) txn last 5: ${hadiyaTxnLast5}`;
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
