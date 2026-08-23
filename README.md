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
