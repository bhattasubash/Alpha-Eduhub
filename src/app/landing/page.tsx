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

export default function LandingPage() {
  return (
    <main className="bg-slate-950 min-h-screen text-slate-100 overflow-x-hidden">
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
    </main>
  );
}
