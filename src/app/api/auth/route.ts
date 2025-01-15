import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { generateSessionToken } from '@/middleware/auth';

export async function POST(request: NextRequest) {
  try {
    // Check if there's an existing valid session
    const existingSession = request.cookies.get('session_token');
    if (existingSession?.value) {
      return NextResponse.json({ status: 'authenticated' });
    }

    // Generate a new session token
    const sessionToken = generateSessionToken();
    
    // Create the response with the session token
    const response = NextResponse.json({ status: 'authenticated' });

    // Set the session token as an HTTP-only cookie
    response.cookies.set({
      name: 'session_token',
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      // Set expiration to 24 hours
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}
