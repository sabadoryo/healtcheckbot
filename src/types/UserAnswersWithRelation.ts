import { Prisma } from "@prisma/client";

export type UserAnswerWithRelations = Prisma.UserAnswerGetPayload<{
    include: {
        option: true,
        question: true    
    }
}>