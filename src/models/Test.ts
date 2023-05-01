import getPrisma from "../prisma";


export async function getTestByName(name:string) {
    return (await getPrisma()).test.findFirstOrThrow({
        where: {
            title: name
        },
        include: {
            questions: {
                orderBy: {
                    order: 'asc'
                },
                include: {
                    options: {
                        include: {
                            question: true
                        }
                    }
                }
            }
        }
    })
}

export async function getTestById(testId: string) {
    return (await getPrisma()).test.findFirstOrThrow({
        where: {
            id: testId
        },
        include: {
            questions: {
                orderBy: {
                    order: 'asc'
                },
                include: {
                    options: true
                }
            }
        }
    })
}