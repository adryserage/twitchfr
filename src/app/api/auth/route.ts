import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { generateSessionToken } from '@/middleware/auth';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate the credentials from the request body
    const { username, password } = body;
    
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // In a real application, you would validate credentials here
    // For now, we'll just generate a session token
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
