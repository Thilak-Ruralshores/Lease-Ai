import { prisma } from "./src/lib/prisma";

async function listUsers() {
  const users = await prisma.user.findMany({
    include: { organization: true },
  });
  console.log(JSON.stringify(users, null, 2));
}

listUsers().catch(console.error);
