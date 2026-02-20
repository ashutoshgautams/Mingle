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

    const maskedMessages = messages.map((message) => ({
      id: message.id,
      chatId: message.chatId,
      senderId: message.senderId === userId ? "you" : "partner",
      content: message.content,
      type: message.type,
      audioUrl: message.audioUrl,
      createdAt: message.createdAt,
    }));

    return NextResponse.json({ messages: maskedMessages });
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
