"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, MessageCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Match {
  id: string;
  status: string;
  partnerName?: string;
  updatedAt: string;
}

const ANON_COLORS = [
  "bg-pink-400",
  "bg-violet-400",
  "bg-sky-400",
  "bg-amber-400",
  "bg-emerald-400",
  "bg-rose-400",
];

function colorForId(id: string) {
  let hash = 0;
  for (const ch of id) hash = ch.charCodeAt(0) + ((hash << 5) - hash);
  return ANON_COLORS[Math.abs(hash) % ANON_COLORS.length];
}

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [finding, setFinding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/matches")
      .then((r) => r.json())
      .then((data) => setMatches(data.matches ?? []))
      .catch(() => setError("Failed to load matches."))
      .finally(() => setLoading(false));
  }, [status]);

  const findMatch = async () => {
    setFinding(true);
    setError("");
    try {
      const res = await fetch("/api/matches/find", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not find a match right now.");
        return;
      }
      if (data.match) setMatches((prev) => [data.match, ...prev]);
    } catch {
      setError("Something went wrong.");
    } finally {
      setFinding(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const anonymous = matches.filter((m) => m.status === "ANONYMOUS");
  const revealed = matches.filter((m) => m.status === "REVEALED");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Your matches and conversations</p>
        </div>
        <Button onClick={findMatch} disabled={finding}>
          <Sparkles className="mr-2 h-4 w-4" />
          {finding ? "Searching..." : "Find a Match"}
        </Button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {anonymous.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Anonymous Chats
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {anonymous.map((m) => (
              <Link key={m.id} href={`/chat/${m.id}`}>
                <Card className="transition-shadow hover:shadow-md cursor-pointer">
                  <CardContent className="flex items-center gap-4 p-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className={`${colorForId(m.id)} text-white`}>?</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">Anonymous Chat</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(m.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="secondary">Anonymous</Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {revealed.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary fill-primary" />
            Connections
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {revealed.map((m) => (
              <Link key={m.id} href={`/match/${m.id}`}>
                <Card className="transition-shadow hover:shadow-md cursor-pointer">
                  <CardContent className="flex items-center gap-4 p-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-white">
                        {m.partnerName?.[0]?.toUpperCase() ?? "M"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{m.partnerName ?? "Your Match"}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(m.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge>Revealed</Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {matches.length === 0 && !loading && (
        <Card>
          <CardHeader className="text-center">
            <CardTitle>No matches yet</CardTitle>
            <CardDescription>
              Click &quot;Find a Match&quot; to start an anonymous conversation!
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
