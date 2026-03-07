"use server";

import { db } from "@/db";
import { users, auditLogs } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { getSession } from "./session";

// --- Audit Helper ---

async function logAudit(action: string, entity: string, entityId?: number, details?: any) {
  try {
    const session = await getSession();
    await db.insert(auditLogs).values({
      action,
      entity,
      entityId: entityId ?? null,
      userId: session?.id ?? null,
      details: details ?? null,
    });
  } catch {
    // silent
  }
}

// --- User Actions ---

export async function getUsers() {
  return await db.select({
    id: users.id,
    username: users.username,
    email: users.email,
    role: users.role,
    lastLogin: users.lastLogin,
    createdAt: users.createdAt,
  }).from(users).orderBy(users.username);
}

export async function createUser(formData: FormData) {
  const username = (formData.get("username") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = (formData.get("password") as string);
  const role = (formData.get("role") as string) || "user";

  if (!username || !password) {
    return { success: false, error: "Username and password are required." };
  }

  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters." };
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [created] = await db.insert(users).values({
      username,
      email: email || null,
      password: hashedPassword,
      role,
    }).returning();

    await logAudit("created", "user", created.id, { username, role });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (err: any) {
    if (err?.code === "23505") {
      return { success: false, error: "Username or email already exists." };
    }
    return { success: false, error: "Failed to create user." };
  }
}

export async function updateUser(id: number, formData: FormData) {
  const email = (formData.get("email") as string)?.trim();
  const role = (formData.get("role") as string) || "user";
  const password = (formData.get("password") as string);

  const updates: any = {
    email: email || null,
    role,
  };

  if (password && password.length >= 6) {
    updates.password = await bcrypt.hash(password, 10);
  }

  try {
    await db.update(users).set(updates).where(eq(users.id, id));
    await logAudit("updated", "user", id, { role });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (err: any) {
    if (err?.code === "23505") {
      return { success: false, error: "Email already in use." };
    }
    return { success: false, error: "Failed to update user." };
  }
}

export async function deleteUser(id: number) {
  const session = await getSession();
  if (session?.id === id) {
    return { success: false, error: "You cannot delete your own account." };
  }

  try {
    const [deleted] = await db.delete(users).where(eq(users.id, id)).returning();
    await logAudit("deleted", "user", id, { username: deleted?.username });
    revalidatePath("/admin/users");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete user." };
  }
}

// --- Audit Logs ---

export async function getAuditLogs(page: number = 1, limit: number = 30) {
  const offset = (page - 1) * limit;

  const [items, [total]] = await Promise.all([
    db.query.auditLogs.findMany({
      with: { user: { columns: { username: true } } },
      orderBy: [desc(auditLogs.createdAt)],
      limit,
      offset,
    }),
    db.select({ count: count() }).from(auditLogs),
  ]);

  return { items, total: total.count, page, limit, totalPages: Math.ceil(total.count / limit) };
}
