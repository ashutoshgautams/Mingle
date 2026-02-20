# Mingle

Talk before you date.

## 🚀 Quick Start

This is a Next.js-based dating application that emphasizes communication before dating.

### Local Development Setup

For detailed instructions on setting up the project locally, including environment variables, database configuration, and multi-browser testing, please see:

**📖 [Local Setup Guide](./SETUP.md)**

### Quick Commands

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Then edit .env.local with your configuration

# Setup database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

Visit http://localhost:3000 to see the application.

## 🧪 Testing

For comprehensive testing instructions including multi-browser testing, see the [Setup Guide](./SETUP.md#step-9-testing-in-multiple-browsers).

## 📚 Documentation

- [Local Setup Guide](./SETUP.md) - Complete guide for local development
- [Environment Variables](./.env.example) - Template for environment configuration

## 🛠️ Tech Stack

- **Framework:** Next.js 14+ with App Router
- **Authentication:** NextAuth v5 (beta)
- **Database:** PostgreSQL with Prisma ORM
- **Styling:** Tailwind CSS
- **Language:** TypeScript

## 📝 License

This project is licensed under the MIT License.
