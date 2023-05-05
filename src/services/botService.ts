import { Question, User } from "@prisma/client";
import TelegramBot, { Chat, ChatId, SendMessageOptions } from "node-telegram-bot-api";

async function sendMessage(bot: TelegramBot, chatId: ChatId, text: string, options: SendMessageOptions) {
    return bot.sendMessage(chatId, text, options);
}

export async function sendIntroMessage(bot: TelegramBot,chatId: ChatId, question: any) {
    return await sendMessage(
        bot,
        chatId,
        "Если готовы, выберите язык:", 
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

export async function sendDonoHelpMessage(bot: TelegramBot, chatId: ChatId) {
    return await sendMessage(
        bot,
        chatId,
        "Чтобы поддержать этот проект, принимаем переводы на каспи: 4400 4302 4935 1898",
        {}
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