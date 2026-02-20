import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcryptjs from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcryptjs.hash("password123", 10);

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "alice@example.com" },
      update: {},
      create: {
        email: "alice@example.com",
        passwordHash: hashedPassword,
        name: "Alice",
        age: 25,
        gender: "FEMALE",
        genderPreference: "MALE",
        bio: "Love hiking and photography",
        photos: ["https://example.com/alice1.jpg"],
        interests: ["hiking", "photography", "travel"],
        location: "New York",
      },
    }),
    prisma.user.upsert({
      where: { email: "bob@example.com" },
      update: {},
      create: {
        email: "bob@example.com",
        passwordHash: hashedPassword,
        name: "Bob",
        age: 28,
        gender: "MALE",
        genderPreference: "FEMALE",
        bio: "Music lover and coffee enthusiast",
        photos: ["https://example.com/bob1.jpg"],
        interests: ["music", "coffee", "cooking"],
        location: "Los Angeles",
      },
    }),
    prisma.user.upsert({
      where: { email: "charlie@example.com" },
      update: {},
      create: {
        email: "charlie@example.com",
        passwordHash: hashedPassword,
        name: "Charlie",
        age: 30,
        gender: "MALE",
        genderPreference: "FEMALE",
        bio: "Fitness and tech geek",
        photos: ["https://example.com/charlie1.jpg"],
        interests: ["fitness", "technology", "gaming"],
        location: "Chicago",
      },
    }),
    prisma.user.upsert({
      where: { email: "diana@example.com" },
      update: {},
      create: {
        email: "diana@example.com",
        passwordHash: hashedPassword,
        name: "Diana",
        age: 24,
        gender: "FEMALE",
        genderPreference: "MALE",
        bio: "Bookworm and yoga practitioner",
        photos: ["https://example.com/diana1.jpg"],
        interests: ["reading", "yoga", "art"],
        location: "San Francisco",
      },
    }),
    prisma.user.upsert({
      where: { email: "evan@example.com" },
      update: {},
      create: {
        email: "evan@example.com",
        passwordHash: hashedPassword,
        name: "Evan",
        age: 27,
        gender: "MALE",
        genderPreference: "FEMALE",
        bio: "Adventurer and foodie",
        photos: ["https://example.com/evan1.jpg"],
        interests: ["adventure", "food", "movies"],
        location: "Seattle",
      },
    }),
  ]);

  const match = await prisma.match.create({
    data: {
      user1Id: users[0].id,
      user2Id: users[1].id,
      status: "ANONYMOUS",
    },
  });

  await prisma.anonymousChat.create({
    data: {
      matchId: match.id,
      isActive: true,
    },
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
