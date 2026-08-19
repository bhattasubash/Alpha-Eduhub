"use client";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import dynamic from "next/dynamic";

// Bulletproof dynamic imports with fallbacks
const PortfolioNavbar = dynamic(() => import("@/components/portfolio/PortfolioNavbar").catch(() => ({ default: () => null })), { ssr: true });
const PortfolioHero = dynamic(() => import("@/components/landing/PortfolioHero").catch(() => ({ default: () => <div className="p-8 text-white">Loading...</div> })), { ssr: true });
const WhyMe = dynamic(() => import("@/components/landing/WhyMe").catch(() => ({ default: () => null })), { ssr: true });
const FeaturedProject = dynamic(() => import("@/components/landing/FeaturedProject").catch(() => ({ default: () => null })), { ssr: true });
const AllProjects = dynamic(() => import("@/components/landing/AllProjects").catch(() => ({ default: () => null })), { ssr: true });
const WhatIBuilt = dynamic(() => import("@/components/landing/WhatIBuilt").catch(() => ({ default: () => null })), { ssr: true });
const Achievements = dynamic(() => import("@/components/landing/Achievements").catch(() => ({ default: () => null })), { ssr: true });
const Resume = dynamic(() => import("@/components/landing/Resume").catch(() => ({ default: () => <div className="p-8 text-white">Resume unavailable</div> })), { ssr: false });
const CityScene = dynamic(() => import("@/components/3d/CityScene").catch(() => ({ default: () => null })), { ssr: false });
const HiringCTA = dynamic(() => import("@/components/landing/HiringCTA").catch(() => ({ default: () => null })), { ssr: true });
const RecruiterQuickView = dynamic(() => import("@/components/landing/RecruiterQuickView").catch(() => ({ default: () => null })), { ssr: true });
const PortfolioFooter = dynamic(() => import("@/components/portfolio/PortfolioFooter").catch(() => ({ default: () => <div className="p-8 text-white text-center">© 2024</div> })), { ssr: true });
const WebCursor = dynamic(() => import("@/components/ui/WebCursor").catch(() => ({ default: () => null })), { ssr: false });
const LoadingScreen = dynamic(() => import("@/components/ui/LoadingScreen").catch(() => ({ default: () => null })), { ssr: true });

export default function HomePage() {
  return (
    <ErrorBoundary>
      <main className="bg-[#050816] min-h-screen overflow-x-hidden">
        <LoadingScreen />
        <WebCursor />
        <CityScene />
        
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10">
          <RecruiterQuickView />
          <PortfolioNavbar />
          <PortfolioHero />
          <WhyMe />
          <FeaturedProject />
          <AllProjects />
          <WhatIBuilt />
          <Achievements />
          <Resume />
          <HiringCTA />
          <PortfolioFooter />
        </div>
      </main>
    </ErrorBoundary>
  );
}