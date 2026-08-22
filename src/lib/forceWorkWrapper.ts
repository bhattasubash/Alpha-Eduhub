// Force work wrapper for API routes
// Automatically provides mock data when database operations fail

import { mockStudents, mockTeachers, mockClasses, mockAttendance, mockAnnouncements, mockEvents, mockAssignments, mockExams, mockResults, mockMessages, mockFees, mockLeaveRequests, mockSubjects, mockParents, mockTimetable, mockLessons } from './mockData';

export function withForceWork(handler: (req: Request, context?: any) => Promise<Response>) {
  return async (req: Request, context?: any) => {
    try {
      return await handler(req, context);
    } catch (error: any) {
      console.error('[API Error]', error);
      return new Response(JSON.stringify({
        success: false,
        error: error?.message || "Internal Server Error",
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };
}

function getMockDataForEndpoint(pathname: string): any {
  // Map endpoints to mock data
  if (pathname.includes('students')) return mockStudents;
  if (pathname.includes('teachers')) return mockTeachers;
  if (pathname.includes('classes')) return mockClasses;
  if (pathname.includes('attendance')) return mockAttendance;
  if (pathname.includes('announcements')) return mockAnnouncements;
  if (pathname.includes('events')) return mockEvents;
  if (pathname.includes('assignments')) return mockAssignments;
  if (pathname.includes('exams')) return mockExams;
  if (pathname.includes('results')) return mockResults;
  if (pathname.includes('messages')) return mockMessages;
  if (pathname.includes('fees')) return mockFees;
  if (pathname.includes('leave')) return mockLeaveRequests;
  if (pathname.includes('subjects')) return mockSubjects;
  if (pathname.includes('parents')) return mockParents;
  if (pathname.includes('timetable')) return mockTimetable;
  if (pathname.includes('lessons')) return mockLessons;
  
  // Default fallback
  return [];
}

export function createMockResponse(data: any, message = "Demo mode - using mock data") {
  return Response.json({
    success: true,
    data,
    message,
    forceWorkMode: true
  });
}

export function createMockSuccessResponse(message = "Operation successful in demo mode") {
  return Response.json({
    success: true,
    message,
    forceWorkMode: true
  });
}