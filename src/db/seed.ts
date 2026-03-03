import { db } from "./index";
import { users } from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  await db.insert(users).values({
    username: "admin",
    password: hashedPassword,
    email: "admin@example.com",
    role: "admin",
  });
  
  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
