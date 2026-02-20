# Local Development Setup Guide for Mingle

This guide will help you set up and test the Mingle project on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/downloads)

## Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/ashutoshgautams/Mingle.git

# Navigate to the project directory
cd Mingle

# Checkout the branch you want to test
git checkout <branch-name>
```

## Step 2: Install Dependencies

```bash
# Install all project dependencies
npm install

# Or if you prefer yarn
yarn install
```

This will install all required packages including:
- Next.js (React framework)
- Prisma (Database ORM)
- NextAuth v5 (Authentication)
- Tailwind CSS (Styling)
- bcryptjs (Password hashing)
- And other dependencies

## Step 3: Set Up Environment Variables

### Create Local Environment File

Copy the example environment file and configure it for your local setup:

```bash
# Copy the example file
cp .env.example .env.local
```

### Configure .env.local

Edit `.env.local` and fill in the required values. See the `.env.example` file for all available options.

**Required Environment Variables:**

```env
# Database Connection
DATABASE_URL="postgresql://username:password@localhost:5432/mingle_db?schema=public"

# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Optional: For production deployment
# NEXTAUTH_URL="https://your-production-domain.com"
```

**Generating NEXTAUTH_SECRET:**

```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

## Step 4: Set Up PostgreSQL Database

### Create Database

```bash
# Log into PostgreSQL
psql -U postgres

# Create a new database
CREATE DATABASE mingle_db;

# Exit PostgreSQL
\q
```

### Update DATABASE_URL

Make sure your `DATABASE_URL` in `.env.local` matches your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/mingle_db?schema=public"
```

Example:
```env
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/mingle_db?schema=public"
```

## Step 5: Set Up Prisma and Database Schema

```bash
# Generate Prisma Client (outputs to src/generated/prisma)
npx prisma generate

# Push the database schema to your database
npx prisma db push

# (Optional) Seed the database with sample data
npx prisma db seed
```

**Note:** This project uses Prisma 7 with a driver adapter configuration. The Prisma Client is configured to output to `src/generated/prisma` directory.

## Step 6: Verify TypeScript Configuration

Run TypeScript type checking to ensure everything is configured correctly:

```bash
# Type check without emitting files
npx tsc --noEmit
```

If there are any type errors, review them before proceeding.

## Step 7: Build the Project (Optional)

To verify the project builds correctly:

```bash
# Build the production version
npm run build

# Or
yarn build
```

## Step 8: Start the Development Server

```bash
# Start the Next.js development server
npm run dev

# Or
yarn dev
```

The application should now be running at: **http://localhost:3000**

## Step 9: Testing in Multiple Browsers

### Browser Testing Checklist

Test the application in at least two different browsers to ensure cross-browser compatibility:

#### Chrome/Chromium-based Browsers
1. Open **Google Chrome**, **Microsoft Edge**, or **Brave**
2. Navigate to `http://localhost:3000`
3. Test all major features:
   - Sign up flow
   - Login flow
   - Profile creation
   - Chat functionality
   - Navigation
   - Responsive design (use DevTools to test mobile views)

#### Firefox
1. Open **Mozilla Firefox**
2. Navigate to `http://localhost:3000`
3. Test the same features as above

#### Safari (macOS only)
1. Open **Safari**
2. Navigate to `http://localhost:3000`
3. Test the same features

### Testing Checklist

- [ ] **Sign Up**: Create a new account
  - Test with valid data
  - Test with invalid data (wrong email format, short password, etc.)
  - Verify gender options: MALE, FEMALE, NON_BINARY, OTHER
  
- [ ] **Login**: Sign in with created account
  - Test with correct credentials
  - Test with incorrect credentials
  - Verify session persistence
  
- [ ] **Profile**: Complete user profile
  - Upload profile picture (if applicable)
  - Set preferences (gender preference: MALE, FEMALE, NON_BINARY, EVERYONE)
  - Update bio and other details
  
- [ ] **Navigation**: Test all pages and routes
  - Check if protected routes require authentication
  - Verify redirects work correctly
  
- [ ] **Responsive Design**: Test on different screen sizes
  - Desktop (1920x1080)
  - Tablet (768x1024)
  - Mobile (375x667)

### Browser Developer Tools

Use browser DevTools to check for:

- **Console Errors**: Open DevTools (F12) → Console tab
- **Network Issues**: Check the Network tab for failed requests
- **Responsive Design**: Use Device Toolbar to test different screen sizes

## Step 10: Running Tests (If Available)

If the project has tests configured:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Common Issues and Troubleshooting

### Database Connection Issues

**Problem:** `Can't reach database server`

**Solution:**
1. Ensure PostgreSQL is running: `sudo service postgresql status` (Linux) or check Services (Windows)
2. Verify DATABASE_URL credentials are correct
3. Check if the database exists: `psql -U postgres -l`

### Port Already in Use

**Problem:** `Port 3000 is already in use`

**Solution:**
```bash
# Find the process using port 3000
lsof -ti:3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process or use a different port
PORT=3001 npm run dev
```

### Prisma Client Not Generated

**Problem:** `Cannot find module '@prisma/client'` or `PrismaClient` errors

**Solution:**
```bash
# Regenerate Prisma Client
npx prisma generate
```

### NextAuth Session Issues

**Problem:** Session not persisting or authentication not working

**Solution:**
1. Verify `NEXTAUTH_SECRET` is set in `.env.local`
2. Verify `NEXTAUTH_URL` matches your development URL
3. Clear browser cookies and cache
4. Restart the development server

### Build Errors

**Problem:** TypeScript or build errors

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

## Project Structure Overview

```
Mingle/
├── src/
│   ├── app/              # Next.js app directory (pages and routes)
│   ├── components/       # Reusable React components
│   ├── lib/              # Utility functions and configurations
│   │   ├── auth.ts       # NextAuth v5 configuration
│   │   ├── prisma.ts     # Prisma Client singleton
│   │   └── utils.ts      # Utility functions (cn for className merging)
│   └── generated/
│       └── prisma/       # Generated Prisma Client
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── seed.ts           # Database seed script
│   └── prisma.config.ts  # Prisma 7 configuration
├── public/               # Static assets
├── .env.local            # Local environment variables (not committed)
├── .env.example          # Environment variables template
├── next.config.js        # Next.js configuration
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── package.json          # Dependencies and scripts
```

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth Documentation](https://authjs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Getting Help

If you encounter any issues:

1. Check this guide's troubleshooting section
2. Review error messages in the browser console and terminal
3. Check the project's GitHub Issues page
4. Ensure all prerequisites are installed and at the correct versions

## Summary: Quick Start Commands

```bash
# Clone and setup
git clone https://github.com/ashutoshgautams/Mingle.git
cd Mingle
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your values

# Setup database
npx prisma generate
npx prisma db push

# Run development server
npm run dev

# Open http://localhost:3000 in your browser
```

---

**Happy Coding! 🚀**
