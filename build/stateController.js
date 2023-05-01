"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurveyStateController = void 0;
var Test_1 = require("./models/Test");
var Question_1 = require("./models/Question");
var SurveyStateController = /** @class */ (function () {
    function SurveyStateController() {
        this.initialQuestions = {
            0: "language",
            1: "type_of_survey"
        };
        this.typesOfSurveys = {
            anxiety: {
                amountOfQuestions: 21
            },
            depression: {
                amountOfQuestions: 21
            }
        };
        this.points = {
            max: 0,
            min: 3
        };
    }
    SurveyStateController.prototype.parseCallbackData = function (callback) {
        if (!callback) {
            throw new Error("Unexpected error");
        }
        var splittedData = callback.split(":");
        return {
            questionId: splittedData[0],
            optionId: splittedData[1]
        };
    };
    SurveyStateController.prototype.generateQuestionData = function (questionId, optionId) {
        return "".concat(questionId, ":").concat(optionId);
    };
    SurveyStateController.prototype.getNextQuestion = function (question, userAnswer, curUserQuestion) {
        return __awaiter(this, void 0, void 0, function () {
            var nextQuestion, deprTest, anxietyTest, langTest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (question.order < curUserQuestion.order && question.testId === curUserQuestion.testId) {
                            return [2 /*return*/, {
                                    nextQuestion: curUserQuestion,
                                    testState: "edited"
                                }];
                        }
                        return [4 /*yield*/, (0, Question_1.getNextQuestionByOrder)(question)];
                    case 1:
                        nextQuestion = _a.sent();
                        if (!nextQuestion) return [3 /*break*/, 2];
                        return [2 /*return*/, {
                                nextQuestion: nextQuestion,
                                testState: "open"
                            }];
                    case 2: return [4 /*yield*/, (0, Test_1.getTestByName)("depression")];
                    case 3:
                        deprTest = _a.sent();
                        return [4 /*yield*/, (0, Test_1.getTestByName)("anxiety")];
                    case 4:
                        anxietyTest = _a.sent();
                        if (userAnswer.option.text_ru === "Тревожность") {
                            return [2 /*return*/, {
                                    nextQuestion: anxietyTest.questions[0],
                                    testState: "new"
                                }];
                        }
                        if (userAnswer.option.text_ru === "Депрессия") {
                            return [2 /*return*/, {
                                    nextQuestion: deprTest.questions[0],
                                    testState: "new"
                                }];
                        }
                        return [4 /*yield*/, (0, Test_1.getTestByName)("pref_lang")];
                    case 5:
                        langTest = _a.sent();
                        return [2 /*return*/, {
                                nextQuestion: langTest.questions[0],
                                testState: "start"
                            }];
                }
            });
        });
    };
    return SurveyStateController;
}());
exports.SurveyStateController = SurveyStateController;
