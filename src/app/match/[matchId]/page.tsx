"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MatchProfile {
  name: string;
  age?: number;
  bio?: string;
  interests?: string[];
  location?: string;
}

interface MatchData {
  id: string;
  status: string;
  you: MatchProfile;
  partner: MatchProfile;
}

export default function MatchRevealPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = React.use(params);
  const { status: authStatus } = useSession();
  const router = useRouter();
  const [match, setMatch] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/auth/login");
  }, [authStatus, router]);

  useEffect(() => {
    if (authStatus !== "authenticated") return;
    fetch(`/api/matches/${matchId}`)
      .then((r) => r.json())
      .then((data) => setMatch(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [authStatus, matchId]);

  if (authStatus === "loading" || loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-destructive">Match not found.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* CSS Confetti */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <span
            key={i}
            className="confetti-piece absolute"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              backgroundColor: ["#ec4899", "#f472b6", "#f9a8d4", "#fbbf24", "#a78bfa", "#34d399"][i % 6],
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }
        .confetti-piece {
          width: 10px;
          height: 10px;
          border-radius: 2px;
          animation: confetti-fall 4s ease-in-out infinite;
        }
      `}</style>

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-12 text-center">
        <div className="mb-6 flex items-center justify-center gap-2 text-primary">
          <Sparkles className="h-8 w-8" />
          <Heart className="h-10 w-10 fill-primary" />
          <Sparkles className="h-8 w-8" />
        </div>

        <h1 className="mb-2 text-4xl font-bold">It&apos;s a Match!</h1>
        <p className="mb-10 text-muted-foreground">
          You both decided to reveal — here&apos;s to a real connection 🎉
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <ProfileCard profile={match.you} label="You" />
          <ProfileCard profile={match.partner} label="Your Match" />
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href={`/chat/${matchId}`}>
            <Button size="lg">
              <MessageCircle className="mr-2 h-5 w-5" />
              Start a Conversation
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProfileCard({ profile, label }: { profile: MatchProfile; label: string }) {
  return (
    <Card>
      <CardHeader className="items-center pb-2">
        <Avatar className="h-20 w-20 mb-2">
          <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
            {profile.name?.[0]?.toUpperCase() ?? "?"}
          </AvatarFallback>
        </Avatar>
        <p className="text-xs text-muted-foreground">{label}</p>
        <CardTitle>{profile.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-left">
        {profile.age && (
          <p>
            <span className="font-medium">Age:</span> {profile.age}
          </p>
        )}
        {profile.location && (
          <p>
            <span className="font-medium">Location:</span> {profile.location}
          </p>
        )}
        {profile.bio && (
          <p>
            <span className="font-medium">Bio:</span> {profile.bio}
          </p>
        )}
        {profile.interests && profile.interests.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {profile.interests.map((interest) => (
              <span
                key={interest}
                className="rounded-full bg-pink-100 px-2 py-0.5 text-xs text-pink-700"
              >
                {interest}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
