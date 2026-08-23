import {
  CalendarProvider,
  CalendarSyncStatus,
  type Prisma,
  type PrismaClient,
} from '../generated/prisma/client';

export type CalendarConnectionRecord =
  Prisma.CalendarConnectionGetPayload<object>;

export type CalendarEventRecord =
  Prisma.CalendarEventGetPayload<object>;

export class CalendarRepository {
  public constructor(private readonly database: PrismaClient) {}

 public upsertConnection(input: Readonly<{
  userId: string;
  providerAccountEmail: string;
  accessTokenEncrypted: string;
  refreshTokenEncrypted: string;
  scopes: readonly string[];
  expiresAt: Date | null;
  actorId: string;
}>): Promise<CalendarConnectionRecord> {
  return this.database.calendarConnection.upsert({
    where: {
      userId_provider_providerAccountEmail: {
        userId: input.userId,
        provider: CalendarProvider.GOOGLE,
        providerAccountEmail: input.providerAccountEmail,
      },
    },

    create: {
      userId: input.userId,
      provider: CalendarProvider.GOOGLE,
      providerAccountEmail: input.providerAccountEmail,
      accessTokenEncrypted: input.accessTokenEncrypted,
      refreshTokenEncrypted: input.refreshTokenEncrypted,
      scopes: [...input.scopes],
      expiresAt: input.expiresAt,
      createdBy: input.actorId,
      updatedBy: input.actorId,
    },

    update: {
      providerAccountEmail: input.providerAccountEmail,
      accessTokenEncrypted: input.accessTokenEncrypted,
      refreshTokenEncrypted: input.refreshTokenEncrypted,
      scopes: [...input.scopes],
      expiresAt: input.expiresAt,
      revokedAt: null,
      updatedBy: input.actorId,
    },
  });
}

  /*
   * Get ALL active calendar connections for a user.
   *
   * One user can have multiple Google Calendar accounts.
   */
  public findActiveConnectionsByUserId(
    userId: string,
  ): Promise<CalendarConnectionRecord[]> {
    return this.database.calendarConnection.findMany({
      where: {
        userId,
        provider: CalendarProvider.GOOGLE,
        revokedAt: null,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  /*
   * Get the first active connection.
   *
   * Kept for code that still expects a single connection.
   */
  public findActiveConnectionByUserId(
    userId: string,
  ): Promise<CalendarConnectionRecord | null> {
    return this.database.calendarConnection.findFirst({
      where: {
        userId,
        provider: CalendarProvider.GOOGLE,
        revokedAt: null,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  public async revokeConnection(
    userId: string,
    actorId: string,
  ): Promise<CalendarConnectionRecord | null> {
    const connection =
      await this.findActiveConnectionByUserId(userId);

    if (connection === null) {
      return null;
    }

    return this.database.calendarConnection.update({
      where: {
        id: connection.id,
      },

      data: {
        revokedAt: new Date(),
        updatedBy: actorId,
      },
    });
  }

  /*
   * Find ONE event using:
   * appointmentId + calendarConnectionId
   */
  public findEventByAppointmentAndConnection(
    appointmentId: string,
    calendarConnectionId: string,
  ): Promise<CalendarEventRecord | null> {
    return this.database.calendarEvent.findUnique({
      where: {
        appointmentId_calendarConnectionId: {
          appointmentId,
          calendarConnectionId,
        },
      },
    });
  }

  /*
   * Find ALL calendar events belonging to an appointment.
   */
  public findEventsByAppointmentId(
    appointmentId: string,
  ): Promise<CalendarEventRecord[]> {
    return this.database.calendarEvent.findMany({
      where: {
        appointmentId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  /*
   * Find ALL events belonging to one calendar connection.
   */
  public findEventsByCalendarConnectionId(
    calendarConnectionId: string,
  ): Promise<CalendarEventRecord[]> {
    return this.database.calendarEvent.findMany({
      where: {
        calendarConnectionId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  /*
   * Upsert using:
   * appointmentId + calendarConnectionId
   */
  public upsertEvent(input: Readonly<{
    appointmentId: string;
    calendarConnectionId: string;
    externalEventId: string;
    syncStatus: CalendarSyncStatus;
    actorId: string;
  }>): Promise<CalendarEventRecord> {
    return this.database.calendarEvent.upsert({
      where: {
        appointmentId_calendarConnectionId: {
          appointmentId: input.appointmentId,
          calendarConnectionId: input.calendarConnectionId,
        },
      },

      create: {
        appointmentId: input.appointmentId,
        calendarConnectionId: input.calendarConnectionId,
        provider: CalendarProvider.GOOGLE,
        externalEventId: input.externalEventId,
        syncStatus: input.syncStatus,
        lastSynchronizedAt:
          input.syncStatus === CalendarSyncStatus.SYNCED
            ? new Date()
            : null,
        createdBy: input.actorId,
        updatedBy: input.actorId,
      },

      update: {
        externalEventId: input.externalEventId,
        syncStatus: input.syncStatus,
        lastSynchronizedAt:
          input.syncStatus === CalendarSyncStatus.SYNCED
            ? new Date()
            : null,
        updatedBy: input.actorId,
      },
    });
  }

  public markEventDeleted(
    id: string,
    actorId: string,
  ): Promise<CalendarEventRecord> {
    return this.database.calendarEvent.update({
      where: {
        id,
      },

      data: {
        syncStatus: CalendarSyncStatus.DELETED,
        lastSynchronizedAt: new Date(),
        updatedBy: actorId,
      },
    });
  }
}