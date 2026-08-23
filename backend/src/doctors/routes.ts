import { UserRole, type UserRole as PrismaUserRole } from '../generated/prisma/client';
import { Router, type Router as ExpressRouter } from 'express';

import { validateRequest, idParamsSchema } from '../common/validation';
import { prisma } from '../config/prisma';
import { authenticate, authorize } from '../auth/middleware';
import { UsersRepository } from '../users/repository';
import { DoctorsController } from './controller';
import { DoctorsRepository } from './repository';
import { DoctorsService } from './service';
import { createDoctorSchema, doctorListQuerySchema, updateDoctorSchema } from './validation';

const doctorsRepository = new DoctorsRepository(prisma);
const usersRepository = new UsersRepository(prisma);
const doctorsService = new DoctorsService(doctorsRepository, usersRepository);
const doctorsController = new DoctorsController(doctorsService);

export const doctorsRouter: ExpressRouter = Router();
export const doctorDirectoryRouter: ExpressRouter = Router();

const directoryRoles: PrismaUserRole[] = [UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT];

doctorDirectoryRouter.use(authenticate(), authorize(...directoryRoles));
doctorDirectoryRouter.get('/', validateRequest({ query: doctorListQuerySchema }), doctorsController.list);

doctorsRouter.use(authenticate(), authorize(UserRole.ADMIN));
doctorsRouter.post('/', validateRequest({ body: createDoctorSchema }), doctorsController.create);
doctorsRouter.get('/', validateRequest({ query: doctorListQuerySchema }), doctorsController.list);
doctorsRouter.get('/:id', validateRequest({ params: idParamsSchema }), doctorsController.get);
doctorsRouter.patch(
  '/:id',
  validateRequest({ params: idParamsSchema, body: updateDoctorSchema }),
  doctorsController.update,
);
doctorsRouter.delete(
  '/:id',
  validateRequest({ params: idParamsSchema }),
  doctorsController.deactivate,
);
