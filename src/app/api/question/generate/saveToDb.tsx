import { devDb } from "@/db";
import { questionCategories, questions as dbQuestions } from "@/db/dev_schema";
import { InferInsertModel } from "drizzle-orm";

type QuestionCategory = InferInsertModel<typeof questionCategories>;
type Question = InferInsertModel<typeof dbQuestions>;

interface SaveCategoryData extends QuestionCategory {
    questions: Array<Omit<Question, "id" | "categoryId">>; 
}

export default async function saveCategory(categoryData: SaveCategoryData) {
    const { name, description, questions } = categoryData;

    // Insert the new category and retrieve its ID
    const newCategory = await devDb
        .insert(questionCategories)
        .values({
            name,
            description,
        })
        .returning({ insertId: questionCategories.id });

    const categoryId = newCategory[0].insertId;

    // Use a transaction to insert all questions linked to the category
    await devDb.transaction(async (tx) => {
        for (const question of questions) {
            await tx.insert(dbQuestions).values({
                questionText: question.questionText,
                answer: question.answer,
                categoryId, // Link to the inserted category
            });
        }
    });

    return { categoryId };
}
