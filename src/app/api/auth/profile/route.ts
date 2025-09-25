// app/api/auth/profile/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSessionController } from "@/server/controllers/sessionController/auth.controller";

export async function GET() {
  try {
    const cookieStore = cookies();
    const result = await getSessionController(cookieStore);
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
