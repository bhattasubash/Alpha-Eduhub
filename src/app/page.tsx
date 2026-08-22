"use client";

import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import RolesSection from "@/components/landing/RolesSection";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import ContactCTA from "@/components/landing/ContactCTA";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main className="bg-paper text-ink min-h-screen selection:bg-ledger/20 selection:text-ink">
      <Navbar />
      <Hero />
      <Features />
      <RolesSection />
      <Pricing />
      <FAQ />
      <ContactCTA />
      <Footer />
    </main>
  );
}