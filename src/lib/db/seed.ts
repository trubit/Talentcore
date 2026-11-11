import "dotenv/config";
import { db } from "@/lib/db";
import { formSchemas } from "./schema";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding all 8 TalentCore service forms into database...");

  const allSchemas = [
    // 1. ONBOARDING: Graduate Application
    {
      id: "application",
      schemaDefinition: [
        { id: "fullName", label: "Full Name", type: "text", required: true },
        { id: "email", label: "Email Address", type: "email", required: true },
        { id: "phone", label: "Phone Number / WhatsApp", type: "text", required: true },
        { id: "primarySkill", label: "Primary Skill / Track", type: "select", required: true, options: "Software Engineering, Product Design, Marketing & Growth, Data & Analytics, Operations, Other" },
        { id: "experienceLevel", label: "Experience Level", type: "select", required: true, options: "Fresh Graduate / Entry Level, 1-2 Years, 3+ Years" },
        { id: "resumeUrl", label: "Resume / CV Upload", type: "file", required: true },
        { id: "portfolioUrl", label: "Portfolio / LinkedIn Link", type: "text", required: false },
      ],
    },

    // 2. ONBOARDING: Employer Request
    {
      id: "candidate_request",
      schemaDefinition: [
        { id: "companyName", label: "Company Name", type: "text", required: true },
        { id: "workEmail", label: "Work Email", type: "email", required: true },
        { id: "contactPerson", label: "Contact Person & Role", type: "text", required: true },
        { id: "roleHiringFor", label: "Role Hiring For", type: "text", required: true },
        { id: "workMode", label: "Work Mode", type: "select", required: true, options: "Remote, On-site, Hybrid" },
        { id: "budgetRange", label: "Monthly Salary Budget", type: "text", required: true },
        { id: "jobRequirements", label: "Role Requirements & Description", type: "textarea", required: true },
      ],
    },

    // 3. EMPLOYER SERVICE: Job Listing
    {
      id: "job_listing",
      schemaDefinition: [
        { id: "companyName", label: "Company / Brand Name", type: "text", required: true },
        { id: "jobTitle", label: "Job Title", type: "text", required: true },
        { id: "empType", label: "Employment Type", type: "select", required: true, options: "Full Time, Part Time, Contract, Internship" },
        { id: "location", label: "Location", type: "text", required: true },
        { id: "salaryRange", label: "Salary Range", type: "text", required: true },
        { id: "jobDescription", label: "Job Description & Requirements", type: "textarea", required: true },
        { id: "applicationMethod", label: "Application Link or Email", type: "text", required: true },
      ],
    },

    // 4. EMPLOYER SERVICE: Job Matching
    {
      id: "job_matching",
      schemaDefinition: [
        { id: "companyName", label: "Company Name", type: "text", required: true },
        { id: "workEmail", label: "Official Email", type: "email", required: true },
        { id: "rolesCount", label: "Number of Candidates Needed", type: "select", required: true, options: "1 Candidate, 2-5 Candidates, Bulk Hiring (5+)" },
        { id: "roleProfiles", label: "Desired Candidate Roles / Profiles", type: "textarea", required: true },
        { id: "hiringTimeline", label: "Hiring Urgency", type: "select", required: true, options: "Immediate (Within 48 hrs), Within 2 Weeks, Flexible" },
      ],
    },

    // 5. EMPLOYER SERVICE: Outsource HR
    {
      id: "outsource_hr",
      schemaDefinition: [
        { id: "companyName", label: "Company Name", type: "text", required: true },
        { id: "workEmail", label: "Work Email", type: "email", required: true },
        { id: "companySize", label: "Current Team Size", type: "select", required: true, options: "1-10, 11-50, 51-200, 200+" },
        { id: "serviceScope", label: "Required HR Services", type: "select", required: true, options: "End-to-End Recruitment, Payroll Management, Compliance & Legal, Full HR Department Setup" },
        { id: "timeline", label: "Target Start Date", type: "text", required: true },
        { id: "details", label: "Specific HR Challenges / Needs", type: "textarea", required: true },
      ],
    },

    // 6. CANDIDATE SERVICE: Job Placement
    {
      id: "job_placement",
      schemaDefinition: [
        { id: "fullName", label: "Full Name", type: "text", required: true },
        { id: "email", label: "Email Address", type: "email", required: true },
        { id: "phone", label: "Phone / WhatsApp", type: "text", required: true },
        { id: "targetRole", label: "Target Job Role", type: "text", required: true },
        { id: "expectedSalary", label: "Expected Monthly Salary Range", type: "text", required: true },
        { id: "resumeUrl", label: "Current CV / Resume", type: "file", required: true },
      ],
    },

    // 7. CANDIDATE SERVICE: Career Readiness
    {
      id: "career_readiness",
      schemaDefinition: [
        { id: "fullName", label: "Full Name", type: "text", required: true },
        { id: "email", label: "Email Address", type: "email", required: true },
        { id: "currentStatus", label: "Current Employment Status", type: "select", required: true, options: "Unemployed / Recent Graduate, Employed (Seeking Transition), Student" },
        { id: "coachingTrack", label: "Coaching Focus Area", type: "select", required: true, options: "Interview Prep, Tech Portfolio Building, Soft Skills & Communication, LinkedIn & Personal Brand" },
        { id: "goals", label: "Primary Career Goal", type: "textarea", required: true },
      ],
    },

    // 8. CANDIDATE SERVICE: Resume Writing
    {
      id: "resume_writing",
      schemaDefinition: [
        { id: "fullName", label: "Full Name", type: "text", required: true },
        { id: "email", label: "Email Address", type: "email", required: true },
        { id: "targetIndustry", label: "Target Industry / Role", type: "text", required: true },
        { id: "careerLevel", label: "Career Stage", type: "select", required: true, options: "Fresh Graduate, Mid-Level, Executive / Senior" },
        { id: "resumeUrl", label: "Existing Resume File", type: "file", required: true },
        { id: "notes", label: "Specific Highlights or Accomplishments to Feature", type: "textarea", required: false },
      ],
    },
  ];

  try {
    for (const schema of allSchemas) {
      await db
        .insert(formSchemas)
        .values(schema)
        .onConflictDoUpdate({
          target: formSchemas.id,
          set: {
            schemaDefinition: schema.schemaDefinition,
            updatedAt: sql`NOW()`,
          },
        });
    }

    console.log("✅ All 8 TalentCore service form schemas synchronized with database!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    process.exit(0);
  }
}

seed();