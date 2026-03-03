"use server";

import { cookies } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { encrypt } from "./session";

export async function login(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    throw new Error("Missing username or password");
  }

  // 1. Fetch user from database
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (!user) {
    throw new Error("Invalid username or password");
  }

  // 2. Compare password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error("Invalid username or password");
  }

  // 3. Create session
  const expires = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
  const sessionData = { 
    id: user.id, 
    username: user.username, 
    role: user.role,
    expires 
  };
  const session = await encrypt(sessionData);

  // 4. Save session in a cookie
  (await cookies()).set("session", session, { 
    expires, 
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });

  return { success: true };
}

export async function logout() {
  (await cookies()).set("session", "", { expires: new Date(0) });
}
