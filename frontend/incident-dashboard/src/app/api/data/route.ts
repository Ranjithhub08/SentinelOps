import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Force dynamic so Next.js doesn't cache the API route
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Navigate up from frontend/incident-dashboard setup
    const dataStorePath = path.join(process.cwd(), '../../configs/data_store.json');
    if (!fs.existsSync(dataStorePath)) {
      return NextResponse.json({ anomalies: [], incidents: [], explanations: [], alerts: [] });
    }
    const fileContents = fs.readFileSync(dataStorePath, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading data_store.json:', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}
