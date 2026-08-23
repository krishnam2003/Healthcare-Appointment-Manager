import { UserRole, type UserRole as PrismaUserRole } from '../generated/prisma/client';
import { Router, type Router as ExpressRouter } from 'express';

import { authenticate, authorize } from '../auth/middleware';
import { validateRequest } from '../common/validation';
import { prisma } from '../config/prisma';
import { AiController } from './controller';
import { AiRepository } from './repository';
import { AiService } from './service';
import { appointmentSummaryParamsSchema } from './validation';

const aiRepository = new AiRepository(prisma);
const aiService = new AiService(aiRepository);
const aiController = new AiController(aiService);
const summaryRoles: PrismaUserRole[] = [
  UserRole.ADMIN,
  UserRole.DOCTOR,
  UserRole.PATIENT,
];

export const aiRouter: ExpressRouter = Router();

aiRouter.use(authenticate(), authorize(...summaryRoles));
aiRouter.post(
  '/:id/pre-summary',
  validateRequest({ params: appointmentSummaryParamsSchema }),
  aiController.generatePreVisitSummary,
);
aiRouter.post(
  '/:id/post-summary',
  validateRequest({ params: appointmentSummaryParamsSchema }),
  aiController.generatePostVisitSummary,
);
