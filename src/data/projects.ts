export interface Project {
  id: string;
  name: string;
  category: "Web" | "Backend" | "Mobile" | "AI" | "Other";
  shortDescription: string;
  description: string;
  problem?: string;
  solution?: string;
  technologies: string[];
  features: string[];
  challenges?: string[];
  myContribution?: string[];
  whatIBuilt?: string[];
  technicalArchitecture?: string;
  authentication?: string;
  roleBasedAccess?: string[];
  image?: string;
  liveDemo?: string;
  github?: string;
  demoLogin?: string;
  screenshots?: string[];
  whatILearned?: string[];
  pricing?: {
    plans: Array<{
      name: string;
      price: string;
      period?: string;
      features: string[];
      popular?: boolean;
    }>;
  };
  appUrl?: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: "alpha-edu-hub",
    name: "Alpha Edu Hub",
    category: "Web",
    shortDescription: "Complete school management platform with multi-role authentication and full-stack architecture",
    description: "Alpha Edu Hub is a comprehensive school management system that handles student records, attendance, grades, exams, assignments, and parent communication. It's a fully functional full-stack application with authentication, role-based access control, and a complete database schema.",
    problem: "Schools struggle with managing multiple systems for attendance, grades, and communication. This platform unifies everything into one intuitive interface with role-based dashboards for each user type.",
    solution: "Built a complete full-stack platform with 5+ user roles, 60+ REST API endpoints, PostgreSQL database with 20+ models, JWT authentication, and role-based access control.",
    technologies: [
      "Next.js 14",
      "React 18",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Prisma ORM",
      "JWT Authentication",
      "Tailwind CSS",
      "Framer Motion",
      "Recharts"
    ],
    features: [
      "Multi-role authentication (5+ user roles)",
      "60+ REST API endpoints",
      "20+ database models with relationships",
      "Role-based access control",
      "Real-time dashboard analytics",
      "Student attendance tracking",
      "Grade and exam management",
      "Parent communication portal"
    ],
    whatIBuilt: [
      "Complete frontend with Next.js 14 and React 18",
      "60+ REST API endpoints with Next.js API Routes",
      "PostgreSQL database schema with 20+ models",
      "JWT authentication system with refresh tokens",
      "Role-based access control for 5+ user types",
      "Dashboard analytics with data visualization",
      "Responsive design with Tailwind CSS",
      "Production deployment configuration"
    ],
    technicalArchitecture: "Frontend (Next.js 14) → API Routes (Node.js) → Database (PostgreSQL) with Prisma ORM. JWT-based authentication with access tokens (15min) and refresh tokens (7days). Role-based middleware for route protection.",
    authentication: "JWT authentication with HTTP-only cookies. Password hashing with bcryptjs (12 salt rounds). Access tokens (15min expiry) + Refresh tokens (7days expiry). Role-based authorization middleware.",
    roleBasedAccess: [
      "Super Admin: Full system control & multi-school management",
      "School Admin: School operations & user management",
      "Teacher: Classroom management & grading",
      "Student: Academic portal & progress tracking",
      "Parent: Child monitoring & communication"
    ],
    liveDemo: "/demo-login",
    github: "https://github.com/bilalhydercodes",
    demoLogin: "/demo-login",
    appUrl: "/app",
    pricing: {
      plans: [
        {
          name: "Starter",
          price: "Free",
          period: "forever",
          features: [
            "Up to 100 students",
            "Basic attendance tracking",
            "Grade management",
            "Parent communication",
            "Email support"
          ]
        },
        {
          name: "Professional",
          price: "₹20",
          period: "per month",
          popular: true,
          features: [
            "Up to 500 students",
            "Advanced analytics",
            "Custom reports",
            "API access",
            "Priority support",
            "Multi-teacher access",
            "Exam management",
            "Assignment tracking"
          ]
        },
        {
          name: "Enterprise",
          price: "Custom",
          period: "pricing",
          features: [
            "Unlimited students",
            "White-label solution",
            "Custom integrations",
            "Dedicated server",
            "24/7 phone support",
            "On-site training",
            "Custom development",
            "SLA guarantee"
          ]
        }
      ]
    },
    featured: true
  }
];

export const getFeaturedProject = (): Project | undefined => {
  return projects.find(project => project.featured);
};

export const getProjectById = (id: string): Project | undefined => {
  return projects.find(project => project.id === id);
};

export const getProjectsByCategory = (category: string): Project[] => {
  if (category === "All") return projects;
  return projects.filter(project => project.category === category);
};

export const getCategories = (): string[] => {
  const categories = new Set(projects.map(project => project.category));
  return ["All", ...Array.from(categories)];
};
