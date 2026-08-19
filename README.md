# Alpha Edu Hub - School Management System

A production-level, full-stack School Management System built with modern technologies. Features multi-role authentication, complete academic management, and beautiful responsive design.

## 🚀 Deployment Update
- Fixed database connection with Supabase connection pooling
- Removed 3D packages for deployment stability
- Added pgbouncer=true for Prisma compatibility

## 🎯 Quick Demo

**Try the Demo Login**: [`/demo-login`](/demo-login)

Demo Credentials (Password: `demo123` for all):
- **Super Admin**: `superadmin` - Full system control
- **School Admin**: `admin` - School operations
- **Teacher**: `teacher` - Classroom management
- **Student**: `student` - Academic portal
- **Parent**: `parent` - Child monitoring

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
- **PostgreSQL** - Relational database
- **JWT Authentication** - Secure token-based auth
- **bcryptjs** - Password hashing

### Deployment
- **Render** - Cloud hosting platform
- **Vercel** - Frontend deployment
- **GitHub** - Version control

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- PostgreSQL database
- npm or yarn package manager

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/your-username/alpha-edu-hub.git
cd alpha-edu-hub
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment configuration**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/db_name"
JWT_ACCESS_SECRET="your_access_secret"
JWT_REFRESH_SECRET="your_refresh_secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloudinary_name"
NODE_ENV="development"
```

4. **Run database migrations**
```bash
npx prisma migrate dev
```

5. **Seed demo data**
```bash
npm run seed
```

6. **Start development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🚀 Deployment

### Quick Deploy Options

**Deploy to Render:**
- Push code to GitHub
- Create account at [render.com](https://render.com)
- Connect repository (uses `render.yaml` configuration)
- Set environment variables
- Deploy automatically

**Deploy to Vercel:**
- Push code to GitHub
- Create account at [vercel.com](https://vercel.com)
- Import project (uses `vercel.json` configuration)
- Set environment variables
- Deploy automatically

### Detailed Deployment Guide

See [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md) for comprehensive deployment instructions including:
- Render deployment with PostgreSQL
- Vercel deployment with external databases
- Environment variable configuration
- Database migration setup
- Custom domain configuration
- Troubleshooting common issues

## 📁 Project Structure

```
src/
├── app/
│   ├── (dashboard)/        # Main dashboard layouts
│   │   ├── admin/          # School admin portal
│   │   ├── teacher/        # Teacher portal
│   │   ├── student/        # Student portal
│   │   ├── parent/         # Parent portal
│   │   └── (super-admin)/  # Super admin portal
│   ├── api/                # API routes
│   ├── demo-login/         # Demo login page
│   ├── landing/            # Landing page
│   └── sign-in/            # Authentication
├── components/
│   ├── landing/            # Landing page components
│   └── ...                # Shared components
├── lib/                    # Utilities and configurations
└── context/                # React contexts
prisma/
├── schema.prisma           # Database schema
├── seed.ts                 # Demo data seeding
└── migrations/             # Database migrations
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Rate Limiting**: API protection against brute force attacks
- **Password Security**: bcrypt hashing with proper salt rounds
- **HTTP-Only Cookies**: Secure token storage
- **SQL Injection Prevention**: Prisma ORM parameterized queries
- **Role-Based Access**: Multi-level permission system

## 📱 Responsive Design

- Mobile-first approach
- Glass morphism design
- Smooth animations
- Accessible components
- Cross-browser compatibility

## 🎨 UI/UX Highlights

- Modern gradient color scheme
- Interactive components
- Real-time feedback
- Intuitive navigation
- Professional dashboard layouts

## 📊 Database Schema

The application uses PostgreSQL with the following main entities:
- Users (with role-based access)
- Schools (multi-tenancy support)
- Students, Teachers, Parents
- Classes, Grades, Subjects
- Attendance, Grades, Results
- Assignments, Lessons, Exams
- Announcements, Messages
- Fee management and payments

See `prisma/schema.prisma` for complete schema definition.

## 🧪 Testing Demo Access

The application includes a comprehensive demo login system at `/demo-login` that allows recruiters and stakeholders to:
- Experience different user roles instantly
- Explore all system features
- Test functionality without setup
- Switch between user perspectives

Default demo credentials (password: `demo123`):
- Super Admin: `superadmin`
- School Admin: `admin`
- Teacher: `teacher`
- Student: `student`
- Parent: `parent`

## 📖 Documentation

- [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md) - Comprehensive deployment instructions
- [`RECRUITER_GUIDE.md`](RECRUITER_GUIDE.md) - Project overview for recruiters
- [`CPANEL_DEPLOYMENT.md`](CPANEL_DEPLOYMENT.md) - cPanel deployment guide
- Code comments throughout the application

## 🤝 Contributing

This is a portfolio project demonstrating full-stack development skills. For suggestions or improvements, please feel free to open issues or submit pull requests.

## 📝 License

This project is for demonstration purposes.

## 🎯 Key Demonstrated Skills

- Full-stack development (Next.js, TypeScript, PostgreSQL)
- Database design and optimization (Prisma ORM)
- Authentication and security (JWT, bcrypt)
- API design and implementation
- Responsive UI/UX design
- DevOps and deployment (Render, Vercel)
- Multi-tenant architecture
- Real-time dashboard development

## 🏆 Why This Project

This School Management System demonstrates:
- **Production-Ready Code**: Not just a demo, but a deployable application
- **Modern Stack**: Latest technologies and best practices
- **Complete Solution**: Frontend, backend, database, and deployment
- **Security Conscious**: Industry-standard security practices
- **User-Centric**: Designed with actual user workflows
- **Scalable Architecture**: Built to grow with requirements

---

**Try the demo login at `/demo-login` to experience the full system!**

## 👨‍💻 Developer

**Mahammad Bilal Hyder**
- LinkedIn: [linkedin.com/in/mahammad-bilal-hyder-493295356](https://www.linkedin.com/in/mahammad-bilal-hyder-493295356)
- Email: alphaeduhub360@gmail.com#   p r o j e c t s 
 
 #   a l p h a - e d u - h u b 
 
 