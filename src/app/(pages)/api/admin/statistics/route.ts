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

    // Get total users count
    const totalUsers = await prisma.user.count();

    // Get total certificates count
    const totalCertificates = await prisma.certificate.count();

    // Get certificates by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const certificates = await prisma.certificate.findMany({
      where: {
        dateOfIssue: {
          gte: sixMonthsAgo
        }
      },
      select: {
        dateOfIssue: true
      }
    });

    // Process certificates by month
    const monthsMap = new Map();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    certificates.forEach(cert => {
      const date = new Date(cert.dateOfIssue);
      const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`;
      
      if (monthsMap.has(monthYear)) {
        monthsMap.set(monthYear, monthsMap.get(monthYear) + 1);
      } else {
        monthsMap.set(monthYear, 1);
      }
    });

    const certificatesByMonth = Array.from(monthsMap.entries()).map(([month, count]) => ({
      month,
      count
    })).sort((a, b) => {
      // Sort by year and month
      const [aMonth, aYear] = a.month.split(' ');
      const [bMonth, bYear] = b.month.split(' ');
      
      if (aYear !== bYear) {
        return Number(aYear) - Number(bYear);
      }
      
      return months.indexOf(aMonth) - months.indexOf(bMonth);
    });

    // Get top issuers
    const topIssuers = await prisma.user.findMany({
      where: {
        issuedCertificates: {
          some: {}
        }
      },
      select: {
        name: true,
        surname: true,
        _count: {
          select: {
            issuedCertificates: true
          }
        }
      },
      orderBy: {
        issuedCertificates: {
          _count: 'desc'
        }
      },
      take: 5
    });

    // Get issuer type distribution
    const issuerTypeDistribution = await prisma.certificate.groupBy({
      by: ['issuerType'],
      _count: {
        _all: true
      }
    });

    return NextResponse.json({
      totalUsers,
      totalCertificates,
      certificatesByMonth,
      topIssuers: topIssuers.map(issuer => ({
        name: issuer.name,
        surname: issuer.surname,
        count: issuer._count.issuedCertificates
      })),
      issuerTypeDistribution: issuerTypeDistribution.map(item => ({
        type: item.issuerType,
        count: item._count._all
      }))
    });
    
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}