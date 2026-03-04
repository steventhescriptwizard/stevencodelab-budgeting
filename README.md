# 💰 Steven Budget

A modern, high-performance financial management application built with **React**, **Vite**, **Tailwind CSS**, and **Supabase**. Steven Budget helps you track your income, manage expenses, and stick to your budgets with a premium, responsive interface that supports both Dark and Light modes.

## ✨ Features

- **📊 Comprehensive Dashboard**: Real-time overview of your total balance, monthly income, and monthly expenses.
- **📈 Spending Analytics**: Interactive pie charts to visualize your spending by category.
- **💸 Transaction Management**:
  - Full CRUD capabilities (Add, Edit, Delete).
  - Bulk actions for deleting multiple records.
  - Client-side pagination (10 items per page).
  - Advanced filtering by date range, category, and type.
  - Search functionality.
- **🎯 Budgeting System**:
  - Set monthly or yearly spending limits per category.
  - Real-time tracking of "Spent" vs "Limit".
  - Visual alerts (Safe, Near Limit, Exceeded) and progress bars.
- **🛡️ Secure Backend**: Integrated with Supabase for authentication and persistent data storage with Row Level Security (RLS).
- **🌓 Adaptive Theme**: Seamless switching between premium Dark and Light modes.
- **🇮🇩 Localized UI**: Fully localized for Indonesian Rupiah (IDR) and Indonesian date formats.

## 🚀 Tech Stack

- **Frontend**: React (Hooks, Context API), Vite
- **Styling**: Tailwind CSS, Lucide Icons, Framer Motion
- **Database/Auth**: Supabase (PostgreSQL)
- **UI Components**: SweetAlert2, Recharts, Custom UI components

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A Supabase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd steven-budget
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Database Setup:
   Run the SQL provided in `supabase_schema.sql` (if available in artifacts) in your Supabase SQL Editor to create the necessary tables (`transactions`, `categories`, `budgets`) and RLS policies.

5. Run the Local Development Server:
   ```bash
   npm run dev
   ```

## 📂 Project Structure

- `src/components`: Reusable UI components and layouts.
- `src/lib`: Context providers (Auth, Data, Theme) and API utilities.
- `src/pages`: Application views (Dashboard, Transactions, Budgets, Reports, Settings).
- `src/index.css`: Global styles and Tailwind configuration.

---

Built with ❤️ for better financial clarity.
