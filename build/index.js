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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
var config_1 = __importDefault(require("./config"));
var helpers_1 = require("./helpers");
var botService_1 = require("./services/botService");
var User_1 = require("./models/User");
var Test_1 = require("./models/Test");
var User_2 = require("./models/User");
var stateController_1 = require("./stateController");
var UserAnswer_1 = require("./models/UserAnswer");
var config = (0, config_1.default)();
var ssController = new stateController_1.SurveyStateController();
var bot = new node_telegram_bot_api_1.default(config.TELEGRAM_BOT_TOKEN, { polling: { autoStart: true } });
bot.on('message', function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (msg.text === "/start" || !msg.text || msg.text.startsWith("/systemMessage")) {
            return [2 /*return*/];
        }
        return [2 /*return*/];
    });
}); });
bot.onText(/\/start/, function (msg, match) { return __awaiter(void 0, void 0, void 0, function () {
    var user, introTest, newUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, User_1.getUserByTelegramId)(msg.chat.id.toString())];
            case 1:
                user = _a.sent();
                if (!user) return [3 /*break*/, 2];
                return [2 /*return*/];
            case 2: return [4 /*yield*/, (0, Test_1.getTestByName)("pref_lang")];
            case 3:
                introTest = _a.sent();
                return [4 /*yield*/, (0, User_2.createUser)(msg.chat.id.toString(), introTest.questions[0].id, introTest.id)];
            case 4:
                newUser = _a.sent();
                return [4 /*yield*/, (0, botService_1.sendIntroMessage)(bot, msg.chat.id, newUser.cur_question)];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); });
