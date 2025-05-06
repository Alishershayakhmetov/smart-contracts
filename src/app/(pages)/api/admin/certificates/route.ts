import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true }
    });

    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all certificates with related user data
    const certificates = await prisma.certificate.findMany({
      orderBy: {
        dateOfIssue: 'desc'
      },
      include: {
        issuer: {
          select: {
            name: true,
            surname: true
          }
        },
        recipient: {
          select: {
            name: true,
            surname: true
          }
        }
      }
    });

    return NextResponse.json(certificates);
    
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch certificates' },
      { status: 500 }
    );
  }
}