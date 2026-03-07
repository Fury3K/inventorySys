"use server";

import { db } from "@/db";
import { products, transactions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// --- Product Actions ---

export async function addProduct(formData: FormData) {
  const stockNumber = (formData.get("stockNumber") as string)?.trim();
  const name = (formData.get("name") as string)?.trim();
  const supplier = (formData.get("supplier") as string)?.trim();
  const price = formData.get("price") as string;
  const sizes = (formData.get("sizes") as string)?.trim();
  const imageUrl = (formData.get("imageUrl") as string)?.trim();
  const minStock = formData.get("minStock") as string;

  if (!stockNumber || !name) {
    return { success: false, error: "Stock number and name are required." };
  }

  try {
    await db.insert(products).values({
      stockNumber,
      name,
      supplier: supplier || null,
      price: price || null,
      sizes: sizes || null,
      imageUrl: imageUrl || null,
      minStock: parseInt(minStock) || 10,
      currentStock: 0,
    });

    revalidatePath("/admin/products");
    revalidatePath("/admin/inventory");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    if (err?.code === "23505") {
      return { success: false, error: "A product with this stock number already exists." };
    }
    return { success: false, error: "Failed to add product. Please try again." };
  }
}

export async function deleteProduct(id: number) {
  if (!id || typeof id !== "number") {
    return { success: false, error: "Invalid product ID." };
  }

  try {
    await db.delete(products).where(eq(products.id, id));

    revalidatePath("/admin/products");
    revalidatePath("/admin/inventory");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete product." };
  }
}

// --- Transaction Actions ---

export async function recordTransaction(formData: FormData) {
  const stockNumber = (formData.get("stockNumber") as string)?.trim();
  const type = formData.get("type") as "receiving" | "shipping";
  const quantity = parseInt(formData.get("quantity") as string);
  const notes = (formData.get("notes") as string)?.trim();
  const dateStr = formData.get("date") as string;

  if (!stockNumber || !type || !quantity || quantity < 1) {
    return { success: false, error: "Please fill in all required fields." };
  }

  // 1. Find product by stock number
  const product = await db.query.products.findFirst({
    where: eq(products.stockNumber, stockNumber),
  });

  if (!product) {
    return { success: false, error: `No product found with stock number "${stockNumber}".` };
  }

  // Check if shipping more than available
  if (type === "shipping" && (product.currentStock || 0) < quantity) {
    return {
      success: false,
      error: `Insufficient stock. Only ${product.currentStock} units available.`,
    };
  }

  // 2. Insert transaction
  await db.insert(transactions).values({
    productId: product.id,
    type,
    quantity,
    notes: notes || null,
    date: dateStr ? new Date(dateStr) : new Date(),
  });

  // 3. Update product current stock
  const adjustment = type === "receiving" ? quantity : -quantity;

  await db
    .update(products)
    .set({
      currentStock: sql`${products.currentStock} + ${adjustment}`,
      updatedAt: new Date(),
    })
    .where(eq(products.id, product.id));

  revalidatePath("/admin/transactions");
  revalidatePath("/admin/inventory");
  revalidatePath("/admin/products");
  revalidatePath("/");

  return { success: true };
}

// --- Data Fetching ---

export async function getProducts() {
  return await db.query.products.findMany({
    orderBy: [products.name],
  });
}

export async function getTransactions() {
  return await db.query.transactions.findMany({
    with: {
      product: true,
    },
    orderBy: [sql`${transactions.date} DESC`],
    limit: 50,
  });
}
