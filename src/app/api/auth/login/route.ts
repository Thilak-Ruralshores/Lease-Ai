import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePasswords, signToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { organization: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check status
    if (user.status === "PENDING") {
      return NextResponse.json(
        { error: "Waiting for approval. Your account has not been activated yet." },
        { status: 403 }
      );
    }

    if (user.status === "REJECTED" || user.status === "SUSPENDED") {
      return NextResponse.json(
        { error: `Account ${user.status.toLowerCase()}. Please contact your administrator.` },
        { status: 403 }
      );
    }

    const isMatch = await comparePasswords(password, user.passwordHash);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organization: user.organization.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
