import compression from 'compression';
import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';

import { authRouter } from './auth/routes';
import { aiRouter } from './ai/routes';
import { appointmentsRouter } from './appointments/routes';
import { adminAvailabilityRouter, doctorAvailabilityRouter } from './availability/routes';
import { calendarRouter } from './calender/routes';
import { environment } from './config/environment';
import { docsRouter } from './docs/routes';
import { doctorDirectoryRouter, doctorsRouter } from './doctors/routes';
import { backgroundJobsRouter } from './jobs/routes';
import { leaveRouter } from './leave/routes';
import { errorHandler } from './middleware/error-handler';
import { notFound } from './middleware/not-found';
import { requestContext } from './middleware/request-context';
import { patientsRouter } from './patients/routes';
import { medicationRemindersRouter } from './reminders/routes';

export function createApplication(): Express {
  const application = express();

  application.disable('x-powered-by');
  application.set('trust proxy', 1);
  application.use(requestContext);
  application.use(helmet());
  application.use(
    cors({
      credentials: true,
      origin: environment.CLIENT_ORIGIN,
    }),
  );
  application.use(compression());
  application.use(express.json({ limit: '1mb' }));
  application.use(express.urlencoded({ extended: false, limit: '1mb' }));

  application.use('/docs', docsRouter);
  application.use('/auth', authRouter);
  application.use('/appointments', appointmentsRouter);
  application.use('/appointments', aiRouter);
  application.use('/calendar', calendarRouter);
  application.use('/doctors', doctorDirectoryRouter);
  application.use('/doctors', doctorAvailabilityRouter);
  application.use('/doctors/leave', leaveRouter);
  application.use('/admin/availability', adminAvailabilityRouter);
  application.use('/admin/doctors', doctorsRouter);
  application.use('/admin/jobs', backgroundJobsRouter);
  application.use('/admin/patients', patientsRouter);
  application.use('/medication-reminders', medicationRemindersRouter);

  application.use(notFound);
  application.use(errorHandler);

  return application;
}