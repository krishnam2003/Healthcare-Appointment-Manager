import { prisma } from "./config/prisma";

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "admin@test.com",
      passwordHash: "hashed_password",
      role: "ADMIN",
    },
  });

  console.log(user);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });