import TelegramBot, { CallbackQuery, Message } from "node-telegram-bot-api";
import configuration from "./config";
import { generateTelegramQuestionMessageReplyMarkup, getUserTestSummary } from "./helpers";
import { sendDefaultQuestionMessage, sendDonoHelpMessage, sendIntroMessage } from "./services/botService";
import { getTestByName } from "./models/Test";
import { createUser } from "./models/User";
import { SurveyStateController } from "./stateController";
import { NoActionOnCallbackError } from "./errors/NoActionOnCallbackError";

const config = configuration();
const bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN, { polling: { autoStart: true } });


bot.on('message', async (msg: Message) => {
    if (msg.text === "/start" || !msg.text || msg.text.startsWith("/systemMessage")) {
        return;
    }
});

bot.onText(/\/start/, async (msg: Message, match: any) => {
    const introTest = await getTestByName("pref_lang");
    const newUser = await createUser(msg.chat.id.toString(), introTest.questions[0].id, introTest.id);
    await sendIntroMessage(bot, msg.chat.id, newUser.cur_question);
})

bot.on("callback_query", async function (cb: CallbackQuery) {
    try {
        await bot.editMessageText("Обработка", {
            chat_id: cb.from.id,
            message_id: cb.message?.message_id,
            reply_markup: {
                inline_keyboard: []
            }
        })
        
        const action = cb.data;
    
        if (!action) {
            throw new NoActionOnCallbackError(cb.from.id.toString(), bot);
        }

        const msg = cb.message;
        const telegramId = cb.from.id;

        const surveyStateController = new SurveyStateController(telegramId.toString(), action);
        await surveyStateController.processState();

        switch (surveyStateController.result.type) {
            case "finished":
                await bot.editMessageText(cb.message?.text ?? "", {
                    chat_id: cb.from.id,
                    message_id: msg?.message_id,
                    reply_markup: cb.message?.reply_markup
                })
    
                await sendDefaultQuestionMessage(
                    bot,
                    telegramId,
                    `Результаты теста: ${surveyStateController.result.data.userTestSummary.test}(${surveyStateController.result.data.userTestSummary.sum}) - ${surveyStateController.result.data.userTestSummary.type}\n${surveyStateController.result.data.userTestSummary.text}`,
                    {}
                );
    
                await sendDonoHelpMessage(bot, cb.from.id);
                break;

            case "edited":
                await bot.editMessageText(cb.message?.text ?? "", {
                    chat_id: cb.from.id,
                    message_id: msg?.message_id,
                    reply_markup: cb.message?.reply_markup
                })
                break;
            
            case "open":
                await bot.editMessageText(cb.message?.text ?? "", {
                    chat_id: cb.from.id,
                    message_id: msg?.message_id,
                    reply_markup: cb.message?.reply_markup
                })
                
                const inlineKeyboard = generateTelegramQuestionMessageReplyMarkup(surveyStateController.result.data.nextQuestion.nextQuestion, surveyStateController.result.data.pref_lang);
    
                await sendDefaultQuestionMessage(bot, cb.from.id, `${surveyStateController.result.data.nextQuestion.nextQuestion.order}. ${surveyStateController.result.data.nextQuestion.nextQuestion[surveyStateController.result.data.pref_lang] ?? ""}`, {
                    reply_markup: {
                        inline_keyboard: inlineKeyboard
                    }
                })
                break;
        }

    } catch(err: any) {
        console.log(err)
        await bot.sendMessage(cb.from.id, "Попробуйте еще раз, написав /start.");
    }
})

bot.on("error", (error) => {
    console.log("BOT ERROR\n", error);
    bot.sendMessage(config.ADMIN_TELEGRAM_ID, JSON.stringify(error));
})

export default bot;