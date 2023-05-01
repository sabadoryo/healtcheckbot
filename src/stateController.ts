import { Question, User, UserAnswer } from "@prisma/client"
import { CallbackData, OptionId, QuestionId } from "./types/CallbackData"
import { getTestById, getTestByName } from "./models/Test"
import { getNextQuestionByOrder } from "./models/Question"

export class SurveyStateController {
    initialQuestions = {
        0: "language",
        1: "type_of_survey"
    }

    typesOfSurveys = {
        anxiety : {
            amountOfQuestions: 21    
        },
        depression: {
            amountOfQuestions: 21
        }
    }

    points = {
        max: 0,
        min: 3
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

    async getNextQuestion(question: Question, userAnswer: any, curUserQuestion: Question) {
        if (question.order < curUserQuestion.order && question.testId === curUserQuestion.testId) {
            return {
                nextQuestion: curUserQuestion,
                testState: "edited"
            }
        }

        const nextQuestion = await getNextQuestionByOrder(question);
        if (nextQuestion) {
            return {
                nextQuestion,
                testState: "open"
            };
        } else {
            const deprTest = await getTestByName("depression");
            const anxietyTest = await getTestByName("anxiety");

            if (userAnswer.option.text_ru === "Тревожность") {
                return {
                    nextQuestion:anxietyTest.questions[0],
                    testState: "new"
                };
            }

            if (userAnswer.option.text_ru === "Депрессия") {
                return {
                    nextQuestion: deprTest.questions[0],
                    testState: "new"
                };
            }
            const langTest = await getTestByName("pref_lang");

            return {
                nextQuestion: langTest.questions[0],
                testState: "start"    
            };
        }



    }
}