import { prisma } from './config/prisma';

async function main(): Promise<void> {
  const passwordHash =
    '$2b$12$UXUgDzDX4ZY4caID.ijMRugtzKuixTOl81UAzL4sEj.Qdgc4v2Uq6';

  const emails = [
    'admin@healthcare.local',
    'arjun.mehta@healthcare.local',
    'samir.malhotra@healthcare.local',
    'kabir.sen@healthcare.local',
    'mira.kapoor@healthcare.local',
    'nisha.rao@healthcare.local',
  ];

  for (const email of emails) {
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        passwordHash,
      },
    });

    console.log(`Updated password for ${email}`);
  }
}

main()
  .catch((error: unknown) => {
    console.error('Failed to update passwords:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });