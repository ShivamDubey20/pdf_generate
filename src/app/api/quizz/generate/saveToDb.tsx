import { quizzDb } from "@/db"; // Importing the database connection.
import { quizzes, questions as dbQuestions, questionAnswers } from "@/db/quizz_schema"; // Importing schema definitions for quizzes, questions, and answers.
import { InferInsertModel } from "drizzle-orm"; // Importing a type helper to infer insert models from schema definitions.

// Define types for Quiz, Question, and Answer based on the schema.
type Quizz = InferInsertModel<typeof quizzes>;
type Question = InferInsertModel<typeof dbQuestions>;
type Answer = InferInsertModel<typeof questionAnswers>;

// Interface for quiz data that includes associated questions and answers.
interface SaveQuizzData extends Quizz {
    questions: Array<Question & { answers?: Answer[] }>; // A question can optionally include answers.
}

// Function to save a quiz with its questions and answers into the database.
export default async function saveQuizz(quizzData: SaveQuizzData) {
    // Destructure quiz details from the provided data.
    const { name, description, questions } = quizzData;

    // Insert the quiz into the database and retrieve its ID.
    const newQuizz = await quizzDb
        .insert(quizzes) // Insert into the quizzes table.
        .values({
            name, // Quiz name.
            description, // Quiz description.
        })
        .returning({ insertId: quizzes.id }); // Retrieve the inserted quiz ID.

    const quizzId = newQuizz[0].insertId; // Extract the quiz ID from the result.

    // Perform a database transaction to ensure consistency while inserting questions and answers.
    await quizzDb.transaction(async (tx) => {
        for (const question of questions) {
            // Insert each question into the database and retrieve its ID.
            const [{ questionId }] = await tx
                .insert(dbQuestions) // Insert into the questions table.
                .values({
                    questionText: question.questionText, // Question text.
                    quizzId, // Associate the question with the quiz ID.
                })
                .returning({ questionId: dbQuestions.id }); // Retrieve the inserted question ID.

            // Check if the question has answers to insert.
            if (question.answers && question.answers.length > 0) {
                // Insert all answers for the question in bulk.
                await tx.insert(questionAnswers).values(
                    question.answers.map((answer) => ({
                        answerText: answer.answerText, // Answer text.
                        isCorrect: answer.isCorrect, // Indicate if this is the correct answer.
                        questionId, // Associate the answer with the question ID.
                    }))
                );
            }
        }
    });

    // Return the ID of the saved quiz.
    return { quizzId };
}
