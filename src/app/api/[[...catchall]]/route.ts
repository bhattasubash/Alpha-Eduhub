import { NextRequest, NextResponse } from 'next/server';
import { getMockData } from '@/lib/mockData';

// Catch-all API route for force work mode
// Provides mock data when specific API routes fail or don't exist

export async function GET(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log(`Catch-all API handling GET: ${pathname}`);
  
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
  
  // Check for specific patterns and return appropriate mock data
  if (pathname.includes('parents')) {
    return NextResponse.json({
      success: true,
      data: [
        { id: "1", name: "John Doe", email: "parent1@demo.edu", phone: "1234567890", studentId: "1", studentName: "Student 1" },
        { id: "2", name: "Jane Smith", email: "parent2@demo.edu", phone: "0987654321", studentId: "2", studentName: "Student 2" }
      ],
      message: "Demo mode - using mock data",
      demoMode: true
    });
  }
  
  if (pathname.includes('classes')) {
    return NextResponse.json({
      success: true,
      data: [
        { id: "1", name: "10A", section: "A", capacity: 30, students: 25 },
        { id: "2", name: "10B", section: "B", capacity: 28, students: 22 },
        { id: "3", name: "9A", section: "A", capacity: 32, students: 28 }
      ],
      message: "Demo mode - using mock data",
      demoMode: true
    });
  }
  
  if (pathname.includes('subjects')) {
    return NextResponse.json({
      success: true,
      data: [
        { id: "1", name: "Mathematics", code: "MATH101", classes: ["10A", "10B"] },
        { id: "2", name: "Science", code: "SCI101", classes: ["9A", "10A"] },
        { id: "3", name: "English", code: "ENG101", classes: ["10A", "10B", "9A"] }
      ],
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
  
  console.log(`Catch-all API handling POST: ${pathname}`);
  
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