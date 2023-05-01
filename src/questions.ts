import getPrisma from "./prisma";

let questions: any = [];

async function getQuestions() {
    if (questions.length === 0) {
        const prisma = await getPrisma();
        questions = prisma.question.findMany({
            orderBy: {
                order: "asc"
            }
        });

        return questions;
    } else {
        return questions;
    }
};

export default getQuestions;