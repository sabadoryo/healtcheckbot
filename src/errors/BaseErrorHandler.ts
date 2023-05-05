import TelegramBot from "node-telegram-bot-api";
import config from "../config";


export class BaseErrorHanlder extends Error {
    constructor(message: string, bot:TelegramBot, userTelegramId: string) {
        super();
        console.log({
            message,
            userTelegramId
        })
        bot.sendMessage(config().ADMIN_TELEGRAM_ID, message + "\n" +  userTelegramId);
    }
}