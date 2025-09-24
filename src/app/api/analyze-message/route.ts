import { NextRequest, NextResponse } from 'next/server';
import { analyzeThreatMessage } from '@/ai/flows/analyze-threat-message';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message provided.' }, { status: 400 });
    }

    const analysisResult = await analyzeThreatMessage.run({
      text: message, // Corrected input parameter name to 'text'
    });

    return NextResponse.json(analysisResult, { status: 200 });
  } catch (error) {
    console.error('Error calling analyzeThreatMessage flow:', error);
    return NextResponse.json({ error: 'Failed to analyze message.' }, { status: 500 });
  }
}
