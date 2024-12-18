import { quizzDb } from "@/db"; // Importing the database connection module.
import { quizzes } from "@/db/quizz_schema"; // Importing the quizzes schema for type-safe database queries.
import { eq } from "drizzle-orm"; // Importing a function to construct equality conditions for queries.
import QuizzQuestions from "../QuizzQuestions"; // Importing the component that displays quiz questions.

const page = async ({ params }: { params: { quizzId: string } }) => {
    const quizzId = params.quizzId; // Extracting the quiz ID from the URL parameters.

    // Fetching the quiz data, including its associated questions and answers, based on the provided quiz ID.
    const quizz = await quizzDb.query.quizzes.findFirst({
        where: eq(quizzes.id, parseInt(quizzId)), // Filtering the quiz by its ID.
        with: {
            questions: {
                with: {
                    answers: true, // Including the answers related to each question.
                },
            },
        },
    });

    // If no quiz ID is provided, the quiz is not found, or the quiz has no questions, display an error message.
    if (!quizzId || !quizz || quizz.questions.length === 0) {
        return (
            <div>Quizz not found</div> // Returning a fallback UI for invalid or missing quiz data.
        );
    }

    // If the quiz exists, render the `QuizzQuestions` component with the fetched quiz data.
    return (
        <div>
            <QuizzQuestions quizz={quizz} />
        </div>
    );
};

export default page; // Exporting the `page` component as the default export for routing purposes.
