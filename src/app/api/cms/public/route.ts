import { NextResponse } from "next/server";
import { getPublicCms } from "@/lib/cms-store";

/** Public published CMS payload for blog / pricing / promo banners. */
export async function GET() {
  const cms = await getPublicCms();
  return NextResponse.json(
    { cms },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
}
