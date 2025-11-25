import { NextResponse } from 'next/server';
import { extractActionItems } from '../../../lib/openai';
import type { ActionItem } from '../../../types';

interface GenerateResponse {
  success: boolean;
  actionItems?: ActionItem[];
  error?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const transcript: unknown = body?.transcript;

    if (typeof transcript !== 'string' || transcript.trim().length === 0) {
      return NextResponse.json<GenerateResponse>(
        { success: false, error: 'Transcript is required.' },
        { status: 400 },
      );
    }

    const actionItems = await extractActionItems(transcript.trim());

    return NextResponse.json<GenerateResponse>({ success: true, actionItems });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred while generating action items.';

    return NextResponse.json<GenerateResponse>(
      {
        success: false,
        error: message || 'Unable to generate action items at this time.',
      },
      { status: 500 },
    );
  }
}
