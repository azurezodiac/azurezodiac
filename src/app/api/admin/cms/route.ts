import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  createCmsItem,
  deleteCmsItem,
  getCmsState,
  resetCmsToSeed,
  updateCmsItem,
  updateLanding,
} from "@/lib/cms-store";
import type { CmsCollection, CmsLanding } from "@/lib/cms-types";

const COLLECTIONS: CmsCollection[] = [
  "posts",
  "features",
  "promotions",
  "pricing",
];

function isCollection(value: unknown): value is CmsCollection {
  return typeof value === "string" && COLLECTIONS.includes(value as CmsCollection);
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const cms = await getCmsState();
  return NextResponse.json({ cms });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    action?: string;
    collection?: string;
    id?: string;
    item?: Record<string, unknown>;
  };

  if (body.action === "reset") {
    const cms = await resetCmsToSeed();
    return NextResponse.json({ cms });
  }

  if (body.action === "updateLanding") {
    const landingInput = (body.item ?? {}) as Partial<CmsLanding>;
    const cms = await updateLanding(landingInput);
    return NextResponse.json({ cms });
  }

  if (!isCollection(body.collection)) {
    return NextResponse.json({ error: "Invalid collection." }, { status: 400 });
  }

  if (body.action === "create") {
    const cms = await createCmsItem(body.collection, body.item ?? {});
    return NextResponse.json({ cms });
  }

  if (body.action === "update") {
    if (!body.id) {
      return NextResponse.json({ error: "id required." }, { status: 400 });
    }
    const cms = await updateCmsItem(body.collection, body.id, body.item ?? {});
    if (!cms) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ cms });
  }

  if (body.action === "delete") {
    if (!body.id) {
      return NextResponse.json({ error: "id required." }, { status: 400 });
    }
    const cms = await deleteCmsItem(body.collection, body.id);
    if (!cms) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ cms });
  }

  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}
