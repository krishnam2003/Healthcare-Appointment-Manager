import { UserRole } from '../generated/prisma/client';
import { Router, type Router as ExpressRouter } from 'express';

import { authenticate, authorize } from '../auth/middleware';
import { idParamsSchema, validateRequest } from '../common/validation';
import { prisma } from '../config/prisma';
import { LeaveController } from './controller';
import { LeaveRepository } from './repository';
import { LeaveService } from './service';
import { createLeaveSchema, leaveListQuerySchema, updateLeaveSchema } from './validation';

const leaveRepository = new LeaveRepository(prisma);
const leaveService = new LeaveService(leaveRepository);
const leaveController = new LeaveController(leaveService);

export const leaveRouter: ExpressRouter = Router();

leaveRouter.use(authenticate(), authorize(UserRole.ADMIN, UserRole.DOCTOR));
leaveRouter.post('/', validateRequest({ body: createLeaveSchema }), leaveController.create);
leaveRouter.get('/', validateRequest({ query: leaveListQuerySchema }), leaveController.list);
leaveRouter.patch(
  '/:id',
  validateRequest({ params: idParamsSchema, body: updateLeaveSchema }),
  leaveController.update,
);
leaveRouter.delete('/:id', validateRequest({ params: idParamsSchema }), leaveController.cancel);
