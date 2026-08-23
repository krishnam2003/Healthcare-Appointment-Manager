import { UserRole, type UserRole as PrismaUserRole } from '../generated/prisma/client';
import { Router, type Router as ExpressRouter } from 'express';

import { authenticate, authorize } from '../auth/middleware';
import { idParamsSchema, validateRequest } from '../common/validation';
import { prisma } from '../config/prisma';
import { BackgroundJobsRepository } from '../jobs/repository';
import { BackgroundJobsService } from '../jobs/service';
import { MedicationRemindersController } from './controller';
import { MedicationRemindersRepository } from './repository';
import { MedicationRemindersService } from './service';
import {
  createMedicationRemindersSchema,
  medicationReminderListQuerySchema,
  updateMedicationReminderStatusSchema,
} from './validation';

const medicationRemindersRepository = new MedicationRemindersRepository(prisma);
const backgroundJobsRepository = new BackgroundJobsRepository(prisma);
const backgroundJobsService = new BackgroundJobsService(backgroundJobsRepository);
const medicationRemindersService = new MedicationRemindersService(
  medicationRemindersRepository,
  backgroundJobsService,
);
const medicationRemindersController = new MedicationRemindersController(medicationRemindersService);
const reminderRoles: PrismaUserRole[] = [UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT];

export const medicationRemindersRouter: ExpressRouter = Router();

medicationRemindersRouter.use(authenticate(), authorize(...reminderRoles));
medicationRemindersRouter.post(
  '/',
  validateRequest({ body: createMedicationRemindersSchema }),
  medicationRemindersController.create,
);
medicationRemindersRouter.get(
  '/',
  validateRequest({ query: medicationReminderListQuerySchema }),
  medicationRemindersController.list,
);
medicationRemindersRouter.patch(
  '/:id/status',
  validateRequest({ params: idParamsSchema, body: updateMedicationReminderStatusSchema }),
  medicationRemindersController.updateStatus,
);
