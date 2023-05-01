import { Option, User } from "@prisma/client";
import getPrisma from "../prisma";

export async function upsertUserAnswer(userId: string, optionId: string, questionId: string) {
    return (await getPrisma()).userAnswer.upsert({
        create: {
            optionId,
            questionId,
            userId
        },
        update: {
            optionId,
            questionId
        },
        where: {
            userId_questionId: { 
                questionId, 
                userId
            }
        },
        include: {
            option: true,
            question: true
        }
    })
}

export async function getUserAnswerByUserIdQuestionId(userId: string, questionId: string) {
    return (await getPrisma()).userAnswer.findFirstOrThrow({
        where: {
            userId: userId,
            questionId: questionId
        },
        include: {
            option: true
        }
    });
}