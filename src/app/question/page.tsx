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
    questions: Question[]; // Expecting an array of questions
};

export default function QuestionList({ questions }: Props) {
    const [started, setStarted] = useState(false); // Controls if the quiz has started
    const [currentQuestion, setCurrentQuestion] = useState(0); // Tracks the current question index
    const [showAnswer, setShowAnswer] = useState(false); // Controls answer visibility
    const [questionCount, setQuestionCount] = useState(5); // Number of questions the user wants
    const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]); // Subset of questions

    // Handle the number of questions input
    const handleQuestionCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 5 && value <= 20) {
            setQuestionCount(value);
        }
    };

    // Start the quiz
    const handleStart = () => {
        setFilteredQuestions(questions.slice(0, questionCount)); // Take only the specified number of questions
        setStarted(true);
        setCurrentQuestion(0);
        setShowAnswer(false);
    };

    // Move to the next question
    const handleNext = () => {
        if (currentQuestion < filteredQuestions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
            setShowAnswer(false);
        }
    };

    // Move to the previous question
    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion((prev) => prev - 1);
            setShowAnswer(false);
        }
    };

    // Progress calculation
    const progress = ((currentQuestion + 1) / filteredQuestions.length) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-200 flex flex-col justify-center items-center px-4">
            {/* Header */}
            <div className="w-full max-w-3xl">
                <header className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-extrabold text-blue-700 animate-bounce">This is your arena 🎯</h1>
                    {started && (
                        <div className="flex items-center gap-4">
                            <Button
                                size="icon"
                                variant="outline"
                                className="bg-white shadow-md hover:scale-110 transition-transform rounded-full"
                                onClick={handlePrevious}
                                disabled={currentQuestion === 0} // Disable at first question
                            >
                                <ChevronLeft />
                            </Button>
                            <ProgressBar value={progress}  />
                            <Button
                                size="icon"
                                variant="outline"
                                className="bg-red-100 hover:bg-red-200 shadow-md rounded-full"
                                onClick={() => setStarted(false)} // Exit the quiz
                            >
                                <X />
                            </Button>
                        </div>
                    )}
                </header>
            </div>

            {/* Main Content */}
            <main className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg transition-all transform hover:scale-[1.02] hover:shadow-2xl">
                {!started ? (
                    <>
                        <h1 className="text-4xl font-bold text-center text-indigo-600 mb-4 animate-pulse">
                            Choose Your Challenge 🌟
                        </h1>
                        <p className="text-center text-gray-600 mb-6">
                            Enter the number of questions you'd like to answer (5 to 20):
                        </p>
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
                        <Button
                            onClick={handleStart}
                            className="w-full py-3 bg-gradient-to-r from-indigo-400 to-purple-500 text-white rounded-lg hover:scale-105 hover:shadow-lg transition-all"
                        >
                            Start 🚀
                        </Button>
                    </>
                ) : (
                    <div className="text-center">
                        {/* Display Question */}
                        <h2 className="text-2xl font-bold text-indigo-700 mb-4 animate-fade-in">
                            {filteredQuestions[currentQuestion]?.questionText}
                        </h2>

                        {/* Show Answer Button */}
                        <Button
                            onClick={() => setShowAnswer(true)}
                            className="py-3 px-6 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-lg hover:scale-105 hover:shadow-lg transition-all"
                            disabled={showAnswer} // Prevent re-clicking
                        >
                            Show Answer 💡
                        </Button>

                        {/* Display Correct Answer */}
                        {showAnswer && (
                            <div className="mt-6 animate-bounce">
                                <p className="text-lg text-green-600">
                                    Correct Answer:{" "}
                                    <span className="font-semibold">{filteredQuestions[currentQuestion]?.answer}</span>
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Footer */}
            {started && (
                <footer className="w-full max-w-3xl flex justify-center items-center py-6 mt-6 bg-gray-100 border-t shadow-md rounded-lg">
                    <Button
                        onClick={handleNext}
                        className="px-6 py-3 text-lg font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:scale-105 hover:shadow-lg transition-all"
                    >
                        {currentQuestion === filteredQuestions.length - 1 ? "Finish 🎉" : "Next →"}
                    </Button>
                </footer>
            )}
        </div>
    );
}
