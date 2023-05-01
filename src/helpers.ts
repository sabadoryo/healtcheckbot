import { getUserByTelegramId, getUserTestAnswers } from "./models/User";
import { getTestById } from "./models/Test";

const RESULT_TYPES = {
    "minimal": "минимальный диапазон",
    "medium": "легкий диапазон",
    "strong": "умеренный диапазон",
    "hard": "тяжелый  диапазон"
}

export function generateTelegramQuestionMessageReplyMarkup(question: any, language: string): any {
    const inlineKeyboard = [];

    for (let i = 0; i < question.options.length; i++) {
        inlineKeyboard.push([{
            text: `${i + 1}. ${question.options[i][language]}:`,
            callback_data: `${question.id}:${question.options[i]["id"]}`
        }]);
    }
    

    return inlineKeyboard;
}


export function determineState(cb: any) {
    let nextState;

    if (cb === "start") {
        nextState = 0;

        return {
            nextState,
            userAnswer: "start"
        }
    } else {
        const parsedCb = cb.split(":");
        const nextState = parsedCb[0] + 1;
        
        return {
            nextState,
            userAnswer: parsedCb[1]
        }
    }
}

export async function getUserTestSummary(telegramId: string, testId:string) {
    const user = await getUserTestAnswers(telegramId, testId);

    let sum = 0;
    let type = "";

    for (let i = 0; i < user.userAnswers.length; i++) {
        sum += user.userAnswers[i].option.points ?? 0;
    }

    const test = await getTestById(testId);

    if (test.title === "anxiety") {
        if (sum >= 0 && sum <= 7) {
            type = RESULT_TYPES["minimal"]; 
        }

        if (sum >= 8 && sum <= 15) {
            type = RESULT_TYPES["medium"];
        }

        if (sum >= 16 && sum <= 25) {
            type = RESULT_TYPES["strong"];
        }

        if (sum >= 26) {
            type = RESULT_TYPES["hard"];
        }
    }

    if (test.title === "depression") {
        if (sum >= 0 && sum <= 13) {
            type = RESULT_TYPES["minimal"];
        }

        if (sum >= 14 && sum <= 19) {
            type = RESULT_TYPES["medium"];

        }

        if (sum >= 20 && sum <= 28) {
            type = RESULT_TYPES["strong"];
        }

        if (sum >= 29) {
            type = RESULT_TYPES["hard"];
        }
    }

    return {
        test: test.title,
        type: type,
        sum
    };
}