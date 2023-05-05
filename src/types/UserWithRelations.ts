import { Prisma } from "@prisma/client";

export type UserWithRelations = Prisma.UserGetPayload<{
    include: {
        cur_question: true,
        cur_test: true    
    }
}>