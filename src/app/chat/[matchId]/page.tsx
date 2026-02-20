"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Send, Heart, ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
}

interface ChatState {
  messages: Message[];
  partnerRevealed: boolean;
  youRevealed: boolean;
  status: string;
}

export default function ChatPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = React.use(params);
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [chat, setChat] = useState<ChatState>({
    messages: [],
    partnerRevealed: false,
    youRevealed: false,
    status: "ANONYMOUS",
  });
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/auth/login");
  }, [authStatus, router]);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat/${matchId}`);
      if (!res.ok) return;
      const data = await res.json();
      setChat({
        messages: data.messages ?? [],
        partnerRevealed: data.partnerRevealed ?? false,
        youRevealed: data.youRevealed ?? false,
        status: data.status ?? "ANONYMOUS",
      });
    } catch {
      /* polling failure is silent */
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    if (authStatus !== "authenticated") return;
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [authStatus, fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch(`/api/chat/${matchId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input.trim() }),
      });
      if (!res.ok) {
        setError("Failed to send message.");
        return;
      }
      const data = await res.json();
      if (data.message) {
        setChat((prev) => ({
          ...prev,
          messages: [...prev.messages, data.message],
        }));
      }
      setInput("");
    } catch {
      setError("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const requestReveal = async () => {
    setShowConfirm(false);
    try {
      const res = await fetch("/api/reveal/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.revealed) {
          router.push(`/match/${matchId}`);
        } else {
          setChat((prev) => ({ ...prev, youRevealed: true }));
        }
      }
    } catch {
      setError("Failed to send reveal request.");
    }
  };

  if (authStatus === "loading" || loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-muted-foreground">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-violet-400 text-white">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">Anonymous Chat</p>
            {chat.partnerRevealed && !chat.youRevealed && (
              <p className="text-xs text-primary">Partner wants to reveal!</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {chat.youRevealed ? (
            <Badge variant="secondary">Reveal requested</Badge>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfirm(true)}
            >
              <Heart className="mr-1 h-4 w-4 text-primary" />
              Ready to Connect
            </Button>
          )}
        </div>
      </div>

      {/* Confirm dialog */}
      {showConfirm && (
        <div className="border-b border-border bg-pink-50 px-4 py-3 flex items-center justify-between">
          <p className="text-sm">
            Are you sure you want to reveal your identity? This cannot be undone.
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={requestReveal}>
              Yes, Reveal
            </Button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {chat.messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground pt-8">
            No messages yet. Say hello! 👋
          </p>
        )}
        {chat.messages.map((msg) => {
          const isYou = msg.senderId === session?.user?.id;
          return (
            <div
              key={msg.id}
              className={`flex ${isYou ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                  isYou
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-secondary text-secondary-foreground rounded-bl-md"
                }`}
              >
                <p>{msg.content}</p>
                <p
                  className={`mt-1 text-[10px] ${
                    isYou ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-2 text-sm text-destructive text-center">{error}</div>
      )}

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="flex items-center gap-2 border-t border-border px-4 py-3"
      >
        <Input
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={sending || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
