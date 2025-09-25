// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { registerController } from "@/server/controllers/sessionController/auth.controller";

export async function POST(request: Request) {
  try {
    const body: { username: string; password: string } = await request.json();
    const result: { message: string } = await registerController(body);
    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
