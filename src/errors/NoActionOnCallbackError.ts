import TelegramBot from "node-telegram-bot-api";
import { BaseErrorHanlder } from "./BaseErrorHandler";

export class NoActionOnCallbackError extends BaseErrorHanlder {
    constructor(userTelegramId: string, bot: TelegramBot) {
        super("No action provided on callback", bot, userTelegramId);
    }
}