import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET /api/admin/users - List all users in organization
export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ORG_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      where: {
        organizationId: session.organizationId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/admin/users - Update user status or role
export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ORG_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { userId, status, role } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Ensure the user being updated belongs to the same organization
    const targetUser = await prisma.user.findFirst({
      where: {
        id: userId,
        organizationId: session.organizationId,
      },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Cannot change own role/status to avoid lockouts (optional safety)
    if (userId === session.userId && (status || role)) {
        // Maybe allow change name, but status/role?
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(status && { status }),
        ...(role && { role }),
        ...(status === "APPROVED" && { approvedAt: new Date(), approvedById: session.userId }),
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
