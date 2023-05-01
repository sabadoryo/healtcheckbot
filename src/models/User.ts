import { test } from "node:test";
import getPrisma from "../prisma";

export async function getUserByTelegramId(telegramId: string) {
    return (await getPrisma()).user.findFirst({
        where: {
            telegram_id: telegramId
        },
        include: {
            cur_test: true,
            cur_question: {
                include: {
                    options: true
                }
            }
        }
    })
}

export async function getUserTestAnswers(telegramId: string, testId: string) {
    return (await getPrisma()).user.findFirstOrThrow({
        where: {
            telegram_id: telegramId
        },
        include: {
            userAnswers: {
                where: {
                    question: {
                        testId: testId
                    }
                },
                include: {
                    option: true
                }
            }
        }
    })
}

export async function getUserByTelegramIdWithFail(telegramId: string) {
    return (await getPrisma()).user.findFirstOrThrow({
        where: {
            telegram_id: telegramId
        },
        include: {
            cur_test: true,
            cur_question: {
                include: {
                    options: true
                }
            }
        }
    })
}

export async function createUser(telegramId: string, cur_questionId: string | undefined, cur_testId: string | undefined) {
    return (await getPrisma()).user.create({
        data: {
            telegram_id: telegramId,
            cur_questionId: cur_questionId ?? "ERROR",
            cur_testId: cur_testId ?? "ERROR"
        },
        include: {
            cur_test: true,
            cur_question: {
                include: {
                    options: true
                }
            }
        }
    })
}

export async function updateUserCurState(telegramId:string, curQuestionId:string, curTestId:string) {
    return (await getPrisma()).user.update({
        where: {
            telegram_id: telegramId
        },
        data: {
            cur_questionId: curQuestionId,
            cur_testId: curTestId
        }
    })
}