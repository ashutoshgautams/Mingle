import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { matchId } = await params;
    const userId = session.user.id;

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: { anonymousChat: true },
    });

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    if (match.user1Id !== userId && match.user2Id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!match.anonymousChat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const messages = await prisma.message.findMany({
      where: { chatId: match.anonymousChat.id },
      orderBy: { createdAt: "asc" },
    });

    const revealRequests = await prisma.revealRequest.findMany({
      where: { matchId, status: "PENDING" },
    });

    const otherUserId = match.user1Id === userId ? match.user2Id : match.user1Id;
    const youRevealed = revealRequests.some((r) => r.requestedByUserId === userId);
    const partnerRevealed = revealRequests.some((r) => r.requestedByUserId === otherUserId);

    return NextResponse.json({
      messages,
      youRevealed,
      partnerRevealed,
      status: match.status,
    });
  } catch (error) {
    console.error("Get messages error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { matchId } = await params;
    const userId = session.user.id;

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: { anonymousChat: true },
    });

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    if (match.user1Id !== userId && match.user2Id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!match.anonymousChat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const body = await request.json();
    const { content, type } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        chatId: match.anonymousChat.id,
        senderId: userId,
        content,
        type: type || "TEXT",
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
