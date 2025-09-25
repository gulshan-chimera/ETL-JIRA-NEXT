// app/api/auth/logout/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { logoutController } from "@/server/controllers/sessionController/auth.controller";

export async function POST() {
  try {
    const cookieStore = cookies();
    const result = await logoutController(cookieStore);
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
