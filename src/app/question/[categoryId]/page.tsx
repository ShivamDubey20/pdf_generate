import { devDb } from "@/db";
import { questionCategories } from "@/db/dev_schema";
import { eq } from "drizzle-orm";
import QuestionList from "../QuestionList";

const page = async ({ params }: { params: { categoryId: string } }) => {
    // Validate and parse the categoryId
    const categoryId = parseInt(params.categoryId, 10);

    // Handle invalid categoryId early
    if (isNaN(categoryId)) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold text-red-600">Invalid Category ID</h1>
            </div>
        );
    }

    // Fetch the category with its related questions
    const category = await devDb.query.questionCategories.findFirst({
        where: eq(questionCategories.id, categoryId),
        with: {
            questions: true, // Fetch related questions
        },
    });

    // Handle invalid category ID or no questions
    if (!category || category.questions.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold text-red-600">Category not found</h1>
            </div>
        );
    }

    // Render the category with questions
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{category.name}</h1>
            <p className="mb-4 text-gray-600">{category.description}</p>
            <QuestionList questions={category.questions} />
        </div>
    );
};

export default page;
