import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Regex patterns
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const IIN_REGEX = /^\d{12}$/;

export async function POST(request: Request) {
    try {
        const { email, password, name, surname, IIN } = await request.json();

        // Validate email and IIN
        if (!EMAIL_REGEX.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        if (!IIN_REGEX.test(IIN)) {
            return NextResponse.json(
                { error: "IIN must be exactly 12 digits" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ iin: IIN }, { email: email }],
            },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "IIN or Email already in use" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                surname,
                iin: IIN,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json(
            { error: "Registration failed" },
            { status: 500 }
        );
    }
}
