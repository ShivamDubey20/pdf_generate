import { NextRequest, NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import saveCategory from "./saveToDb";

// Handle the POST request
export async function POST(req: NextRequest) {
    try {
        // Parse the incoming request and retrieve form data
        const body = await req.formData();
        const document = body.get("pdf");

        // Validate PDF document
        if (!document || !(document instanceof Blob)) {
            return NextResponse.json(
                { error: "Invalid PDF document provided." },
                { status: 400 }
            );
        }

        // Load and parse the PDF file
        const pdfLoader = new PDFLoader(document as Blob, { parsedItemSeparator: " " });
        const docs = await pdfLoader.load();

        // Extract text content from the loaded PDF
        const texts = docs
            .filter((doc) => doc.pageContent && doc.pageContent.trim()) // Filter out empty or invalid pages
            .map((doc) => doc.pageContent); // Get text content from each page

        // Return an error if no readable text is found
        if (texts.length === 0) {
            return NextResponse.json(
                { error: "No readable text found in the PDF." },
                { status: 400 }
            );
        }

        // Ensure the Google API key is available
        if (!process.env.GOOGLE_API_KEY) {
            return NextResponse.json(
                { error: "Google API key not provided." },
                { status: 500 }
            );
        }

        // Initialize the Google Generative AI model with the API key
        const model = new ChatGoogleGenerativeAI({
            apiKey: process.env.GOOGLE_API_KEY,
            modelName: "gemini-1.5-flash", // Specify the AI model version
        });

        // Create the prompt for extracting questions and answers from the text
        const prompt = `Extract questions with correct answers from the following text. For each question, provide:

        - A question statement
        - The correct answer as a string.

        Format your answer as a JSON array of objects like so:

          [
            {
              "question": "Question statement here",
              "answer": "Correct answer text here"
            },
            ...
          ]

        Text:
        ${texts.join("\n\n")}`; // Join all extracted texts to provide to the AI

        const message = new HumanMessage({ content: prompt });

        // Send the prompt to the AI model and retrieve the result
        const result = await model.invoke([message]);

        // Check if the AI returned a valid response
        if (!result || typeof result.content !== "string") {
            return NextResponse.json(
                { error: "Failed to generate questions from AI model." },
                { status: 500 }
            );
        }

        let parsedQuestions;
        try {
            // Parse the AI response into a JSON format
            const sanitizedContent = result.content
                .replace(/```json|```/g, "") // Remove any Markdown code fences
                .trim();

            parsedQuestions = JSON.parse(sanitizedContent);

            // Format the parsed questions to match the database schema
            const formattedQuestions = parsedQuestions.map((q: any) => ({
                questionText: q.question || "Untitled Question", // Default text for missing questions
                answer: q.answer || "No answer provided", // Default text for missing answers
            }));

            // Generate a category name and description from the extracted text
            const categoryName = texts[0]?.split("\n")[0]?.slice(0, 50) || "Generated Category"; // Use the first line of text or a default name
            const description =
                texts.length > 0
                    ? texts[0].slice(0, 100) // First 100 characters of text for description
                    : "Category generated from provided PDF content.";

            // Save the category and associated questions to the database
            const { categoryId } = await saveCategory({
                name: categoryName,
                description,
                questions: formattedQuestions,
            });

            // Return the ID of the created category as a response
            return NextResponse.json({ categoryId }, { status: 200 });
        } catch (err) {
            // Handle errors related to parsing or formatting the AI response
            console.error("Error parsing or formatting AI response:", err);
            console.error("Raw AI response content:", result.content);

            return NextResponse.json(
                { error: "Invalid or unparseable JSON response from AI model." },
                { status: 500 }
            );
        }
    } catch (error) {
        // Handle unexpected errors in the request processing
        console.error("Error processing request:", error);

        const errorMessage =
            error instanceof Error ? error.message : "Unknown error occurred.";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
