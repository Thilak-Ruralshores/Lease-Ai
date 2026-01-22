import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain) {
      return NextResponse.json(
        { error: "Invalid email domain" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    // Atomic transaction for org and user creation
    return await prisma.$transaction(async (tx) => {
      // Check if organization exists for this domain
      let organization = await tx.organization.findUnique({
        where: { domain },
      });

      let role: "ORG_ADMIN" | "USER" = "USER";
      let status: "APPROVED" | "PENDING" = "PENDING";

      if (!organization) {
        // First user of the domain - create organization
        organization = await tx.organization.create({
          data: {
            name: domain.split(".")[0], // Default name from domain
            domain,
          },
        });
        role = "ORG_ADMIN";
        status = "APPROVED";
      }

      const user = await tx.user.create({
        data: {
          email,
          name,
          passwordHash: hashedPassword,
          role,
          status,
          organizationId: organization.id,
        },
      });

      return NextResponse.json({
        message: status === "APPROVED" 
          ? "Account created and approved" 
          : "Account created, waiting for approval",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
        },
      });
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
