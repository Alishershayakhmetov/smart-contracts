import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check if user is admin
        const adminUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { isAdmin: true },
        });

        if (!adminUser?.isAdmin) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = params;
        const { isAdmin } = await req.json();

        // Prevent self-demotion
        if (id === session.user.id && isAdmin === false) {
            return NextResponse.json(
                { error: "Cannot remove admin privileges from yourself" },
                { status: 400 }
            );
        }

        // Update user admin status
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { isAdmin },
            select: {
                id: true,
                name: true,
                surname: true,
                email: true,
                isAdmin: true,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to update user",
            },
            { status: 500 }
        );
    }
}
