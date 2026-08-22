"use client";

import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import TrustedBy from "@/components/landing/TrustedBy";
import Features from "@/components/landing/Features";
import DashboardPreview from "@/components/landing/DashboardPreview";
import WebApp from "@/components/landing/WebApp";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import TechnicalArchitecture from "@/components/landing/TechnicalArchitecture";
import FAQ from "@/components/landing/FAQ";
import ContactCTA from "@/components/landing/ContactCTA";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main className="bg-[#050816] min-h-screen overflow-x-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-indigo-600/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <TrustedBy />
        <Features />
        <DashboardPreview />
        <WebApp />
        <Testimonials />
        <Pricing />
        <TechnicalArchitecture />
        <FAQ />
        <ContactCTA />
        <Footer />
      </div>
    </main>
  );
}