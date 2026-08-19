# Alpha Edu Hub - School Management System

A production-level, full-stack School Management System built with modern technologies. Features multi-role authentication, complete academic management, and beautiful responsive design.

## 🚀 Deployment Update
- Fixed database connection with Supabase connection pooling
- Removed 3D packages for deployment stability
- Added pgbouncer=true for Prisma compatibility

## 🎯 Quick Demo

**Try the Demo Login**: [`/demo-login`](/demo-login)

Demo Credentials (Password: `demo123` for all):
- **Super Admin**: `superadmin@alphaeduhub.com` - Full system control
- **School Admin**: `admin@demoschool.edu` - School operations
- **Teacher**: `teacher@demoschool.edu` - Classroom management
- **Student**: `student@demoschool.edu` - Academic portal
- **Parent**: `parent@demoschool.edu` - Child monitoring

## 🚀 Features

### Multi-Role System
- **Super Admin**: Manage multiple schools and system-wide settings
- **School Admin**: Complete school management and user administration
- **Teacher**: Classroom management, grades, assignments, and attendance
- **Student**: View grades, attendance, assignments, and timetables
- **Parent**: Monitor child's academic progress and communicate with school

### Core Functionality
- 📊 **Dashboard Analytics**: Real-time data visualization and insights
- 👥 **User Management**: Role-based access control and administration
- 📚 **Academic Management**: Grades, subjects, classes, and lessons
- 📋 **Attendance Tracking**: Daily attendance with comprehensive reporting
- 💰 **Fee Management**: Payment tracking, invoicing, and financial reports
- 📝 **Assignment System**: Homework distribution, submission, and grading
- 🗓️ **Exam Management**: Exam scheduling, result processing, and analytics
- 📢 **Announcements**: School-wide communications and notifications
- 💬 **Messaging System**: Internal communication between users
- 📈 **Reports Generation**: Various administrative and academic reports

## 🛠️ Technology Stack

### Frontend
- **Next.js 14.2.5** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Advanced animations
- **Lucide React** - Modern icon library
- **React Hook Form** - Form management
- **Recharts** - Data visualization

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Relational database (Supabase)
- **JWT Authentication** - Secure token-based auth
- **bcryptjs** - Password hashing

### Deployment
- **Vercel** - Frontend deployment
- **Supabase** - Database hosting
- **GitHub** - Version control

## � Setup Demo Users

To create demo users in your database, run:

```javascript
fetch('/api/setup-demo', { method: 'POST' })
  .then(r => r.json())
  .then(console.log);
```

## � Environment Variables

Required for deployment:
```env
DATABASE_URL=postgresql://postgres:password@pooler.supabase.com:6543/postgres?pgbouncer=true
JWT_ACCESS_SECRET=your_secure_secret
JWT_REFRESH_SECRET=your_secure_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NODE_ENV=production
```

## 👨‍💻 Developer

**Mahammad Bilal Hyder**
- LinkedIn: [linkedin.com/in/mahammad-bilal-hyder-493295356](https://www.linkedin.com/in/mahammad-bilal-hyder-493295356)
- Email: alphaeduhub360@gmail.com