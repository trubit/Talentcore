import { db } from "@/lib/db";
import { formSchemas } from "@/lib/db/schema";
import HeroSection from "@/components/sections/HeroSection";
import TrustBanner from "@/components/sections/TrustBanner";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import WhyChooseUsSection from "@/components/sections/WhyChooseUsSection";
import FindTalentsSection from "@/components/sections/FindTalentsSection";
import JobBoardSection from "@/components/sections/JobBoardSection";
import StatsSection from "@/components/sections/StatsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CTASection from "@/components/sections/CTASection";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let employerSchema: any[] = [];
  let graduateSchema: any[] = [];

  try {
    const schemas = await db.select().from(formSchemas);
    const empMatch = schemas.find((s) => s.id === "candidate_request");
    const gradMatch = schemas.find((s) => s.id === "application");

    if (empMatch && Array.isArray(empMatch.schemaDefinition)) {
      employerSchema = empMatch.schemaDefinition;
    }
    if (gradMatch && Array.isArray(gradMatch.schemaDefinition)) {
      graduateSchema = gradMatch.schemaDefinition;
    }
  } catch (error) {
    console.error("[BACKEND] Error loading schemas for homepage:", error);
  }

  return (
    <main className="min-h-screen bg-brand-white">
      <HeroSection />
      <TrustBanner />
      <HowItWorksSection employerSchema={employerSchema} graduateSchema={graduateSchema} />
      <WhyChooseUsSection />
      <FindTalentsSection />
      <JobBoardSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}
