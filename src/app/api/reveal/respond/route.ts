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
    const { matchId, accept } = body;

    if (!matchId || typeof accept !== "boolean") {
      return NextResponse.json(
        { error: "matchId and accept (boolean) are required" },
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

    const otherUserId = match.user1Id === userId ? match.user2Id : match.user1Id;

    const pendingRequest = await prisma.revealRequest.findFirst({
      where: {
        matchId,
        requestedByUserId: otherUserId,
        status: "PENDING",
      },
    });

    if (!pendingRequest) {
      return NextResponse.json(
        { error: "No pending reveal request found" },
        { status: 404 }
      );
    }

    if (accept) {
      await prisma.$transaction([
        prisma.revealRequest.update({
          where: { id: pendingRequest.id },
          data: { status: "ACCEPTED" },
        }),
        prisma.revealRequest.create({
          data: {
            matchId,
            requestedByUserId: userId,
            status: "ACCEPTED",
          },
        }),
        prisma.match.update({
          where: { id: matchId },
          data: { status: "REVEALED" },
        }),
      ]);

      return NextResponse.json({ matchStatus: "REVEALED" });
    } else {
      await prisma.$transaction([
        prisma.revealRequest.update({
          where: { id: pendingRequest.id },
          data: { status: "DECLINED" },
        }),
        prisma.match.update({
          where: { id: matchId },
          data: { status: "DECLINED" },
        }),
      ]);

      return NextResponse.json({ matchStatus: "DECLINED" });
    }
  } catch (error) {
    console.error("Reveal respond error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
