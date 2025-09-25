// server/lib/session.ts
import { cookies } from "next/headers";
import { getIronSession, SessionOptions, IronSession } from "iron-session";

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_PASSWORD as string,
  cookieName: "etl_jira_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  },
};

export type AppSession = IronSession<{
  user?: { id: string; username: string };
}>;

export async function getSession(
  cookieStore?: ReturnType<typeof cookies>
): Promise<AppSession> {
  const cookieStoreToUse = cookieStore ?? cookies();
  if (!cookieStoreToUse) {
    throw new Error(
      "No cookie store available — pass cookies() from the route handler."
    );
  }

  const session = (await getIronSession(
    cookieStoreToUse as any,
    sessionOptions as any
  )) as AppSession;

  return session;
}
