// app/api/etl/projects/[identifier]/issues/route.ts
import { NextResponse } from "next/server";
import { getEtlIssuesByProjectIdentifier } from "@/server/controllers/eltProjectController";

export async function GET(
  _req: Request,
  { params }: { params: { identifier: string } }
) {
  try {
    const url = new URL(_req.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    const limit = Number(url.searchParams.get("limit") ?? "200");

    const data = await getEtlIssuesByProjectIdentifier(params.identifier, {
      page,
      limit,
    });
    if (!data.project)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
