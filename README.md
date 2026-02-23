# X inc. Inventory Management System

A modern, high-performance inventory management system built with Next.js 15, tailored for "X inc." to handle product tracking, stock movements, and data-driven insights with precision.

## Key Features

### 1. Dashboard and Analytics
- **Visual Insights:** Dynamic graphs showing stock movement trends and top-performing products using Recharts.
- **Real-time Stats:** Instant visibility into total products, low stock alerts, and daily transaction volume.
- **Activity Monitoring:** Track recent user login activity for system security and audit trails.

### 2. Master Product List
- **Full Encoding:** Comprehensive product data entry including Stock Number, Supplier, Unit Price, and Size Ranges.
- **Image Support:** Visual cataloging with product image URLs.
- **Easy Management:** Searchable and filterable master list with quick "Add Product" functionality.

### 3. Receiving and Shipping (Transactions)
- **Stock Movement Log:** Dedicated interface for recording incoming (receiving) and outgoing (shipping) inventory.
- **Auto-Date Entry:** System automatically timestamps every transaction for accurate record-keeping.
- **Smart Referencing:** Searchable stock number input with datalist support for rapid data entry.

### 4. Inventory Overview
- **Real-time Status:** Live tracking of current stock levels with visual status badges (In Stock, Low Stock, Out of Stock).
- **Advanced Filtering:** Powerful search bar to filter by name or stock number.
- **Detailed View:** Deep-dive into specific product details including supplier info and size availability.

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Database:** [PostgreSQL](https://www.postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team/)
- **UI and Styling:** [Tailwind CSS](https://tailwindcss.com/) and [DaisyUI 5](https://daisyui.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Charts:** [Recharts](https://recharts.org/)
- **Authentication:** JWT (jose) and BcryptJS

## Future Integrations

- [ ] **Barcode and QR Scanning:** Direct scanning via mobile or webcam for instant receiving and shipping.
- [ ] **Automated Restock Alerts:** Email/SMS notifications when items hit the minimum stock threshold.
- [ ] **Multi-Warehouse Support:** Manage inventory across different physical locations or branches.
- [ ] **Supplier Management Portal:** Track supplier lead times, contact info, and performance metrics.
- [ ] **Advanced Forecasting:** AI-driven demand prediction based on historical transaction data.
- [ ] **Mobile Companion App:** Specialized mobile interface for warehouse staff to perform counts on the go.
- [ ] **Export Options:** PDF and Excel generation for financial reports and tax documentation.

## Getting Started

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Setup Environment Variables:**
   Copy `.env.example` to `.env` and fill in your database credentials.
4. **Database Migration:**
   ```bash
   npx drizzle-kit push
   ```
5. **Run the development server:**
   ```bash
   npm run dev
   ```

---
&copy; 2026 X inc. Systems. Internal Use Only.
