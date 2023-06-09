import { getUserByTelegramId, getUserTestAnswers } from "./models/User";
import { getTestById } from "./models/Test";
import { UserTestSummary } from "./types/UserTestSummary";
import { getUserAnswerByUserIdQuestionId } from "./models/UserAnswer";

const RESULT_TYPES = {
    "minimal": "минимальный диапазон",
    "medium": "легкий диапазон",
    "strong": "умеренный диапазон",
    "hard": "тяжелый  диапазон"
}

const TEXT_MINIMAL_RU = 'Расслабление: Возможно, вы можете попробовать методы расслабления, такие как медитация, глубокое дыхание, йога или прогрессивная мускульная релаксация. Эти методы могут помочь снизить уровень тревожности и улучшить ваше состояние.\nФизическая активность: Физическая активность может помочь снизить уровень тревожности, улучшить настроение и снизить стресс. Попробуйте заниматься спортом, бегать, плавать или просто ходить на свежем воздухе.\nОбщение: Иногда общение с друзьями или близкими может помочь справиться с тревожностью. Поговорите с кем-то, кого вы доверяете, о том, что вас беспокоит. Это может помочь вам получить новый взгляд на ситуацию и уменьшить уровень тревоги.\nИзменение образа жизни: Ваш образ жизни может влиять на ваше эмоциональное состояние. Попробуйте улучшить свой рацион, снизить уровень потребления кофеина и алкоголя, увеличить количество сна и сократить время, проводимое за экранами гаджетов.\nПоиск помощи специалиста: Если у вас серьезная тревога, вы можете обратиться к психологу или психиатру. Они могут помочь вам понять причины вашей тревоги и разработать стратегии по ее управлению.'
const TEXT_MINIMAL_KZ = 'Релаксация: медитация, терең тыныс алу, йога немесе прогрессивті бұлшықет релаксациясы сияқты релаксация әдістерін қолдануға болады. Бұл әдістер сіздің алаңдаушылық деңгейіңізді азайтуға және жағдайыңызды жақсартуға көмектеседі.\nФизикалық белсенділік: Физикалық белсенділік алаңдаушылық деңгейін төмендетуге, көңіл-күйді жақсартуға және стрессті азайтуға көмектеседі. Жаттығу, жүгіру, жүзу немесе жай ғана ашық ауада серуендеп көріңіз.\nБайланыс: Кейде достармен немесе жақын адамдармен қарым-қатынас алаңдаушылықты жеңуге көмектеседі. Сенімді адаммен сізді мазалаған нәрсе туралы сөйлесіңіз. Бұл жағдайға жаңа көзқараспен қарауға және алаңдаушылық деңгейін төмендетуге көмектеседі.\nӨмір салтын өзгерту: Сіздің өмір салтыңыз эмоционалдық күйіңізге әсер етуі мүмкін. Диетаны жақсартуға, кофеин мен алкогольді тұтынуды азайтуға, көбірек ұйықтауға және экран уақытын қысқартуға тырысыңыз.\nМаманнан көмек сұраңыз: Егер сізде қатты мазасыздық болса, психолог немесе психиатрға барғыңыз келуі мүмкін. Олар сіздің алаңдаушылықтың себептерін түсінуге және оны басқару стратегияларын әзірлеуге көмектеседі.'

const TEXT_DEFAULT = 'Если вам требуется экстренная помощь, или вы столкнулись с серьезной или угрожающей жизни ситуацией — обратитесь в одну из этих организаций Государственные телефоны доверия Республики Казахстан\n111 (круглосуточно)\n150\n«Городской центр психического здоровья» города Нур-Султан\n+7 (7172) 54-76-03 (телефон доверия)\n+7 7172 54-76-03 (психиатрическая служба)\n+7 7172 33-12-52 (наркологическая служба)\n«Городской центр психического здоровья» города Алматы\n+7 727 382-35-59 (cаll центр)\n1303 (телефон доверия)\n+7 708 983 28 63 (телефон доверия)\n+7 727 376-56-60 (психиатрическая служба)\n+7 727 382-34-62 (наркологическая служба)\nСоюз кризисных центров\n+7 708 10 608 10\nОО Janym\n8 (800) 004-05-40\nТелефон для связи: +7 707 127 10 31\nЭлектронная почта: help@sez.im'

export function generateTelegramQuestionMessageReplyMarkup(question: any, language: string): any {
    const inlineKeyboard = [];

    for (let i = 0; i < question.options.length; i++) {
        inlineKeyboard.push([{
            text: `${question.options[i][language]}`,
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

export async function getUserTestSummary(telegramId: string, testId:string, langQuestionId: string): Promise<UserTestSummary> {
    const user = await getUserTestAnswers(telegramId, testId);
    const userLangAnswer = await getUserAnswerByUserIdQuestionId(user.id, langQuestionId);

    let sum = 0;
    let type = "";
    let text =  "";

    if (userLangAnswer.option.text_ru) {
        text = TEXT_MINIMAL_RU + "\n" + TEXT_DEFAULT;
    } else {
        text = TEXT_MINIMAL_KZ + "\n" + TEXT_DEFAULT;
    }

    for (let i = 0; i < user.userAnswers.length; i++) {
        sum += user.userAnswers[i].option.points ?? 0;
    }

    const test = await getTestById(testId);

    if (test.title === "anxiety") {
        if (sum >= 0 && sum <= 7) {
            if (userLangAnswer.option.text_ru) {
                text = TEXT_MINIMAL_RU;
            } else {
                text = TEXT_MINIMAL_KZ;
            }
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
            if (userLangAnswer.option.text_ru) {
                text = TEXT_MINIMAL_RU;
            } else {
                text = TEXT_MINIMAL_KZ;
            }
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
        text,
        sum
    };
}