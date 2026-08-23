import { UserRole } from '../generated/prisma/client';
import { Router, type Router as ExpressRouter } from 'express';

import { authenticate, authorize } from '../auth/middleware';
import { validateRequest } from '../common/validation';
import { AiRepository } from '../ai/repository';
import { AiService } from '../ai/service';
import { prisma } from '../config/prisma';
import { EmailService } from '../email/service';
import { BackgroundJobsController } from './controller';
import { BackgroundJobsRepository } from './repository';
import { BackgroundJobsService } from './service';
import { processJobsSchema } from './validation';

const backgroundJobsRepository = new BackgroundJobsRepository(prisma);
const emailService = new EmailService(prisma);
const aiRepository = new AiRepository(prisma);
const aiService = new AiService(aiRepository);
const backgroundJobsService = new BackgroundJobsService(
  backgroundJobsRepository,
  prisma,
  emailService,
  aiService,
);
const backgroundJobsController = new BackgroundJobsController(backgroundJobsService);

export const backgroundJobsRouter: ExpressRouter = Router();

backgroundJobsRouter.use(authenticate(), authorize(UserRole.ADMIN));
backgroundJobsRouter.post(
  '/process',
  validateRequest({ body: processJobsSchema }),
  backgroundJobsController.processDueJobs,
);
