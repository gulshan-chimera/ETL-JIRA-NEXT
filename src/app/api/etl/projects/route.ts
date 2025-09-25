// app/api/etl/projects/route.ts
import { NextResponse } from "next/server";
import { getEtlProjects } from "@/server/controllers/eltProjectController";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    const limit = Number(url.searchParams.get("limit") ?? "100");

    const data = await getEtlProjects({ page, limit });
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
