import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Replace this with a proper secret from your environment variables
const API_SECRET = process.env.API_SECRET;

export function isAuthenticated(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.split(' ')[1];
  return token === API_SECRET;
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { error: 'Unauthorized' },
    { status: 401 }
  );
}
