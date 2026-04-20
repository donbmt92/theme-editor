import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// CORS headers for deployed sites
const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Allow all origins (restrict in production if needed)
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

// POST: Create a new lead
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, company, projectId } = body;

        console.log('[API/LEADS] Received submission:', { name, email, company, projectId });

        if (!name || !email) {
            return NextResponse.json(
                { success: false, error: 'Name and email are required' },
                { status: 400, headers: corsHeaders }
            );
        }

        const lead = await prisma.lead.create({
            data: {
                name,
                email,
                company,
                projectId,
                status: 'NEW',
            },
        });

        console.log('[API/LEADS] Lead created:', lead.id);

        return NextResponse.json(
            { success: true, lead },
            { headers: corsHeaders }
        );
    } catch (error) {
        console.error('[API/LEADS] Error creating lead:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create lead' },
            { status: 500, headers: corsHeaders }
        );
    }
}

// GET: Fetch leads (Protected)
export async function GET() {
    const session = await getServerSession();

    if (!session || !session.user) {
        return NextResponse.json(
            { success: false, error: 'Unauthorized' },
            { status: 401, headers: corsHeaders }
        );
    }

    try {
        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100, // Limit for now
        });

        return NextResponse.json(
            { success: true, leads },
            { headers: corsHeaders }
        );
    } catch (error) {
        console.error('[API/LEADS] Error fetching leads:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch leads' },
            { status: 500, headers: corsHeaders }
        );
    }
}
