import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { passwordHash: _, ...profile } = user;

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, age, gender, genderPreference, bio, interests, location, photos } = body;

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name;
    if (age !== undefined) data.age = age;
    if (gender !== undefined) data.gender = gender;
    if (genderPreference !== undefined) data.genderPreference = genderPreference;
    if (bio !== undefined) data.bio = bio;
    if (interests !== undefined) data.interests = interests;
    if (location !== undefined) data.location = location;
    if (photos !== undefined) data.photos = photos;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data,
    });

    const { passwordHash: _, ...profile } = user;

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
