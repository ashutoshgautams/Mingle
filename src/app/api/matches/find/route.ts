import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingMatches = await prisma.match.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      select: { user1Id: true, user2Id: true },
    });

    const matchedUserIds = existingMatches.map((m) =>
      m.user1Id === userId ? m.user2Id : m.user1Id
    );

    const minAge = currentUser.age - 5;
    const maxAge = currentUser.age + 5;

    const potentialMatch = await prisma.user.findFirst({
      where: {
        id: { notIn: [userId, ...matchedUserIds] },
        ...(currentUser.genderPreference !== "any" && { gender: currentUser.genderPreference }),
        genderPreference: { in: [currentUser.gender, "any"] },
        age: { gte: minAge, lte: maxAge },
      },
    });

    if (!potentialMatch) {
      return NextResponse.json({ message: "No matches available right now" });
    }

    const match = await prisma.match.create({
      data: {
        user1Id: userId,
        user2Id: potentialMatch.id,
        status: "ANONYMOUS",
        anonymousChat: {
          create: {},
        },
      },
      include: {
        user1: {
          select: { id: true, name: true, age: true, gender: true },
        },
        user2: {
          select: { id: true, name: true, age: true, gender: true },
        },
        anonymousChat: true,
      },
    });

    return NextResponse.json({ match }, { status: 201 });
  } catch (error) {
    console.error("Find match error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
