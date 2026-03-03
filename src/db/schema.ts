import { pgTable, serial, text, integer, timestamp, decimal, varchar, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  email: varchar("email", { length: 255 }).unique(),
  role: varchar("role", { length: 50 }).default("user"),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  stockNumber: varchar("stock_number", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  supplier: varchar("supplier", { length: 255 }),
  price: decimal("price", { precision: 10, scale: 2 }),
  sizes: text("sizes"), // e.g., "S, M, L, XL"
  currentStock: integer("current_stock").default(0),
  minStock: integer("min_stock").default(10),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id),
  type: varchar("type", { length: 20 }).notNull(), // 'receiving', 'shipping'
  quantity: integer("quantity").notNull(),
  date: timestamp("date").defaultNow(),
  notes: text("notes"),
});

export const productsRelations = relations(products, ({ many }) => ({
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  product: one(products, {
    fields: [transactions.productId],
    references: [products.id],
  }),
}));
