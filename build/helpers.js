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
exports.getUserTestSummary = exports.determineState = exports.generateTelegramQuestionMessageReplyMarkup = void 0;
var User_1 = require("./models/User");
var Test_1 = require("./models/Test");
var RESULT_TYPES = {
    "minimal": "минимальный диапазон",
    "medium": "легкий диапазон",
    "strong": "умеренный диапазон",
    "hard": "тяжелый  диапазон"
};
function generateTelegramQuestionMessageReplyMarkup(question, language) {
    var inlineKeyboard = [];
    for (var i = 0; i < question.options.length; i++) {
        inlineKeyboard.push([{
                text: "".concat(i + 1, ". ").concat(question.options[i][language], ":"),
                callback_data: "".concat(question.id, ":").concat(question.options[i]["id"])
            }]);
    }
    return inlineKeyboard;
}
exports.generateTelegramQuestionMessageReplyMarkup = generateTelegramQuestionMessageReplyMarkup;
function determineState(cb) {
    var nextState;
    if (cb === "start") {
        nextState = 0;
        return {
            nextState: nextState,
            userAnswer: "start"
        };
    }
    else {
        var parsedCb = cb.split(":");
        var nextState_1 = parsedCb[0] + 1;
        return {
            nextState: nextState_1,
            userAnswer: parsedCb[1]
        };
    }
}
exports.determineState = determineState;
function getUserTestSummary(telegramId, testId) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var user, sum, type, i, test;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, User_1.getUserTestAnswers)(telegramId, testId)];
                case 1:
                    user = _b.sent();
                    sum = 0;
                    type = "";
                    for (i = 0; i < user.userAnswers.length; i++) {
                        sum += (_a = user.userAnswers[i].option.points) !== null && _a !== void 0 ? _a : 0;
                    }
                    return [4 /*yield*/, (0, Test_1.getTestById)(testId)];
                case 2:
                    test = _b.sent();
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
                    return [2 /*return*/, {
                            test: test.title,
                            type: type,
                            sum: sum
                        }];
            }
        });
    });
}
exports.getUserTestSummary = getUserTestSummary;
