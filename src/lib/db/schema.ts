import { 
  pgTable, uuid, varchar, text, jsonb, timestamp, 
  pgEnum, boolean, index, integer 
} from 'drizzle-orm/pg-core';

// ==========================================
// ENUMS
// ==========================================

export const jobStatusEnum = pgEnum('job_status', [
  'ACTIVE',
  'CLOSED',
  'ARCHIVED',
]);

export const candidateStatusEnum = pgEnum('candidate_status', [
  'AVAILABLE',
  'IN_REVIEW',
  'PLACED',
]);

export const messageStatusEnum = pgEnum('message_status', [
  'NEW',
  'READ',
  'REPLIED',
]);

export const bookingStatusEnum = pgEnum('booking_status', [
  'CONFIRMED',
  'CANCELLED',
  'COMPLETED',
]);

// ==========================================
// CORE PLATFORM TABLES
// ==========================================

// 1. Admin Users (For Dashboard Access & Settings)
export const admins = pgTable('admins', {
  id: uuid('id').defaultRandom().primaryKey(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. Job Board Table
export const jobs = pgTable('jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  industry: varchar('industry', { length: 100 }).notNull(),
  salary: varchar('salary', { length: 100 }).notNull(),
  empType: varchar('emp_type', { length: 100 }).notNull(), 
  workMode: varchar('work_mode', { length: 100 }).notNull(), 
  description: text('description').notNull(),
  skillBadges: varchar('skill_badges', { length: 255 }), 
  applicationMethod: varchar('application_method', { length: 255 }).notNull(), 
  gradFillCode: varchar('gradfill_code', { length: 50 }),
  isFeatured: boolean('is_featured').default(false).notNull(),
  status: jobStatusEnum('status').default('ACTIVE').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(), 
}, (table) => {
  return {
    statusIdx: index('job_status_idx').on(table.status),
  };
});

// 3. Candidates Table
export const candidates = pgTable('candidates', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  status: candidateStatusEnum('status').default('AVAILABLE').notNull(),
  badges: jsonb('badges').default('[]').notNull(), 
  resumeUrl: text('resume_url'), 
  bio: text('bio'),
  linkedinUrl: text('linkedin_url'),
  portfolioUrl: text('portfolio_url'),
  experience: jsonb('experience').default('[]'),
  education: jsonb('education').default('[]'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    candidateStatusIdx: index('candidate_status_idx').on(table.status),
  };
});

// 4. Contact Messages Table (Inbox)
export const contactMessages = pgTable('contact_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  message: text('message').notNull(),
  status: messageStatusEnum('status').default('NEW').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==========================================
// SYSTEM & AUTOMATION TABLES
// ==========================================

// Form Submissions
export const formSubmissions = pgTable('form_submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  formId: varchar('form_id', { length: 50 }).notNull(),
  data: jsonb('data').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    formIdIdx: index('form_id_idx').on(table.formId),
  };
});

// Admin-defined Form Configurations
export const formSchemas = pgTable('form_schemas', {
  id: varchar('id', { length: 50 }).primaryKey(), 
  schemaDefinition: jsonb('schema_definition').notNull(), 
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==========================================
// CALENDAR & SCHEDULING (CALENDLY-STYLE)
// ==========================================

// 1. Admin Availability Rules
export const availabilitySettings = pgTable('availability_settings', {
  id: varchar('id', { length: 50 }).primaryKey().default('default'),
  // Weekly active days & operating hours
  weeklySchedule: jsonb('weekly_schedule').notNull().default({
    mon: { enabled: true, start: "09:00", end: "17:00" },
    tue: { enabled: true, start: "09:00", end: "17:00" },
    wed: { enabled: true, start: "09:00", end: "17:00" },
    thu: { enabled: true, start: "09:00", end: "17:00" },
    fri: { enabled: true, start: "09:00", end: "17:00" },
    sat: { enabled: false, start: "10:00", end: "14:00" },
    sun: { enabled: false, start: "10:00", end: "14:00" },
  }),
  slotDuration: integer('slot_duration').default(15).notNull(), // In minutes (e.g. 15 or 30)
  bufferTime: integer('buffer_time').default(15).notNull(),     // Buffer between calls
  minNoticeHours: integer('min_notice_hours').default(2).notNull(), // Can't book calls starting in < 2 hrs
  maxDaysInFuture: integer('max_days_in_future').default(14).notNull(), // How far out users can book
  timezone: varchar('timezone', { length: 100 }).default('Africa/Lagos').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 2. Scheduled Bookings Table
export const bookings = pgTable('bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  employerEmail: varchar('employer_email', { length: 255 }).notNull(),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  contactName: varchar('contact_name', { length: 255 }), // Contact person name
  scheduledAt: timestamp('scheduled_at').notNull(),       // Meeting start time
  durationMinutes: integer('duration_minutes').default(15).notNull(), // Duration
  meetLink: text('meet_link'),                            // Google Meet / Hangout link
  calendarEventId: varchar('calendar_event_id', { length: 255 }), // For Google Calendar sync/cancellation
  notes: text('notes'),                                   // Call notes or role details
  status: varchar('status', { length: 50 }).default('CONFIRMED').notNull(), // 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    scheduledAtIdx: index('booking_scheduled_at_idx').on(table.scheduledAt),
    statusIdx: index('booking_status_idx').on(table.status),
    emailIdx: index('booking_email_idx').on(table.employerEmail),
  };
});

// Legal Documents
export const legalDocs = pgTable('legal_docs', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(), 
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  isPublic: boolean('is_public').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// System Preferences Table (Single Row configuration)
export const systemPreferences = pgTable('system_preferences', {
  id: varchar('id', { length: 50 }).primaryKey(),
  defaultJobExpiry: integer('default_job_expiry').default(14).notNull(),
  emailNotifications: boolean('email_notifications').default(true).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});