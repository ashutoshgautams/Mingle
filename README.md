# Mingle

**Personality First, Looks Second.**

Mingle is an anonymous-first dating app where users chat without seeing profiles or photos. If both people vibe with the conversation, they mutually agree to reveal identities and connect.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Auth:** NextAuth.js v5 (Credentials provider)
- **Database:** PostgreSQL with Prisma ORM
- **Real-time:** Socket.io for live anonymous chat
- **Styling:** Tailwind CSS v4 + shadcn/ui-inspired components
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
4. Update `.env` with your database connection string and auth secret
5. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
6. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
7. (Optional) Seed the database:
   ```bash
   npx tsx prisma/seed.ts
   ```
8. Start the development server:
   ```bash
   npm run dev
   ```

### Socket.io Server

For real-time chat with Socket.io, use the custom server:
```bash
npm run dev:socket
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes
│   │   ├── auth/           # Auth endpoints (signup, NextAuth)
│   │   ├── chat/           # Chat message endpoints
│   │   ├── matches/        # Match finding and listing
│   │   ├── profile/        # Profile management
│   │   └── reveal/         # Reveal request/respond
│   ├── auth/               # Auth pages (login, signup)
│   ├── chat/               # Anonymous chat room
│   ├── dashboard/          # User dashboard
│   ├── match/              # Revealed match view
│   └── profile/            # Profile editing
├── components/             # React components
│   ├── ui/                 # Reusable UI components
│   ├── navbar.tsx          # Navigation bar
│   └── providers.tsx       # Session provider
├── lib/                    # Utilities and config
│   ├── auth.ts             # NextAuth configuration
│   ├── prisma.ts           # Prisma client singleton
│   ├── socket-client.ts    # Socket.io client helper
│   ├── socket-server.ts    # Socket.io server setup
│   └── utils.ts            # Utility functions
└── server.ts               # Custom server with Socket.io
```

## Core Flow

1. **Sign up** → Create profile (name, age, gender, bio, interests)
2. **Find match** → Get matched anonymously based on preferences
3. **Anonymous chat** → Text chat without identity revealed
4. **Ready to Connect** → Both users must agree to reveal
5. **Profiles revealed** → Celebration screen with full profiles
