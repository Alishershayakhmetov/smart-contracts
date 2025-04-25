import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password, name, surname, IIN } = await request.json();

    const existingUser = await prisma.user.findUnique({
      where: { 
        iin: IIN 
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'IIN already in use' },
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
        iin: IIN
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}