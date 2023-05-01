import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient;

async function getPrisma() {
    if (!prisma) {
        prisma = new PrismaClient();
        await prisma.$connect();
        return prisma;
    } else {
        return prisma;
    }
}



export default getPrisma;