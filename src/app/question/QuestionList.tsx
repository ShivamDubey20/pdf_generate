"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/progressBar";
import { ChevronLeft, X } from "lucide-react";
import { InferSelectModel } from "drizzle-orm";
import { questions as DbQuestions } from "@/db/dev_schema";

// Type Definition for Questions
type Question = InferSelectModel<typeof DbQuestions>;

type Props = {
    questions: Question[]; // Props contain an array of questions fetched from the database
};

export default function QuestionList({ questions }: Props) {
    // State to manage whether the quiz has started
    const [started, setStarted] = useState(false);

    // State to keep track of the current question index
    const [currentQuestion, setCurrentQuestion] = useState(0);

    // State to toggle answer visibility
    const [showAnswer, setShowAnswer] = useState(false);

    // State to store the number of questions the user wants in the quiz
    const [questionCount, setQuestionCount] = useState(5);

    // State to store the subset of questions selected for the quiz
    const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);

    // State to track if the quiz is finished
    const [quizFinished, setQuizFinished] = useState(false);

    // Handle input changes for the number of questions the user wants
    const handleQuestionCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 5 && value <= 20) {
            setQuestionCount(value); // Only update if input is valid (between 5 and 20)
        }
    };

    // Start the quiz by setting up the filtered questions and resetting state
    const handleStart = () => {
        setFilteredQuestions(questions.slice(0, questionCount)); // Select only the desired number of questions
        setStarted(true); // Mark quiz as started
        setCurrentQuestion(0); // Reset current question index
        setShowAnswer(false); // Hide any visible answers
    };

    // Handle navigation to the next question or finish the quiz if it’s the last question
    const handleNext = () => {
        if (currentQuestion < filteredQuestions.length - 1) {
            setCurrentQuestion((prev) => prev + 1); // Move to the next question
            setShowAnswer(false); // Reset answer visibility
        } else {
            setQuizFinished(true); // Mark the quiz as finished
        }
    };

    // Handle navigation to the previous question
    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion((prev) => prev - 1); // Move to the previous question
            setShowAnswer(false); // Reset answer visibility
        }
    };

    // Calculate the progress percentage for the progress bar
    const progress = ((currentQuestion + 1) / filteredQuestions.length) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-200 flex flex-col justify-center items-center px-4">
            {/* Render the summary screen if the quiz is finished */}
            {quizFinished ? (
                <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg text-center">
                    <h1 className="text-3xl font-bold text-indigo-700 mb-6">Quiz Summary 🎉</h1>
                    <p className="text-gray-600 mb-4">
                        Here are the questions you answered along with their correct answers:
                    </p>
                    {/* List all the questions and their answers */}
                    <ul className="space-y-4">
                        {filteredQuestions.map((question, index) => (
                            <li
                                key={index}
                                className="p-4 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-all"
                            >
                                <h2 className="text-lg font-semibold text-indigo-600">
                                    Q{index + 1}: {question.questionText}
                                </h2>
                                <p className="text-sm text-gray-700 mt-2">
                                    <span className="font-medium text-green-600">Correct Answer:</span>{" "}
                                    {question.answer}
                                </p>
                            </li>
                        ))}
                    </ul>
                    {/* Restart the quiz */}
                    <Button
                        onClick={() => {
                            setStarted(false); // Reset to the start screen
                            setQuizFinished(false); // Reset quiz completion state
                            setFilteredQuestions([]); // Clear filtered questions
                        }}
                        className="mt-6 px-6 py-3 bg-gradient-to-r from-indigo-400 to-purple-500 text-white rounded-lg hover:scale-105 hover:shadow-lg transition-all"
                    >
                        Start Again 🔄
                    </Button>
                </div>
            ) : (
                // Main quiz screen
                <div className="w-full max-w-3xl">
                    <header className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-extrabold text-blue-700 animate-bounce">
                            This is your arena 🎯
                        </h1>
                        {/* Show navigation and progress controls if the quiz has started */}
                        {started && (
                            <div className="flex items-center gap-4">
                                {/* Previous question button */}
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="bg-white shadow-md hover:scale-110 transition-transform rounded-full"
                                    onClick={handlePrevious}
                                    disabled={currentQuestion === 0} // Disable if on the first question
                                >
                                    <ChevronLeft />
                                </Button>
                                {/* Progress bar */}
                                <ProgressBar value={progress} />
                                {/* Exit quiz button */}
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="bg-red-100 hover:bg-red-200 shadow-md rounded-full"
                                    onClick={() => setStarted(false)} // Exit to start screen
                                >
                                    <X />
                                </Button>
                            </div>
                        )}
                    </header>

                    <main className="bg-white p-6 rounded-lg shadow-lg">
                        {/* Show the start screen if the quiz hasn’t started */}
                        {!started ? (
                            <>
                                <h1 className="text-4xl font-bold text-center text-indigo-600 mb-4 animate-pulse">
                                    Choose Your Challenge 🌟
                                </h1>
                                <p className="text-center text-gray-600 mb-6">
                                    Enter the number of questions you'd like to answer (5 to 20):
                                </p>
                                {/* Input for setting the question count */}
                                <div className="flex justify-center items-center gap-4 mb-6">
                                    <input
                                        type="number"
                                        value={questionCount}
                                        onChange={handleQuestionCountChange}
                                        min="5"
                                        max="20"
                                        className="w-20 text-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
                                    />
                                    <span className="text-gray-500">questions</span>
                                </div>
                                {/* Start button */}
                                <Button
                                    onClick={handleStart}
                                    className="w-full py-3 bg-gradient-to-r from-indigo-400 to-purple-500 text-white rounded-lg hover:scale-105 hover:shadow-lg transition-all"
                                >
                                    Start 🚀
                                </Button>
                            </>
                        ) : (
                            // Display the current question
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-indigo-700 mb-4">
                                    {filteredQuestions[currentQuestion]?.questionText}
                                </h2>
                                {/* Button to reveal the correct answer */}
                                <Button
                                    onClick={() => setShowAnswer(true)}
                                    className="py-3 px-6 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-lg hover:scale-105 hover:shadow-lg transition-all"
                                    disabled={showAnswer} // Disable if answer is already shown
                                >
                                    Show Answer 💡
                                </Button>
                                {showAnswer && (
                                    <div className="mt-6">
                                        <p className="text-lg italic text-blue-500 font-light">
                                            Correct Answer:{" "}
                                            <span className="underline">{filteredQuestions[currentQuestion]?.answer}</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </main>

                    {/* Footer navigation (Next button or Finish button) */}
                    {started && (
                        <footer className="flex justify-center items-center py-6 bg-gray-100 border-t shadow-md">
                            <Button
                                onClick={handleNext}
                                className="px-6 py-3 text-lg font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:scale-105 hover:shadow-lg transition-all"
                            >
                                {currentQuestion === filteredQuestions.length - 1 ? "Finish 🎉" : "Next →"}
                            </Button>
                        </footer>
                    )}
                </div>
            )}
        </div>
    );
}
