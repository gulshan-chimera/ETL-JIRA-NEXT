// app/api/auth/login/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { loginController } from "@/server/controllers/sessionController/auth.controller";

export async function POST(request: Request) {
  try {
    const body: { username: string; password: string } = await request.json();
    const cookieStore = cookies();
    const result = await loginController(body, cookieStore);
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