bot.on("callback_query", function (cb) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    return __awaiter(this, void 0, void 0, function () {
        var action, msg, telegramId, cbData, user, userAnswer, nextQuestion, userTestSummary, langTest, langQuestion, userLangTestAnswer, pref_lang, inlineKeyboard, err_1;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    _o.trys.push([0, 21, , 22]);
                    return [4 /*yield*/, bot.editMessageText("Loading...", {
                            chat_id: cb.from.id,
                            message_id: (_a = cb.message) === null || _a === void 0 ? void 0 : _a.message_id,
                            reply_markup: {
                                inline_keyboard: []
                            }
                        })];
                case 1:
                    _o.sent();
                    action = cb.data;
                    msg = cb.message;
                    telegramId = cb.from.id;
                    cbData = ssController.parseCallbackData(action !== null && action !== void 0 ? action : "");
                    return [4 /*yield*/, (0, User_1.getUserByTelegramIdWithFail)(telegramId.toString())];
                case 2:
                    user = _o.sent();
                    return [4 /*yield*/, (0, UserAnswer_1.upsertUserAnswer)(user.id, cbData.optionId, cbData.questionId)];
                case 3:
                    userAnswer = _o.sent();
                    return [4 /*yield*/, ssController.getNextQuestion(userAnswer.question, userAnswer, user.cur_question)];
                case 4:
                    nextQuestion = _o.sent();
                    if (!(nextQuestion.testState === "start")) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, helpers_1.getUserTestSummary)(telegramId.toString(), userAnswer.question.testId)];
                case 5:
                    userTestSummary = _o.sent();
                    return [4 /*yield*/, bot.editMessageText((_c = (_b = cb.message) === null || _b === void 0 ? void 0 : _b.text) !== null && _c !== void 0 ? _c : "", {
                            chat_id: cb.from.id,
                            message_id: msg === null || msg === void 0 ? void 0 : msg.message_id,
                            reply_markup: (_d = cb.message) === null || _d === void 0 ? void 0 : _d.reply_markup
                        })];
                case 6:
                    _o.sent();
                    return [4 /*yield*/, (0, botService_1.sendDefaultQuestionMessage)(bot, telegramId, "\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u044B \u0442\u0435\u0441\u0442\u0430: ".concat(userTestSummary.test, "(").concat(userTestSummary.sum, ")\n ").concat(userTestSummary.type, "\n \u0421\u0435\u0441\u0442\u0440\u0430 \u043F\u0440\u043E\u0434\u0443\u043C\u0430\u0439, \u043A\u0430\u043A\u043E\u0439 \u0442\u0435\u043A\u0441\u0442 \u0441\u044E\u0434\u0430 \u043C\u044B \u043C\u043E\u0436\u0435\u043C \u0435\u0449\u0435 \u0432\u0441\u0442\u0430\u0432\u0438\u0442\u044C, \u044F \u043F\u043B\u0430\u0442\u0435\u0436\u043A\u0443 \u043F\u043E\u0437\u0436\u0435 \u0434\u043E\u0431\u0430\u0432\u043B\u044E"), {})];
                case 7:
                    _o.sent();
                    return [4 /*yield*/, (0, botService_1.sendIntroMessage)(bot, telegramId.toString(), nextQuestion.nextQuestion)];
                case 8:
                    _o.sent();
                    return [2 /*return*/];
                case 9:
                    if (!(nextQuestion.testState === "edited")) return [3 /*break*/, 12];
                    return [4 /*yield*/, (0, User_1.updateUserCurState)(telegramId.toString(), nextQuestion.nextQuestion.id, nextQuestion.nextQuestion.testId)];
                case 10:
                    _o.sent();
                    return [4 /*yield*/, bot.editMessageText((_f = (_e = cb.message) === null || _e === void 0 ? void 0 : _e.text) !== null && _f !== void 0 ? _f : "", {
                            chat_id: cb.from.id,
                            message_id: msg === null || msg === void 0 ? void 0 : msg.message_id,
                            reply_markup: (_g = cb.message) === null || _g === void 0 ? void 0 : _g.reply_markup
                        })];
                case 11:
                    _o.sent();
                    return [2 /*return*/];
                case 12: return [4 /*yield*/, (0, User_1.updateUserCurState)(telegramId.toString(), nextQuestion.nextQuestion.id, nextQuestion.nextQuestion.testId)];
                case 13:
                    _o.sent();
                    return [4 /*yield*/, (0, Test_1.getTestByName)("pref_lang")];
                case 14:
                    langTest = _o.sent();
                    langQuestion = langTest.questions[0];
                    return [4 /*yield*/, (0, UserAnswer_1.getUserAnswerByUserIdQuestionId)(user.id, langQuestion.id)];
                case 15:
                    userLangTestAnswer = _o.sent();
                    pref_lang = void 0;
                    if (userLangTestAnswer.option.text_ru) {
                        pref_lang = "text_ru";
                    }
                    else {
                        pref_lang = "text_kz";
                    }
                    inlineKeyboard = (0, helpers_1.generateTelegramQuestionMessageReplyMarkup)(nextQuestion.nextQuestion, pref_lang);
                    if (!(pref_lang === "text_ru")) return [3 /*break*/, 17];
                    return [4 /*yield*/, (0, botService_1.sendDefaultQuestionMessage)(bot, cb.from.id, "".concat(nextQuestion.nextQuestion.order, ". ").concat((_h = nextQuestion.nextQuestion["text_ru"]) !== null && _h !== void 0 ? _h : ""), {
                            reply_markup: {
                                inline_keyboard: inlineKeyboard
                            }
                        })];
                case 16:
                    _o.sent();
                    return [3 /*break*/, 19];
                case 17: return [4 /*yield*/, (0, botService_1.sendDefaultQuestionMessage)(bot, cb.from.id, "".concat(nextQuestion.nextQuestion.order, ". ").concat((_j = nextQuestion.nextQuestion["text_kz"]) !== null && _j !== void 0 ? _j : ""), {
                        reply_markup: {
                            inline_keyboard: inlineKeyboard
                        }
                    })];
                case 18:
                    _o.sent();
                    _o.label = 19;
                case 19: return [4 /*yield*/, bot.editMessageText((_l = (_k = cb.message) === null || _k === void 0 ? void 0 : _k.text) !== null && _l !== void 0 ? _l : "", {
                        chat_id: cb.from.id,
                        message_id: msg === null || msg === void 0 ? void 0 : msg.message_id,
                        reply_markup: (_m = cb.message) === null || _m === void 0 ? void 0 : _m.reply_markup
                    })];
                case 20:
                    _o.sent();
                    return [3 /*break*/, 22];
                case 21:
                    err_1 = _o.sent();
                    console.log("catch err");
                    bot.sendMessage(424232165, err_1);
                    return [3 /*break*/, 22];
                case 22: return [2 /*return*/];
            }
        });
    });
});
bot.on("error", function (error) {
    console.log("error");
});
exports.default = bot;
