import TelegramBot, { Message } from "node-telegram-bot-api";
import { ChatCompletionRequestMessage } from "openai";
import { sendChatCompletionSystem, sendChatCompletionUser } from "./gpt";
import getCache from "./cache";
import configuration from "./config";

const config = configuration();

const bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN, { polling: { interval: 300 } });

bot.on('message', async (msg: Message) => {
    if (msg.text === "/start" || !msg.text || msg.text.startsWith("/systemMessage")) {
        return;
    }

    const loadingMessage = await bot.sendMessage(msg.chat.id, "Обработка...");

    let cache = getCache();
    const userId = msg.chat.id;
    const userHistory: Array<ChatCompletionRequestMessage> =
        cache.get(userId)
        ||
        [
            {
                role: "system",
                content: config.SYSTEM_TEXT,
            }
        ];

    userHistory.push({
        role: "user",
        content: msg.text
    })

    let gptResponse = await sendChatCompletionUser(userHistory);

    if (!gptResponse) {
        bot.editMessageText("Error occurred", {
            message_id: loadingMessage.message_id,
            chat_id: loadingMessage.chat.id
        });
        return;
    }

    userHistory.push({
        role: "assistant",
        content: gptResponse
    })

    cache.set(userId, userHistory);

    bot.editMessageText(gptResponse, {
        message_id: loadingMessage.message_id,
        chat_id: loadingMessage.chat.id
    });
});

bot.onText(/\/start/, (msg: Message, match: any) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Start text, will be updated later");
})

export default bot;