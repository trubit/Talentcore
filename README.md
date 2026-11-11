# TalentCore — Modern White-Label Talent & Recruitment Platform

TalentCore is a modern, modular, white-label recruitment and talent-matching platform engineered with Next.js 16, React 19, Tailwind CSS v4, and Drizzle ORM.

## Features

- **Public Job Board**: Filter and search active job listings, featured tags, and direct talent referral codes.
- **Talent & Candidate Network**: Seamless application workflows with dynamic customizable form schemas.
- **Admin Control Center**:
  - Full-featured Dashboard with real-time operational metrics.
  - Job posting, editing, duplication, and status lifecycle management.
  - Candidate profile and resume management.
  - Interactive custom form schema builder.
  - Automated interview and discovery call booking system with Google Calendar integration.
  - Secure message inquiry inbox and management.
  - White-label legal document center (Terms, Privacy, Agreements).
- **Neutral White-Label Design System**: Configurable design tokens and CSS variables ready for rapid branding adaptation.

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/talentcore
ADMIN_PASSWORD=your_secure_admin_password
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=talentcore-resumes
R2_PUBLIC_DOMAIN=
```

### 3. Database Migration & Seeding
```bash
npm run db:push
npx tsx src/lib/db/seed.ts
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 5. Production Build
```bash
npm run build
npm run start
```
