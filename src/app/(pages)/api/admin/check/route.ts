import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        console.log("Session data:", JSON.stringify(session, null, 2));

        if (!session?.user?.id) {
            console.log("Admin check: No session user ID");
            return NextResponse.json(
                { isAdmin: false, error: "No user session" },
                { status: 401 }
            );
        }

        // Get user from database and check if they have admin role
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { id: true, email: true, isAdmin: true },
        });

        console.log("User data from DB:", JSON.stringify(user, null, 2));

        if (!user) {
            console.log("User not found in database");
            return NextResponse.json(
                { isAdmin: false, error: "User not found" },
                { status: 404 }
            );
        }

        const isAdmin = !!user.isAdmin;

        console.log("Admin check result:", {
            userId: user.id,
            email: user.email,
            isAdmin,
        });

        return NextResponse.json({
            isAdmin,
            userId: user.id,
            email: user.email,
        });
    } catch (error) {
        console.error("Error checking admin status:", error);
        return NextResponse.json(
            {
                isAdmin: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to check admin status",
            },
            { status: 500 }
        );
    }
}
