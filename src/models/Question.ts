import { Question } from "@prisma/client";
import getPrisma from "../prisma";

export async function getNextQuestionByOrder(question: Question) {
    return (await getPrisma()).question.findFirst({
        where: {
            testId: question.testId,
            order: question.order + 1
        },
        include: {
            options: true
        }
    })
}