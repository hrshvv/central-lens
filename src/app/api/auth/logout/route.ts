import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  response.cookies.delete('cl_token');
  response.cookies.delete('cl_refresh_token');
  
  return response;
}
