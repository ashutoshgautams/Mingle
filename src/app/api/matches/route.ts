import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const matches = await prisma.match.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: {
        user1: {
          select: { id: true, name: true, age: true, gender: true, bio: true, photos: true, interests: true, location: true },
        },
        user2: {
          select: { id: true, name: true, age: true, gender: true, bio: true, photos: true, interests: true, location: true },
        },
        anonymousChat: true,
      },
    });

    const maskedMatches = matches.map((match) => {
      if (match.status === "ANONYMOUS") {
        const otherUserKey = match.user1Id === userId ? "user2" : "user1";
        return {
          ...match,
          [otherUserKey]: {
            id: match[otherUserKey].id,
            gender: match[otherUserKey].gender,
            age: match[otherUserKey].age,
          },
        };
      }
      return match;
    });

    return NextResponse.json({ matches: maskedMatches });
  } catch (error) {
    console.error("Get matches error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
