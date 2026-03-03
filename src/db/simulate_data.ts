import { db } from "./index";
import { products, transactions } from "./schema";
import { sql } from "drizzle-orm";

async function simulate() {
  console.log("🚀 Starting Massive GPU Catalog Expansion...");

  const gpuModels = [
    // --- NVIDIA 40 Series ---
    { name: "NVIDIA GeForce RTX 4090", price: "115000.00", supplier: "ASUS ROG" },
    { name: "NVIDIA GeForce RTX 4080 Super", price: "68000.00", supplier: "MSI Gaming" },
    { name: "NVIDIA GeForce RTX 4070 Ti Super", price: "52000.00", supplier: "Gigabyte Aorus" },
    { name: "NVIDIA GeForce RTX 4060 Ti", price: "24500.00", supplier: "Zotac Gaming" },
    
    // --- NVIDIA 30 Series ---
    { name: "NVIDIA GeForce RTX 3090 Ti", price: "65000.00", supplier: "EVGA FTW3" },
    { name: "NVIDIA GeForce RTX 3080", price: "38000.00", supplier: "ASUS TUF" },
    { name: "NVIDIA GeForce RTX 3070", price: "22000.00", supplier: "MSI Ventus" },
    { name: "NVIDIA GeForce RTX 3060", price: "16500.00", supplier: "Colorful iGame" },

    // --- NVIDIA 20 Series ---
    { name: "NVIDIA GeForce RTX 2080 Ti", price: "25000.00", supplier: "Zotac" },
    { name: "NVIDIA GeForce RTX 2070 Super", price: "15000.00", supplier: "Gigabyte" },
    { name: "NVIDIA GeForce RTX 2060", price: "10500.00", supplier: "Palit" },

    // --- NVIDIA 10 & 16 Series ---
    { name: "NVIDIA GeForce GTX 1080 Ti", price: "14500.00", supplier: "ASUS ROG" },
    { name: "NVIDIA GeForce GTX 1070", price: "8500.00", supplier: "MSI" },
    { name: "NVIDIA GeForce GTX 1060 6GB", price: "6000.00", supplier: "Galax" },
    { name: "NVIDIA GeForce GTX 1660 Super", price: "9500.00", supplier: "Gigabyte" },
    { name: "NVIDIA GeForce GTX 1650", price: "7000.00", supplier: "Zotac" },

    // --- NVIDIA 900 & 700 Series (Classic) ---
    { name: "NVIDIA GeForce GTX 980 Ti", price: "9000.00", supplier: "EVGA" },
    { name: "NVIDIA GeForce GTX 970", price: "5500.00", supplier: "MSI" },
    { name: "NVIDIA GeForce GTX 960", price: "3800.00", supplier: "Palit" },
    { name: "NVIDIA GeForce GTX 780 Ti", price: "6500.00", supplier: "ASUS" },
    { name: "NVIDIA GeForce GTX 770", price: "4000.00", supplier: "Gigabyte" },
    { name: "NVIDIA GeForce GTX 750 Ti", price: "3200.00", supplier: "Zotac" },
    { name: "NVIDIA GeForce GT 730", price: "1800.00", supplier: "Palit" },
    { name: "NVIDIA GeForce GT 710", price: "1200.00", supplier: "ASUS" },

    // --- AMD Radeon RX 7000 Series ---
    { name: "AMD Radeon RX 7900 XTX", price: "62000.00", supplier: "Sapphire Nitro+" },
    { name: "AMD Radeon RX 7800 XT", price: "34500.00", supplier: "PowerColor Red Devil" },
    { name: "AMD Radeon RX 7700 XT", price: "28000.00", supplier: "ASRock Steel Legend" },

    // --- AMD Radeon RX 6000 Series ---
    { name: "AMD Radeon RX 6950 XT", price: "42000.00", supplier: "XFX Merc" },
    { name: "AMD Radeon RX 6800 XT", price: "28500.00", supplier: "MSI Gaming X" },
    { name: "AMD Radeon RX 6700 XT", price: "18500.00", supplier: "Sapphire Pulse" },
    { name: "AMD Radeon RX 6600", price: "12500.00", supplier: "PowerColor" },

    // --- AMD Legacy Series ---
    { name: "AMD Radeon RX 5700 XT", price: "11500.00", supplier: "Gigabyte" },
    { name: "AMD Radeon RX 580 8GB", price: "5200.00", supplier: "Sapphire" },
    { name: "AMD Radeon RX 570 4GB", price: "3500.00", supplier: "MSI" },
    { name: "AMD Radeon RX 480", price: "4200.00", supplier: "XFX" },
    { name: "AMD Radeon R9 290X", price: "5000.00", supplier: "Sapphire" },
    { name: "AMD Radeon HD 7970", price: "3500.00", supplier: "ASUS" },
  ];

  // 1. Insert Products
  console.log(`📦 Adding ${gpuModels.length} GPUs to the Catalog...`);
  const insertedProducts = [];
  
  // Get start index based on current products count to avoid stock number collisions
  const existingProducts = await db.select().from(products);
  const startIdx = existingProducts.length + 200;

  for (let i = 0; i < gpuModels.length; i++) {
    const model = gpuModels[i];
    
    try {
      const [p] = await db.insert(products).values({
        stockNumber: `GPU-${startIdx + i}`,
        name: model.name,
        supplier: model.supplier,
        price: model.price,
        sizes: "Standard PCIe",
        minStock: Math.floor(Math.random() * 8) + 3,
        currentStock: 0,
      }).returning();
      insertedProducts.push(p);
    } catch (e) {
      console.log(`Skipping duplicate: ${model.name}`);
    }
  }

  // 2. Simulate Transactions for NEW items
  console.log("💸 Simulating Workday Transactions for new stock...");
  const notes = {
    receiving: ["Bulk restock", "Supplier delivery", "Warehouse transfer", "End-of-day audit"],
    shipping: ["Order #TX-900", "Walk-in Customer", "Online sale", "Express shipping"]
  };

  for (const product of insertedProducts) {
    // Initial stock (receiving)
    const initialQty = Math.floor(Math.random() * 40) + 10;
    await db.insert(transactions).values({
      productId: product.id,
      type: 'receiving',
      quantity: initialQty,
      notes: "Stock ingestion",
      date: new Date(Date.now() - 3600000 * 5)
    });

    let current = initialQty;

    // Fast simulation of busy movement
    const numTx = Math.floor(Math.random() * 5) + 1;
    for (let j = 0; j < numTx; j++) {
      const type = Math.random() > 0.5 ? 'shipping' : 'receiving';
      const qty = Math.floor(Math.random() * 4) + 1;
      
      if (type === 'shipping' && current < qty) continue;

      await db.insert(transactions).values({
        productId: product.id,
        type: type,
        quantity: qty,
        notes: notes[type][Math.floor(Math.random() * notes[type].length)],
        date: new Date(Date.now() - Math.floor(Math.random() * 3600000 * 3))
      });

      current += (type === 'receiving' ? qty : -qty);
    }

    await db.update(products).set({ currentStock: current }).where(sql`id = ${product.id}`);
  }

  console.log("✅ Simulation Complete! Massive catalog added.");
  process.exit(0);
}

simulate().catch(err => {
  console.error(err);
  process.exit(1);
});
