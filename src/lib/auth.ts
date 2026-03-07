"use server";

import { cookies } from "next/headers";
import { db } from "@/db";
import { users, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { encrypt } from "./session";

export async function login(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    throw new Error("Missing username or password");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (!user) {
    throw new Error("Invalid username or password");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error("Invalid username or password");
  }

  // Update lastLogin
  await db.update(users).set({ lastLogin: new Date() }).where(eq(users.id, user.id));

  // Log audit
  try {
    await db.insert(auditLogs).values({
      action: "login",
      entity: "user",
      entityId: user.id,
      userId: user.id,
      details: { username: user.username },
    });
  } catch { /* silent */ }

  const expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const sessionData = {
    id: user.id,
    username: user.username,
    role: user.role,
    expires,
  };
  const session = await encrypt(sessionData);

  (await cookies()).set("session", session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return { success: true };
}

export async function logout() {
  (await cookies()).set("session", "", { expires: new Date(0) });
}
