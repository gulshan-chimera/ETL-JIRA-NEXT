// server/controllers/sessionController/auth.controller.ts
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { getSession } from "../../lib/session";
import type { IronSession } from "iron-session";

const prisma = new PrismaClient();

type AppSession = IronSession<{ user?: { id: string; username: string } }> & {
  user?: { id: string; username: string };
};

// Register
export async function registerController(body: any) {
  const { username, password } = body;
  if (!username || !password) throw new Error("Username and password required");

  const existingUser = await prisma.user.findUnique({ where: { username } });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });

  return { message: "Registration successful" };
}

// Login
export async function loginController(
  body: any,
  cookieStore?: ReturnType<typeof import("next/headers").cookies>
) {
  const { username, password } = body;
  if (!username || !password)
    throw new Error("Username and password are required");

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw new Error("Invalid credentials");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Invalid credentials");

  const session = (await getSession(cookieStore)) as AppSession;
  session.user = {
    id: user.id,
    username: user.username,
  };
  await session.save();

  return { message: "Login successful", user: session.user };
}

// Logout
export async function logoutController(
  cookieStore?: ReturnType<typeof import("next/headers").cookies>
) {
  const session = (await getSession(cookieStore)) as AppSession;
  session.user = undefined;
  await session.save();
  return { message: "Logout successful" };
}

// Get Session
export async function getSessionController(
  cookieStore?: ReturnType<typeof import("next/headers").cookies>
) {
  const session = (await getSession(cookieStore)) as AppSession;
  if (session?.user) return { user: session.user };
  return { user: null };
}
