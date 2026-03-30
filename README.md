# 💼 Job Tracker

🔗 **Live Demo:** [job-tracker-dusky-tau.vercel.app](https://job-tracker-dusky-tau.vercel.app)

A full-stack job application tracker built with **Next.js**, **Prisma**, and **PostgreSQL**. Track your applications through every stage — from Applied to Offer — with a slick dashboard, drag-and-drop Kanban board, and Google OAuth sign-in.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?logo=postgresql)
![Auth](https://img.shields.io/badge/Auth-NextAuth-purple)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)

---

## ✨ Features

- **Google OAuth** — Sign in securely with your Google account
- **Dashboard** — View all applications with real-time status counts
- **Kanban Board** — Drag-and-drop applications between status columns (Applied → Interview → Offer → Rejected)
- **List View** — Toggle between board and list layouts
- **Search & Filter** — Instantly search by company/role and filter by status
- **CRUD Operations** — Add, update status, and delete applications
- **Responsive Design** — Works on desktop and mobile

---

## 🛠 Tech Stack

| Layer          | Technology                          |
| -------------- | ----------------------------------- |
| Framework      | Next.js 16 (App Router, Turbopack) |
| Language       | TypeScript                          |
| Database       | PostgreSQL (Neon serverless)        |
| ORM            | Prisma 7                            |
| Authentication | NextAuth v5 (Google OAuth)          |
| Styling        | Tailwind CSS 4                      |
| Drag & Drop    | dnd-kit                             |
| Icons          | Lucide React                        |
| Deployment     | Vercel                              |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── applications/       # CRUD API routes
│   │   └── auth/               # NextAuth API routes
│   ├── dashboard/              # Main dashboard page
│   ├── signin/                 # Sign-in page
│   ├── register/               # Registration page
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/
│   ├── AddApplicationForm.tsx  # Modal form to add applications
│   └── KanbanBoard.tsx         # Drag-and-drop board view
├── auth.ts                     # NextAuth configuration
└── generated/prisma/           # Prisma generated client
prisma/
├── schema.prisma               # Database schema
└── migrations/                 # Database migrations
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database (or any PostgreSQL instance)
- A [Google Cloud Console](https://console.cloud.google.com) OAuth app for sign-in

### 1. Clone the repo

```bash
git clone https://github.com/your-username/job-tracker.git
cd job-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root:

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="your-auth-secret"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
```

> Generate `AUTH_SECRET` with: `npx auth secret`

### 4. Set up the database

```bash
npx prisma migrate dev
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Deployment

This app is ready to deploy on **Vercel**:

1. Push your code to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add your environment variables in the Vercel dashboard
4. Deploy — Vercel handles the rest

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
