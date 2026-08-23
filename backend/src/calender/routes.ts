import {
  UserRole,
  type UserRole as PrismaUserRole,
} from '../generated/prisma/client';

import { Router, type Router as ExpressRouter } from 'express';

import {
  authenticate,
  authorize,
} from '../auth/middleware';

import { validateRequest } from '../common/validation';

import { prisma } from '../config/prisma';

import { CalendarController } from './controller';
import { GoogleCalendarProvider } from './provider';
import { CalendarRepository } from './repository';
import { CalendarService } from './service';

import {
  googleCalendarCallbackQuerySchema,
  googleCalendarCallbackSchema,
} from './validation';

const calendarRepository =
  new CalendarRepository(prisma);

const calendarProvider =
  new GoogleCalendarProvider();

const calendarService =
  new CalendarService(
    calendarRepository,
    calendarProvider,
  );

const calendarController =
  new CalendarController(calendarService);

const calendarRoles: PrismaUserRole[] = [
  UserRole.ADMIN,
  UserRole.DOCTOR,
  UserRole.PATIENT,
];

export const calendarRouter: ExpressRouter =
  Router();

calendarRouter.get(
  '/google/callback',
  validateRequest({
    query: googleCalendarCallbackQuerySchema,
  }),
  calendarController.completeGoogleBrowserCallback,
);

calendarRouter.use(
  authenticate(),
  authorize(...calendarRoles),
);

calendarRouter.get(
  '/google/connect',
  calendarController.connectGoogle,
);

calendarRouter.post(
  '/google/callback',
  validateRequest({
    body: googleCalendarCallbackSchema,
  }),
  calendarController.completeGoogleConnection,
);

calendarRouter.delete(
  '/google',
  calendarController.disconnectGoogle,
);