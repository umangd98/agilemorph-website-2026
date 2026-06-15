import type { Metadata } from "next";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  HeroSection,
  ProcessSection,
  ServicesSection,
  WhyUsSection,
  StatsSection,
  TestimonialsSection,
} from "@/components/sections";

export const metadata: Metadata = {
  title: "AGILEMORPH | Digital Accelerators",
  description:
    "We revolutionize efficiency with AI Automation, craft impactful experiences through Web Development, and amplify influence via Digital Marketing.",
};

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="flex-1">
        <HeroSection />
        <ProcessSection />
        <ServicesSection />
        <WhyUsSection />
        <StatsSection />
        <TestimonialsSection />
      </main>

      <Footer />
    </>
  );
}
