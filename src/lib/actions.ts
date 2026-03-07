"use server";

import { db } from "@/db";
import { products, transactions, auditLogs } from "@/db/schema";
import { eq, sql, ilike, or, and, gte, lte, desc, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
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
    // Don't break the main operation if audit logging fails
  }
}

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
    const [inserted] = await db.insert(products).values({
      stockNumber,
      name,
      supplier: supplier || null,
      price: price || null,
      sizes: sizes || null,
      imageUrl: imageUrl || null,
      minStock: parseInt(minStock) || 10,
      currentStock: 0,
    }).returning();

    await logAudit("created", "product", inserted.id, { stockNumber, name });
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

export async function updateProduct(id: number, formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const supplier = (formData.get("supplier") as string)?.trim();
  const price = formData.get("price") as string;
  const sizes = (formData.get("sizes") as string)?.trim();
  const imageUrl = (formData.get("imageUrl") as string)?.trim();
  const minStock = formData.get("minStock") as string;

  if (!name) {
    return { success: false, error: "Product name is required." };
  }

  try {
    await db.update(products).set({
      name,
      supplier: supplier || null,
      price: price || null,
      sizes: sizes || null,
      imageUrl: imageUrl || null,
      minStock: parseInt(minStock) || 10,
      updatedAt: new Date(),
    }).where(eq(products.id, id));

    await logAudit("updated", "product", id, { name });
    revalidatePath("/admin/products");
    revalidatePath("/admin/inventory");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update product." };
  }
}

