"use strict";
use('test');
db.getCollection("Question").deleteMany({});
var testLang = db.getCollection("Test").findOne({ title: "pref_lang" });
var testAnxiety = db.getCollection("Test").findOne({ title: "anxiety" });
var testDepression = db.getCollection("Test").findOne({ title: "depression" });
db.getCollection("Question").insertMany([
    {
        text_ru: "Выберите язык",
        testId: testLang["_id"],
        order: 1
    },
    {
        text_ru: "Выберите вид анкетирования",
        text_kz: "Сауалнама түрі",
        testId: testLang["_id"],
        order: 2
    },
    {
        text_ru: "Онемение или покалывание",
        text_kz: "Ұю немесе шаншу  сезімі",
        testId: testAnxiety["_id"],
        order: 1
    },
    {
        text_ru: "Чувство жара",
        text_kz: "Қызыну сезімі",
        testId: testAnxiety["_id"],
        order: 2
    },
    {
        text_ru: "Шаткость в ногах",
        text_kz: "Аяқтағы тәлтіректеушілік",
        testId: testAnxiety["_id"],
        order: 3
    },
    {
        text_ru: "Невозможность расслабиться",
        text_kz: "Тынығуға қабілетсіздік",
        testId: testAnxiety["_id"],
        order: 4
    },
    {
        text_ru: "Страх, что произойдёт самое плохое",
        text_kz: "Жаман жағдай болады деп қорқу",
        testId: testAnxiety["_id"],
        order: 5
    },
    {
        text_ru: "Головокружение",
        text_kz: "Бас айналу",
        testId: testAnxiety["_id"],
        order: 6
    },
    {
        text_ru: "Ускоренное сердцебиение",
        text_kz: "Жүрек қағысының жиілеуі",
        testId: testAnxiety["_id"],
        order: 7
    },
    {
        text_ru: "Неустойчивость",
        text_kz: "Тұрақсыздық",
        testId: testAnxiety["_id"],
        order: 8
    },
    {
        text_ru: "Ощущение ужаса",
        text_kz: "Қорқыныщ сезімі",
        testId: testAnxiety["_id"],
        order: 9
    },
    {
        text_ru: "Нервозность",
        text_kz: "Жүйкенің тозуы",
        testId: testAnxiety["_id"],
        order: 10
    },
    {
        text_ru: "Ощущение удушья",
        text_kz: "Тұншығу сезімі",
        testId: testAnxiety["_id"],
        order: 11
    },
    {
        text_ru: "Дрожание рук",
        text_kz: "Қолдың дірілдеуі",
        testId: testAnxiety["_id"],
        order: 12
    },
    {
        text_ru: "Шаткость походки",
        text_kz: "Жүрістің тәлтіректеуі",
        testId: testAnxiety["_id"],
        order: 13
    },
    {
        text_ru: "Страх утраты контроля",
        text_kz: "Басқаруды жоғалту қорқынышы",
        testId: testAnxiety["_id"],
        order: 14
    },
    {
        text_ru: "Затрудненность дыхания",
        text_kz: "Тыныс алудың қиындауы",
        testId: testAnxiety["_id"],
        order: 15
    },
    {
        text_ru: "Страх смерти",
        text_kz: "Өлімнен қорқу",
        testId: testAnxiety["_id"],
        order: 16
    },
    {
        text_ru: "Испуг",
        text_kz: "Шошыну",
        testId: testAnxiety["_id"],
        order: 17
    },
    {
        text_ru: "Расстройство желудка или дискомфорт в животе",
        text_kz: "Дәреттің бұзылуы немесе іштегі ыңғайсыздық",
        testId: testAnxiety["_id"],
        order: 18
    },
    {
        text_ru: "Потеря сознания",
        text_kz: "Есінен тану",
        testId: testAnxiety["_id"],
        order: 19
    },
    {
        text_ru: "Приливы крови к лицу",
        text_kz: "Бет терісінің қызуы",
        testId: testAnxiety["_id"],
        order: 20
    },
    {
        text_ru: "Усиление потоотделения  (не связанное с жарой)",
        text_kz: "Терлегіштік (айналадағы температураға байланысты емес)",
        testId: testAnxiety["_id"],
        order: 21
    },
    {
        text_ru: "Печаль",
        text_kz: "Қайғы",
        testId: testDepression["_id"],
        order: 1
    },
    {
        text_ru: "Пессимизм",
        text_kz: "Пессимизм",
        testId: testDepression["_id"],
        order: 2
    },
    {
        text_ru: "Оценка прошлого",
        text_kz: "Өткен өміріңізді бағаңыз",
        testId: testDepression["_id"],
        order: 3
    },
    {
        text_ru: "Потеря удовлетворения",
        text_kz: "Қанағаттанудың жоғалуы",
        testId: testDepression["_id"],
        order: 4
    },
    {
        text_ru: "Чувство вины",
        text_kz: "Кінә",
        testId: testDepression["_id"],
        order: 5
    },
    {
        text_ru: "Чувство наказания",
        text_kz: "Жаза сезімі",
        testId: testDepression["_id"],
        order: 6
    },
    {
        text_ru: "Нелюбовь к себе",
        text_kz: "Өз-өзін ұнатпау ",
        testId: testDepression["_id"],
        order: 7
    },
    {
        text_ru: "Самокритика",
        text_kz: "Өзін-өзі сынға алу",
        testId: testDepression["_id"],
        order: 8
    },
    {
        text_ru: "Суицидальные мысли",
        text_kz: "Суицидтік ойлар",
        testId: testDepression["_id"],
        order: 9
    },
    {
        text_ru: "Плаксивость",
        text_kz: "Жылауықтық",
        testId: testDepression["_id"],
        order: 10
    },
    {
        text_ru: "Возбужденность",
        text_kz: "Толқу",
        testId: testDepression["_id"],
        order: 11
    },
    {
        text_ru: "Потеря интереса",
        text_kz: "Қызығушылықты жоғалту",
        testId: testDepression["_id"],
        order: 12
    },
    {
        text_ru: "Не решительность",
        text_kz: "Шешім қабылдау қиындығы",
        testId: testDepression["_id"],
        order: 13
    },
    {
        text_ru: "Бесполезность",
        text_kz: "Пайдасыздық",
        testId: testDepression["_id"],
        order: 14
    },
    {
        text_ru: "Потеря энергии",
        text_kz: "Энергияны жоғалту",
        testId: testDepression["_id"],
        order: 15
    },
    {
        text_ru: "Изменения в режиме сна",
        text_kz: "Ұйқы тәртібіндегі өзгерістер",
        testId: testDepression["_id"],
        order: 16
    },
    {
        text_ru: "Раздражительность",
        text_kz: "Ашуланшақтық",
        testId: testDepression["_id"],
        order: 17
    },
    {
        text_ru: "Изменения аппетита",
        text_kz: "Тәбеттің өзгеруі",
        testId: testDepression["_id"],
        order: 18
    },
    {
        text_ru: "Сложности в концентрации",
        text_kz: "Назар аударуды шоғырландырудағы қиындықтар",
        testId: testDepression["_id"],
        order: 19
    },
    {
        text_ru: "Усталость",
        text_kz: "Шаршаңдық",
        testId: testDepression["_id"],
        order: 20
    },
    {
        text_ru: "Интерес к интимной близости",
        text_kz: "Жыныстық қатынасқа қызығушылық",
        testId: testDepression["_id"],
        order: 21
    }
]);
