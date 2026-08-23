import { UserRole, type UserRole as PrismaUserRole } from '../generated/prisma/client';
import { Router, type Router as ExpressRouter } from 'express';

import { authenticate, authorize } from '../auth/middleware';
import { idParamsSchema, validateRequest } from '../common/validation';
import { AiRepository } from '../ai/repository';
import { AiService } from '../ai/service';
import { CalendarRepository } from '../calender/repository';
import { CalendarService } from '../calender/service';
import { GoogleCalendarProvider } from '../calender/provider';
import { prisma } from '../config/prisma';
import { EmailService } from '../email/service';
import { BackgroundJobsRepository } from '../jobs/repository';
import { BackgroundJobsService } from '../jobs/service';
import { NotificationsRepository } from '../notifications/repository';
import { NotificationsService } from '../notifications/service';
import { AppointmentsController } from './controller';
import { AppointmentsRepository } from './repository';
import { AppointmentsService } from './service';
import {
  appointmentListQuerySchema,
  bookAppointmentSchema,
  cancelAppointmentSchema,
  rescheduleAppointmentSchema,
  updateAppointmentSchema,
} from './validation';

const appointmentsRepository = new AppointmentsRepository(prisma);
const emailService = new EmailService(prisma);
const notificationsRepository = new NotificationsRepository(prisma);
const notificationsService = new NotificationsService(notificationsRepository);
const aiRepository = new AiRepository(prisma);
const aiService = new AiService(aiRepository);
const backgroundJobsRepository = new BackgroundJobsRepository(prisma);
const backgroundJobsService = new BackgroundJobsService(backgroundJobsRepository);
const calendarRepository = new CalendarRepository(prisma);
const calendarProvider = new GoogleCalendarProvider();
const calendarService = new CalendarService(calendarRepository, calendarProvider);
const appointmentsService = new AppointmentsService(
  appointmentsRepository,
  emailService,
  notificationsService,
  aiService,
  backgroundJobsService,
  calendarService,
);
const appointmentsController = new AppointmentsController(appointmentsService);
const appointmentRoles: PrismaUserRole[] = [UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT];

export const appointmentsRouter: ExpressRouter = Router();

appointmentsRouter.use(authenticate(), authorize(...appointmentRoles));
appointmentsRouter.post('/', validateRequest({ body: bookAppointmentSchema }), appointmentsController.book);
appointmentsRouter.get(
  '/',
  validateRequest({ query: appointmentListQuerySchema }),
  appointmentsController.list,
);
appointmentsRouter.get('/:id', validateRequest({ params: idParamsSchema }), appointmentsController.get);
appointmentsRouter.patch(
  '/:id',
  validateRequest({ params: idParamsSchema, body: updateAppointmentSchema }),
  appointmentsController.update,
);
appointmentsRouter.post(
  '/:id/reschedule',
  validateRequest({ params: idParamsSchema, body: rescheduleAppointmentSchema }),
  appointmentsController.reschedule,
);
appointmentsRouter.post(
  '/:id/cancel',
  validateRequest({ params: idParamsSchema, body: cancelAppointmentSchema }),
  appointmentsController.cancel,
);
