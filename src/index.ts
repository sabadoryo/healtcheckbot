import TelegramBot, { CallbackQuery, Message } from "node-telegram-bot-api";
import configuration from "./config";
import { generateTelegramQuestionMessageReplyMarkup, getUserTestSummary } from "./helpers";
import { sendDefaultQuestionMessage, sendIntroMessage } from "./services/botService";
import { getUserByTelegramId, getUserByTelegramIdWithFail, updateUserCurState } from "./models/User";
import { getTestByName } from "./models/Test";
import { createUser } from "./models/User";
import { SurveyStateController } from "./stateController";
import { getUserAnswerByUserIdQuestionId, upsertUserAnswer } from "./models/UserAnswer";

const config = configuration();
const ssController = new SurveyStateController();
const bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN, { polling: { autoStart: true } });


bot.on('message', async (msg: Message) => {
    if (msg.text === "/start" || !msg.text || msg.text.startsWith("/systemMessage")) {
        return;
    }
});

bot.onText(/\/start/, async (msg: Message, match: any) => {
    const user = await getUserByTelegramId(msg.chat.id.toString());
    
    if (user) {
        return;
    } else {
        const introTest = await getTestByName("pref_lang");
        const newUser = await createUser(msg.chat.id.toString(), introTest.questions[0].id, introTest.id);
        await sendIntroMessage(bot, msg.chat.id, newUser.cur_question);
    }
})

bot.on("callback_query", async function (cb: CallbackQuery) {
    try {
    await bot.editMessageText("Loading...", {
        chat_id: cb.from.id,
        message_id: cb.message?.message_id,
        reply_markup: {
             inline_keyboard: []
        }
     })
    const action = cb.data;
    const msg = cb.message;
    const telegramId = cb.from.id;

    const cbData = ssController.parseCallbackData(action ?? "");

    const user = await getUserByTelegramIdWithFail(telegramId.toString())
    const userAnswer = await upsertUserAnswer(user.id, cbData.optionId, cbData.questionId);
    const nextQuestion = await ssController.getNextQuestion(
        userAnswer.question, 
        userAnswer, 
        user.cur_question
    );

    if (nextQuestion.testState === "start") {
        const userTestSummary = await getUserTestSummary(telegramId.toString(), userAnswer.question.testId);

        await bot.editMessageText(cb.message?.text ?? "", {
            chat_id: cb.from.id,
            message_id: msg?.message_id,
            reply_markup: cb.message?.reply_markup
         })

        await sendDefaultQuestionMessage(
            bot,
            telegramId,
            `Результаты теста: ${userTestSummary.test}(${userTestSummary.sum})\n ${userTestSummary.type}\n Сестра продумай, какой текст сюда мы можем еще вставить, я платежку позже добавлю`,
            {}
        );

        await sendIntroMessage(bot, telegramId.toString(), nextQuestion.nextQuestion);
        return;
    }

    if (nextQuestion.testState === "edited") {
        await updateUserCurState(telegramId.toString(), nextQuestion.nextQuestion.id, nextQuestion.nextQuestion.testId);

        await bot.editMessageText(cb.message?.text ?? "", {
            chat_id: cb.from.id,
            message_id: msg?.message_id,
            reply_markup: cb.message?.reply_markup
         })

        return;
    }

    await updateUserCurState(telegramId.toString(), nextQuestion.nextQuestion.id, nextQuestion.nextQuestion.testId);

    const langTest = await getTestByName("pref_lang");
    const langQuestion = langTest.questions[0];
    const userLangTestAnswer = await getUserAnswerByUserIdQuestionId(user.id, langQuestion.id);

    let pref_lang;

    if (userLangTestAnswer.option.text_ru) {
        pref_lang = "text_ru";
    } else {
        pref_lang = "text_kz";
    }

    const inlineKeyboard = generateTelegramQuestionMessageReplyMarkup(nextQuestion.nextQuestion, pref_lang);

    if (pref_lang === "text_ru") {
        await sendDefaultQuestionMessage(bot, cb.from.id, `${nextQuestion.nextQuestion.order}. ${nextQuestion.nextQuestion["text_ru"] ?? ""}`, {
            reply_markup: {
                inline_keyboard: inlineKeyboard
            }
        })
    } else {
        await sendDefaultQuestionMessage(bot, cb.from.id, `${nextQuestion.nextQuestion.order}. ${nextQuestion.nextQuestion["text_kz"] ?? ""}`, {
            reply_markup: {
                inline_keyboard: inlineKeyboard
            }
        })
    }

    await bot.editMessageText(cb.message?.text ?? "", {
        chat_id: cb.from.id,
        message_id: msg?.message_id,
        reply_markup: cb.message?.reply_markup
     })
    } catch(err: any) {
        console.log("catch err", err)
        bot.sendMessage(cb.from.id, "Попробуйте еще раз, написав /start.");
        bot.sendMessage(424232165, JSON.stringify(err));
    }
})

bot.on("error", (error) => {
    console.log("error");
})

export default bot;