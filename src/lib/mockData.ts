// Mock data system for force work mode
// Provides fallback data when database is not available

export const mockStudents = [
  { id: "1", username: "student1", email: "student1@demo.edu", name: "John Doe", class: "10A", section: "A" },
  { id: "2", username: "student2", email: "student2@demo.edu", name: "Jane Smith", class: "10B", section: "B" },
  { id: "3", username: "student3", email: "student3@demo.edu", name: "Bob Johnson", class: "9A", section: "A" },
];

export const mockTeachers = [
  { id: "1", username: "teacher1", email: "teacher1@demo.edu", name: "Dr. Smith", subject: "Mathematics" },
  { id: "2", username: "teacher2", email: "teacher2@demo.edu", name: "Ms. Johnson", subject: "Science" },
];

export const mockClasses = [
  { id: "1", name: "10A", section: "A", capacity: 30 },
  { id: "2", name: "10B", section: "B", capacity: 28 },
  { id: "3", name: "9A", section: "A", capacity: 32 },
];

export const mockAttendance = [
  { id: "1", studentId: "1", date: "2026-08-19", status: "present" },
  { id: "2", studentId: "2", date: "2026-08-19", status: "present" },
  { id: "3", studentId: "3", date: "2026-08-19", status: "absent" },
];

export const mockAnnouncements = [
  { id: "1", title: "School Event", content: "Annual day celebration on Friday", date: "2026-08-19" },
  { id: "2", title: "Exam Schedule", content: "Mid-term exams start next week", date: "2026-08-18" },
];

export const mockEvents = [
  { id: "1", title: "Annual Day", date: "2026-08-25", type: "cultural" },
  { id: "2", title: "Sports Day", date: "2026-09-10", type: "sports" },
];

export const mockAssignments = [
  { id: "1", title: "Math Homework", subject: "Mathematics", dueDate: "2026-08-22" },
  { id: "2", title: "Science Project", subject: "Science", dueDate: "2026-08-25" },
];

export const mockExams = [
  { id: "1", title: "Mid-term Math", subject: "Mathematics", date: "2026-08-28" },
  { id: "2", title: "Science Quiz", subject: "Science", date: "2026-08-30" },
];

export const mockResults = [
  { id: "1", studentId: "1", subject: "Mathematics", marks: 85, total: 100 },
  { id: "2", studentId: "1", subject: "Science", marks: 78, total: 100 },
];

export const mockMessages = [
  { id: "1", from: "teacher1@demo.edu", to: "student1@demo.edu", subject: "Homework Reminder", content: "Please submit your math homework" },
];

export const mockFees = [
  { id: "1", studentId: "1", amount: 5000, status: "paid", dueDate: "2026-08-15" },
  { id: "2", studentId: "2", amount: 5000, status: "pending", dueDate: "2026-08-20" },
];

export const mockLeaveRequests = [
  { id: "1", studentId: "1", type: "sick", startDate: "2026-08-20", endDate: "2026-08-21", status: "pending" },
];

export const mockSubjects = [
  { id: "1", name: "Mathematics", code: "MATH101" },
  { id: "2", name: "Science", code: "SCI101" },
  { id: "3", name: "English", code: "ENG101" },
];

export const mockParents = [
  { id: "1", name: "Mr. Doe", email: "parent1@demo.edu", phone: "1234567890", studentId: "1" },
  { id: "2", name: "Mrs. Smith", email: "parent2@demo.edu", phone: "0987654321", studentId: "2" },
];

export const mockTimetable = [
  { id: "1", day: "Monday", period: 1, subject: "Mathematics", teacherId: "1", classId: "1" },
  { id: "2", day: "Monday", period: 2, subject: "Science", teacherId: "2", classId: "1" },
];

export const mockLessons = [
  { id: "1", title: "Introduction to Algebra", subject: "Mathematics", classId: "1" },
  { id: "2", title: "Basic Physics", subject: "Science", classId: "1" },
];

// Helper function to get mock data based on endpoint
export function getMockData(endpoint: string) {
  const dataMap: Record<string, any> = {
    '/api/students': mockStudents,
    '/api/teachers': mockTeachers,
    '/api/classes': mockClasses,
    '/api/attendance': mockAttendance,
    '/api/announcements': mockAnnouncements,
    '/api/events': mockEvents,
    '/api/assignments': mockAssignments,
    '/api/exams': mockExams,
    '/api/results': mockResults,
    '/api/messages': mockMessages,
    '/api/fees': mockFees,
    '/api/leave': mockLeaveRequests,
    '/api/subjects': mockSubjects,
    '/api/parents': mockParents,
    '/api/timetable': mockTimetable,
    '/api/lessons': mockLessons,
  };

  // Find matching endpoint
  for (const [key, value] of Object.entries(dataMap)) {
    if (endpoint.includes(key.replace('/api/', ''))) {
      return value;
    }
  }

  return null;
}