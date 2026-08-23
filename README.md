# 🏥 Healthcare Appointment Manager

A production-grade full-stack application for managing healthcare appointments, doctor availability, AI-powered visit summaries, and calendar synchronization.

## 🚀 Live Demo

- **Frontend:** https://healthcare-appointment-manager-clie.vercel.app
- **Backend API:** https://healthcare-appointment-manager-zfsp.onrender.com
- **API Docs:** https://healthcare-appointment-manager-zfsp.onrender.com/docs

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@healthcare.local | Admin@123 |
| **Doctor** | arjun.mehta@healthcare.local | Admin@123 |
| **Patient** | Create new account via registration |

## 📋 Features

- ✅ **Authentication** - JWT with refresh token rotation
- ✅ **Role-Based Access** - Admin, Doctor, Patient roles
- ✅ **Appointment Management** - Book, reschedule, cancel, status updates
- ✅ **Doctor Availability** - Schedule management with leave tracking
- ✅ **AI Summaries** - Pre-visit and post-visit summaries (OpenAI)
- ✅ **Email Notifications** - SMTP integration with delivery tracking
- ✅ **Google Calendar** - OAuth synchronization
- ✅ **In-App Notifications** - Real-time notification system
- ✅ **Medication Reminders** - Schedule and tracking
- ✅ **Background Jobs** - Durable job processing with BullMQ
- ✅ **API Documentation** - Swagger/OpenAPI

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS

### Backend
- Node.js + Express
- TypeScript
- Zod (Validation)
- Winston (Logging)

### Database & Infrastructure
- PostgreSQL
- Prisma ORM
- Redis + BullMQ

### Integrations
- OpenAI API (AI summaries)
- SMTP (Emails)
- Google Calendar API

## 📁 Project Structure
Healthcare-Appointment-Manager/
├── frontend/ # React frontend
│ ├── src/
│ └── package.json
├── backend/ # Express backend
│ ├── prisma/ # Database schema
│ ├── src/
│ │ ├── ai/ # LLM summary generation
│ │ ├── appointments/ # Appointment lifecycle
│ │ ├── auth/ # JWT authentication
│ │ ├── availability/ # Doctor availability
│ │ ├── calendar/ # Google Calendar integration
│ │ ├── common/ # Shared utilities
│ │ ├── config/ # Environment configuration
│ │ ├── doctors/ # Doctor management
│ │ ├── email/ # Email service
│ │ ├── jobs/ # Background jobs
│ │ ├── leave/ # Leave management
│ │ ├── middleware/ # Error handling, auth
│ │ ├── notifications/ # Notification service
│ │ ├── patients/ # Patient management
│ │ └── reminders/ # Medication reminders
│ └── package.json
├── docs/ # Documentation
├── docker/ # Docker configuration


## 🔧 Installation

### Prerequisites
- Node.js 20.19+
- pnpm (via Corepack)
- PostgreSQL
- Redis

### Setup

```bash
# 1. Enable Corepack and install dependencies
corepack enable
pnpm install

# 2. Copy environment variables
cp .env.example .env

# 3. Configure your .env file (see Environment Variables section)

# 4. Setup database
pnpm --filter @healthcare/server prisma:generate
pnpm --filter @healthcare/server prisma:migrate
pnpm --filter @healthcare/server prisma:seed

# 5. Run development server
npm run dev

# 6. Build for production
npm build


 Security Features
✅ JWT with refresh token rotation

✅ Bcrypt password hashing

✅ Role-based access control

✅ Zod validation on all inputs

✅ Helmet.js security headers

✅ CORS configured

✅ Request ID tracking

✅ Centralized error handling

🗄️ Database Schema
Key entities:

User (with role: ADMIN, DOCTOR, PATIENT)

PatientProfile

DoctorProfile

DoctorAvailability

DoctorLeave

Appointment

SymptomSubmission

LLMSummary

EmailLog

Notification

CalendarConnection

CalendarEvent

MedicationReminder

BackgroundJob
