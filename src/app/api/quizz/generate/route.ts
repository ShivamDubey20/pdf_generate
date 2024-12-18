import { NextRequest, NextResponse } from "next/server"; // Importing Next.js server-side request and response utilities.
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"; // Importing the Google Generative AI model integration.
import { HumanMessage } from "@langchain/core/messages"; // Importing a message structure for AI interaction.
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"; // Importing PDF loader to extract text from PDF documents.
import saveQuizz from "./saveToDb"; // Importing a custom function to save quiz data to the database.

export async function POST(req: NextRequest) {
    try {
        // Parse the form data to extract the uploaded PDF document.
        const body = await req.formData();
        const document = body.get("pdf");

        // Validate the uploaded document to ensure it's a valid PDF.
        if (!document || !(document instanceof Blob)) {
            return NextResponse.json(
                { error: "Invalid PDF document provided." },
                { status: 400 }
            );
        }

        // Load and parse the PDF content using the PDFLoader utility.
        const pdfLoader = new PDFLoader(document as Blob, { parsedItemSeparator: " " });
        const docs = await pdfLoader.load();

        // Extract clean text content from the PDF.
        const texts = docs
            .filter((doc) => doc.pageContent && doc.pageContent.trim()) // Filter pages with valid text content.
            .map((doc) => doc.pageContent); // Extract text content from each page.

        // Return an error if no readable text is found in the PDF.
        if (texts.length === 0) {
            return NextResponse.json(
                { error: "No readable text found in the PDF." },
                { status: 400 }
            );
        }

        // Ensure the API key for Google Generative AI is available in environment variables.
        if (!process.env.GOOGLE_API_KEY) {
            return NextResponse.json(
                { error: "Google API key not provided." },
                { status: 500 }
            );
        }

        // Initialize the Google Generative AI model with the provided API key.
        const model = new ChatGoogleGenerativeAI({
            apiKey: process.env.GOOGLE_API_KEY,
            modelName: "gemini-1.5-flash",
        });

        // Prepare a prompt to instruct the AI to extract MCQs from the provided text.
        const prompt = `Extract multiple-choice questions (MCQs) from the following text. For each question, provide:

        - A question statement
        - A list of 4 answer options, clearly marked as 'A', 'B', 'C', and 'D'.
        - The correct answer letter (A, B, C, or D).
        Format your answer as a JSON array of objects like so:

          [
            {
              "question": "Question statement here",
              "options": {
                "A": "Option A",
                "B": "Option B",
                "C": "Option C",
                "D": "Option D"
              },
              "correct_answer": "A|B|C|D"
            },
            ...
          ]

        Text:
        ${texts.join("\n\n")}`; // Combine extracted text for input to the AI model.

        const message = new HumanMessage({ content: prompt }); // Create a message with the prompt.

        // Invoke the AI model with the prepared message.
        const result = await model.invoke([message]);

        // Handle case where the AI model fails to provide a valid response.
        if (!result || typeof result.content !== "string") {
            return NextResponse.json(
                { error: "Failed to generate quiz from AI model." },
                { status: 500 }
            );
        }

        let parsedQuestions;
        try {
            // Parse and clean the AI's response to ensure it's valid JSON.
            const sanitizedContent = result.content
                .replace(/```json|```/g, "") // Remove JSON code fences.
                .trim();

            parsedQuestions = JSON.parse(sanitizedContent); // Parse the JSON content.

            // Format the parsed questions into a structure suitable for saving.
            const formattedQuestions = parsedQuestions.map((q: any) => ({
                questionText: q.question || "Untitled Question",
                answers: Object.entries(q.options || {}).map(([key, value]) => ({
                    answerText: value,
                    isCorrect: q.correct_answer === key, // Identify the correct answer.
                })),
            }));

            // Dynamically generate quiz metadata (name and description) based on the PDF content.
            const quizName = texts[0]?.split("\n")[0]?.slice(0, 50) || "Generated Quiz"; // Use the first line of text as the quiz name.
            const description =
                texts.length > 0
                    ? texts[0].slice(0, 100) // Use the first 100 characters as the quiz description.
                    : "Quiz generated from provided PDF content.";

            // Save the formatted quiz to the database and retrieve its ID.
            const { quizzId } = await saveQuizz({
                name: quizName,
                description,
                questions: formattedQuestions,
            });

            // Return the quiz ID in the response.
            return NextResponse.json({ quizzId }, { status: 200 });
        } catch (err) {
            // Handle errors during parsing or formatting of the AI response.
            console.error("Error parsing or formatting AI response:", err);
            console.error("Raw AI response content:", result.content);

            return NextResponse.json(
                { error: "Invalid or unparseable JSON response from AI model." },
                { status: 500 }
            );
        }
    } catch (error) {
        // Handle any other unexpected errors during request processing.
        console.error("Error processing request:", error);

        const errorMessage =
            error instanceof Error ? error.message : "Unknown error occurred.";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
