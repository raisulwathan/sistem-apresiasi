import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function deleteTtd() {
  const countTtd = await prisma.ttd.count();

  if (countTtd > 0) {
    await prisma.ttd.deleteMany();

    console.log("Delete TTD Success");
  } else {
    console.log("ttd is empty");
  }
}

deleteTtd().then(() => {
  console.log("All Seeding Done");
});
