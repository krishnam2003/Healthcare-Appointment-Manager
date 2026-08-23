import type { Request, Response } from 'express';

import type { AuthenticatedUser } from '../auth/types';
import { sendSuccess } from '../common/api-response';
import { idParamsSchema } from '../common/validation';
import { ApplicationError } from '../errors/application-error';
import type { MedicationRemindersService } from './service';
import type {
  CreateMedicationRemindersInput,
  UpdateMedicationReminderStatusInput,
} from './validation';

function requireAuthenticatedUser(request: Request): AuthenticatedUser {
  if (request.user === undefined) {
    throw new ApplicationError('Authentication is required.', 401, 'AUTHENTICATION_REQUIRED');
  }

  return request.user;
}

function requireIdParam(request: Request): string {
  const params = idParamsSchema.parse(request.params);
  return params.id;
}

export class MedicationRemindersController {
  public constructor(private readonly medicationRemindersService: MedicationRemindersService) {}

  public create = async (request: Request, response: Response): Promise<void> => {
    const reminders = await this.medicationRemindersService.create(
      request.body as CreateMedicationRemindersInput,
      requireAuthenticatedUser(request),
    );
    sendSuccess(response, 201, reminders);
  };

  public list = async (request: Request, response: Response): Promise<void> => {
    const reminders = await this.medicationRemindersService.list(
      request.query,
      requireAuthenticatedUser(request),
    );
    sendSuccess(response, 200, reminders);
  };

  public updateStatus = async (request: Request, response: Response): Promise<void> => {
    const reminder = await this.medicationRemindersService.updateStatus(
      requireIdParam(request),
      request.body as UpdateMedicationReminderStatusInput,
      requireAuthenticatedUser(request),
    );
    sendSuccess(response, 200, reminder);
  };
}
