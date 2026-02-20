import Link from "next/link";
import { Heart, MessageCircle, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: MessageCircle,
    title: "Anonymous Chat",
    description:
      "Start conversations without photos or names. Let your personality shine first.",
  },
  {
    icon: Heart,
    title: "Mutual Reveal",
    description:
      "When you both feel the vibe, reveal your identities together. No one-sided pressure.",
  },
  {
    icon: Shield,
    title: "Real Connections",
    description:
      "Build genuine bonds based on who you are, not what you look like.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-4 py-24 text-center">
        <div className="mb-6 flex items-center gap-2 text-primary">
          <Sparkles className="h-8 w-8" />
          <Heart className="h-12 w-12 fill-primary" />
          <Sparkles className="h-8 w-8" />
        </div>
        <h1 className="mb-4 text-5xl font-bold tracking-tight sm:text-6xl">
          Personality First,{" "}
          <span className="text-primary">Looks Second</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
          Mingle is an anonymous-first dating app where you chat without seeing
          profiles. If you both vibe, reveal your identities.
        </p>
        <div className="flex gap-4">
          <Link href="/auth/signup">
            <Button size="lg" className="text-base">
              Get Started
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button size="lg" variant="outline" className="text-base">
              Log In
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold">
          How Mingle Works
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col items-center rounded-xl border border-border bg-card p-8 text-center shadow-sm"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-pink-100 text-primary">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Mingle. All rights reserved.
      </footer>
    </div>
  );
}
