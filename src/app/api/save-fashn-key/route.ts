import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_FASHN_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: 'FASHN API key not found in environment' }, { status: 404 });
  }
  
  return NextResponse.json({ apiKey });
}