import { Question, User, UserAnswer } from "@prisma/client"
import { CallbackData, OptionId, QuestionId } from "./types/CallbackData"
import { getTestById, getTestByName } from "./models/Test"
import { getNextQuestionByOrder } from "./models/Question"
import { getUserByTelegramIdWithFail, updateUserCurState } from "./models/User";
import { getUserAnswerByUserIdQuestionId, upsertUserAnswer } from "./models/UserAnswer";
import { UserAnswerWithRelations } from "./types/UserAnswersWithRelation";
import { UserWithRelations } from "./types/UserWithRelations";
import { getUserTestSummary } from "./helpers";
import { EventEmitter } from "stream";
import { UserTestSummary } from "./types/UserTestSummary";



export class SurveyStateController{
    user: UserWithRelations;
    telegramId : string;
    callbackData: CallbackData;
    userAnswer: UserAnswerWithRelations;
    testStates = {}
    langQuestionId: string;
    result:any = {
        type : "",
        data: {}
    }

    constructor(telegramId: string, callBackData: string) {
        this.telegramId = telegramId;
        this.callbackData = this.parseCallbackData(callBackData);
    }

    setResult(type: string, data: any) {
        this.result = {
            type,
            data
        }
    }

    async processState() {
        this.user = await getUserByTelegramIdWithFail(this.telegramId);
        this.userAnswer = await upsertUserAnswer(this.user.id, this.callbackData.optionId, this.callbackData.questionId);
        const nextQuestion = await this.getNextQuestion();
        await updateUserCurState(this.telegramId, nextQuestion.nextQuestion.id, nextQuestion.nextQuestion.testId);

        switch (nextQuestion.testState) {
            case 'finished':
                const userTestSummary: UserTestSummary  = await getUserTestSummary(this.telegramId, this.userAnswer.question.testId);
                this.setResult("finished", {userTestSummary, nextQuestion});
                break;

            case 'open':
                const userLangTestAnswer = await getUserAnswerByUserIdQuestionId(this.user.id, this.langQuestionId);
                
                let pref_lang;
                if (userLangTestAnswer.option.text_ru) {
                    pref_lang = "text_ru";
                } else {
                    pref_lang = "text_kz";
                }

                this.setResult("open", {nextQuestion, pref_lang})
                break;

            default:
                this.setResult(nextQuestion.testState, nextQuestion);
                break;
        }
    }

    parseCallbackData(callback: string) {
        if (!callback) {
            throw new Error("Unexpected error")
        }

        const splittedData = callback.split(":");

        return {
            questionId: splittedData[0],
            optionId: splittedData[1]
        }
    }

    generateQuestionData(questionId: QuestionId, optionId: OptionId) {
        return `${questionId}:${optionId}`
    }

    async getNextQuestion() {
        if (this.userAnswer.question.order < this.user.cur_question.order && this.userAnswer.question.testId === this.user.cur_question.testId) {
            return {
                nextQuestion: this.user.cur_question,
                testState: "edited"
            }
        }

        const nextQuestion = await getNextQuestionByOrder(this.userAnswer.question);

        if (nextQuestion) {
            return {
                nextQuestion,
                testState: "open"
            };
        } else {
            const deprTest = await getTestByName("depression");
            const anxietyTest = await getTestByName("anxiety");

            if (this.userAnswer.option.text_ru === "Тревожность") {
                return {
                    nextQuestion:anxietyTest.questions[0],
                    testState: "open"
                };
            }

            if (this.userAnswer.option.text_ru === "Депрессия") {
                return {
                    nextQuestion: deprTest.questions[0],
                    testState: "open"
                };
            }
            const langTest = await getTestByName("pref_lang");

            this.langQuestionId = langTest.questions[0].id;

            return {
                nextQuestion: langTest.questions[0],
                testState: "finished"    
            };
        }
    }
}