"use server";

import { db } from "@/db";
import { products, transactions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// --- Product Actions ---

export async function addProduct(formData: FormData) {
  const stockNumber = formData.get("stockNumber") as string;
  const name = formData.get("name") as string;
  const supplier = formData.get("supplier") as string;
  const price = formData.get("price") as string;
  const sizes = formData.get("sizes") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const minStock = formData.get("minStock") as string;

  await db.insert(products).values({
    stockNumber,
    name,
    supplier,
    price: price,
    sizes,
    imageUrl,
    minStock: parseInt(minStock) || 10,
    currentStock: 0,
  });

  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
  revalidatePath("/");
  return { success: true };
}

export async function deleteProduct(id: number) {
  // We should ideally check for transactions first or handle cascade
  await db.delete(products).where(eq(products.id, id));
  
  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
  revalidatePath("/");
  return { success: true };
}

// --- Transaction Actions ---

export async function recordTransaction(formData: FormData) {
  const stockNumber = formData.get("stockNumber") as string;
  const type = formData.get("type") as 'receiving' | 'shipping';
  const quantity = parseInt(formData.get("quantity") as string);
  const notes = formData.get("notes") as string;
  const dateStr = formData.get("date") as string;

  // 1. Find product by stock number
  const product = await db.query.products.findFirst({
    where: eq(products.stockNumber, stockNumber),
  });

  if (!product) {
    throw new Error("Product not found");
  }

  // 2. Insert transaction
  await db.insert(transactions).values({
    productId: product.id,
    type,
    quantity,
    notes,
    date: dateStr ? new Date(dateStr) : new Date(),
  });

  // 3. Update product current stock
  const adjustment = type === 'receiving' ? quantity : -quantity;
  
  await db.update(products)
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

// --- Data Fetching (Helper for Server Components later) ---

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
