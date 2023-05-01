import { Question, User } from "@prisma/client";
import TelegramBot, { ChatId, SendMessageOptions } from "node-telegram-bot-api";

async function sendMessage(bot: TelegramBot, chatId: ChatId, text: string, options: SendMessageOptions) {
    return bot.sendMessage(chatId, text, options);
}

export async function sendIntroMessage(bot: TelegramBot,chatId: ChatId, question: any) {
    return await sendMessage(
        bot,
        chatId,
        "Привет! Я - твой персональный телеграм-бот, созданный для проведения анкетирования на тему клинико-эпидемиологических аспектов распространенности симптомов тревожности и депрессии у женщин.\nЭто важное и актуальное исследование, которое поможет лучше понять и помочь женщинам, страдающим от этих проблем. Я буду задавать тебе ряд вопросов, которые помогут нам получить ценную информацию для нашего исследования.\nЕсли готовы, выберите язык:", 
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: question.options[0].text_ru,
                            callback_data: `${question.id}:${question.options[0].id}`
                        },
                        {
                            text: question.options[1].text_kz,
                            callback_data: `${question.id}:${question.options[1].id}`
                        }
                    ]
                ]
            }
        }
    )
}

export async function sendDefaultQuestionMessage(bot: TelegramBot, chatId: ChatId, text: string, options: SendMessageOptions) {
    return await sendMessage(
        bot,
        chatId,
        text,
        options
    )
}