export async function deleteProduct(id: number) {
  if (!id || typeof id !== "number") {
    return { success: false, error: "Invalid product ID." };
  }

  try {
    const [deleted] = await db.delete(products).where(eq(products.id, id)).returning();
    await logAudit("deleted", "product", id, { stockNumber: deleted?.stockNumber, name: deleted?.name });
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

  const product = await db.query.products.findFirst({
    where: eq(products.stockNumber, stockNumber),
  });

  if (!product) {
    return { success: false, error: `No product found with stock number "${stockNumber}".` };
  }

  if (type === "shipping" && (product.currentStock || 0) < quantity) {
    return { success: false, error: `Insufficient stock. Only ${product.currentStock} units available.` };
  }

  const [tx] = await db.insert(transactions).values({
    productId: product.id,
    type,
    quantity,
    notes: notes || null,
    date: dateStr ? new Date(dateStr) : new Date(),
  }).returning();

  const adjustment = type === "receiving" ? quantity : -quantity;
  await db.update(products).set({
    currentStock: sql`${products.currentStock} + ${adjustment}`,
    updatedAt: new Date(),
  }).where(eq(products.id, product.id));

  await logAudit("created", "transaction", tx.id, { stockNumber, type, quantity });
  revalidatePath("/admin/transactions");
  revalidatePath("/admin/inventory");
  revalidatePath("/admin/products");
  revalidatePath("/");
  return { success: true };
}

// --- Data Fetching ---

export async function getProducts() {
  return await db.query.products.findMany({ orderBy: [products.name] });
}

export async function getTransactions() {
  return await db.query.transactions.findMany({
    with: { product: true },
    orderBy: [desc(transactions.date)],
    limit: 50,
  });
}

export async function getProductsPaginated(page: number = 1, limit: number = 20, search?: string) {
  const offset = (page - 1) * limit;
  const where = search
    ? or(ilike(products.name, `%${search}%`), ilike(products.stockNumber, `%${search}%`))
    : undefined;

  const [items, [total]] = await Promise.all([
    db.select().from(products).where(where).orderBy(products.name).limit(limit).offset(offset),
    db.select({ count: count() }).from(products).where(where),
  ]);

  return { items, total: total.count, page, limit, totalPages: Math.ceil(total.count / limit) };
}

export async function getTransactionsPaginated(
  page: number = 1,
  limit: number = 20,
  filters?: { type?: string; from?: string; to?: string; stockNumber?: string }
) {
  const offset = (page - 1) * limit;
  const conditions = [];

  if (filters?.type && filters.type !== "all") {
    conditions.push(eq(transactions.type, filters.type));
  }
  if (filters?.from) {
    conditions.push(gte(transactions.date, new Date(filters.from)));
  }
  if (filters?.to) {
    conditions.push(lte(transactions.date, new Date(filters.to + "T23:59:59")));
  }
  if (filters?.stockNumber) {
    const product = await db.query.products.findFirst({
      where: eq(products.stockNumber, filters.stockNumber),
    });
    if (product) {
      conditions.push(eq(transactions.productId, product.id));
    }
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [items, [total]] = await Promise.all([
    db.query.transactions.findMany({
      with: { product: true },
      where,
      orderBy: [desc(transactions.date)],
      limit,
      offset,
    }),
    db.select({ count: count() }).from(transactions).where(where),
  ]);

  return { items, total: total.count, page, limit, totalPages: Math.ceil(total.count / limit) };
}

// --- Search ---

export async function searchAll(query: string) {
  if (!query || query.length < 2) return { products: [], transactions: [] };

  const [productResults, transactionResults] = await Promise.all([
    db.select().from(products)
      .where(or(ilike(products.name, `%${query}%`), ilike(products.stockNumber, `%${query}%`)))
      .limit(8),
    db.query.transactions.findMany({
      with: { product: true },
      limit: 5,
    }).then((txs) =>
      txs.filter((tx) =>
        tx.product?.name?.toLowerCase().includes(query.toLowerCase()) ||
        tx.product?.stockNumber?.toLowerCase().includes(query.toLowerCase()) ||
        tx.notes?.toLowerCase().includes(query.toLowerCase())
      )
    ),
  ]);

  return { products: productResults, transactions: transactionResults };
}

// --- Low Stock ---

export async function getLowStockProducts() {
  return await db.select().from(products)
    .where(sql`${products.currentStock} <= ${products.minStock}`)
    .orderBy(products.currentStock)
    .limit(20);
}

// --- Bulk Import ---

export async function importProducts(
  items: { stockNumber: string; name: string; supplier?: string; price?: string; sizes?: string; minStock?: number }[]
) {
  if (!items || items.length === 0) {
    return { success: false, error: "No products to import." };
  }

  let imported = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const item of items) {
    if (!item.stockNumber?.trim() || !item.name?.trim()) {
      skipped++;
      continue;
    }

    try {
      await db.insert(products).values({
        stockNumber: item.stockNumber.trim(),
        name: item.name.trim(),
        supplier: item.supplier?.trim() || null,
        price: item.price || null,
        sizes: item.sizes?.trim() || null,
        minStock: item.minStock || 10,
        currentStock: 0,
      });
      imported++;
    } catch (err: any) {
      if (err?.code === "23505") {
        errors.push(`${item.stockNumber}: already exists`);
        skipped++;
      } else {
        errors.push(`${item.stockNumber}: failed`);
        skipped++;
      }
    }
  }

  await logAudit("created", "product", undefined, { bulkImport: true, imported, skipped });
  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
  revalidatePath("/");

  return {
    success: true,
    imported,
    skipped,
    errors: errors.length > 0 ? errors : undefined,
  };
}

// --- Dashboard with date range ---

export async function getDashboardData(days: number = 7) {
  const [allProducts, allTransactions] = await Promise.all([
    getProducts(),
    db.query.transactions.findMany({
      with: { product: true },
      where: gte(transactions.date, new Date(Date.now() - days * 24 * 60 * 60 * 1000)),
      orderBy: [desc(transactions.date)],
    }),
  ]);

  const stats = {
    totalProducts: allProducts.length,
    totalStock: allProducts.reduce((acc, p) => acc + (p.currentStock || 0), 0),
    lowStockItems: allProducts.filter((p) => (p.currentStock || 0) <= (p.minStock || 10)).length,
    totalTransactions: allTransactions.length,
  };

  const dateRange = [...Array(days)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return d.toISOString().split("T")[0];
  });

  const chartData = dateRange.map((dateStr) => {
    const dayTxs = allTransactions.filter(
      (tx) => tx.date && new Date(tx.date).toISOString().split("T")[0] === dateStr
    );
    return {
      name: new Date(dateStr).toLocaleDateString([], { month: "short", day: "numeric" }),
      in: dayTxs.filter((tx) => tx.type === "receiving").reduce((acc, tx) => acc + tx.quantity, 0),
      out: dayTxs.filter((tx) => tx.type === "shipping").reduce((acc, tx) => acc + tx.quantity, 0),
    };
  });

  const stockData = allProducts
    .sort((a, b) => (b.currentStock || 0) - (a.currentStock || 0))
    .slice(0, 5)
    .map((p) => ({
      name: p.name.length > 12 ? p.name.substring(0, 12) + "…" : p.name,
      stock: p.currentStock || 0,
    }));

  const recentTransactions = allTransactions.slice(0, 5);

  return { stats, chartData, stockData, recentTransactions };
}
