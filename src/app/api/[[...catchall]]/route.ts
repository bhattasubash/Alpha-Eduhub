import { NextRequest, NextResponse } from 'next/server';
import { getMockData } from '@/lib/mockData';

// Catch-all API route for force work mode
// Provides mock data when specific API routes fail or don't exist

export async function GET(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Try to get mock data based on the endpoint
  const mockData = getMockData(pathname);
  
  if (mockData) {
    return NextResponse.json({
      success: true,
      data: mockData,
      message: "Demo mode - using mock data",
      demoMode: true
    });
  }
  
  // Fallback response for unknown endpoints
  return NextResponse.json({
    success: true,
    data: [],
    message: "Demo mode - no data available for this endpoint",
    demoMode: true
  });
}

export async function POST(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  try {
    const body = await request.json();
    
    // Return success for POST requests in demo mode
    return NextResponse.json({
      success: true,
      message: "Demo mode - operation simulated successfully",
      data: body,
      demoMode: true
    });
  } catch {
    return NextResponse.json({
      success: true,
      message: "Demo mode - operation simulated successfully",
      demoMode: true
    });
  }
}

export async function PUT(request: NextRequest) {
  return POST(request);
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: "Demo mode - deletion simulated successfully",
    demoMode: true
  });
}