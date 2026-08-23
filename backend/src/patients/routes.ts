import { UserRole } from '../generated/prisma/client';
import { Router, type Router as ExpressRouter } from 'express';

import { authenticate, authorize } from '../auth/middleware';
import { idParamsSchema, validateRequest } from '../common/validation';
import { prisma } from '../config/prisma';
import { UsersRepository } from '../users/repository';
import { PatientsController } from './controller';
import { PatientsRepository } from './repository';
import { PatientsService } from './service';
import { patientListQuerySchema, updatePatientSchema } from './validation';

const patientsRepository = new PatientsRepository(prisma);
const usersRepository = new UsersRepository(prisma);
const patientsService = new PatientsService(patientsRepository, usersRepository);
const patientsController = new PatientsController(patientsService);

export const patientsRouter: ExpressRouter = Router();

patientsRouter.use(authenticate(), authorize(UserRole.ADMIN));
patientsRouter.get('/', validateRequest({ query: patientListQuerySchema }), patientsController.list);
patientsRouter.get('/:id', validateRequest({ params: idParamsSchema }), patientsController.get);
patientsRouter.patch(
  '/:id',
  validateRequest({ params: idParamsSchema, body: updatePatientSchema }),
  patientsController.update,
);
patientsRouter.delete(
  '/:id',
  validateRequest({ params: idParamsSchema }),
  patientsController.deactivate,
);
