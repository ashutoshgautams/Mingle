import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { matchId } = body;

    if (!matchId) {
      return NextResponse.json(
        { error: "matchId is required" },
        { status: 400 }
      );
    }

    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    if (match.user1Id !== userId && match.user2Id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (match.status !== "ANONYMOUS") {
      return NextResponse.json(
        { error: "Match is not in ANONYMOUS status" },
        { status: 400 }
      );
    }

    const existingRequest = await prisma.revealRequest.findFirst({
      where: {
        matchId,
        requestedByUserId: userId,
        status: "PENDING",
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: "You already have a pending reveal request for this match" },
        { status: 400 }
      );
    }

    const revealRequest = await prisma.revealRequest.create({
      data: {
        matchId,
        requestedByUserId: userId,
        status: "PENDING",
      },
    });

    const otherUserId = match.user1Id === userId ? match.user2Id : match.user1Id;

    const otherUserRequest = await prisma.revealRequest.findFirst({
      where: {
        matchId,
        requestedByUserId: otherUserId,
        status: "PENDING",
      },
    });

    if (otherUserRequest) {
      await prisma.$transaction([
        prisma.revealRequest.update({
          where: { id: revealRequest.id },
          data: { status: "ACCEPTED" },
        }),
        prisma.revealRequest.update({
          where: { id: otherUserRequest.id },
          data: { status: "ACCEPTED" },
        }),
        prisma.match.update({
          where: { id: matchId },
          data: { status: "REVEALED" },
        }),
      ]);

      return NextResponse.json({
        revealRequest: { ...revealRequest, status: "ACCEPTED" },
        matchStatus: "REVEALED",
        mutual: true,
      });
    }

    return NextResponse.json({
      revealRequest,
      matchStatus: "ANONYMOUS",
      mutual: false,
    });
  } catch (error) {
    console.error("Reveal request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
