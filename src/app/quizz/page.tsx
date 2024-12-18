"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import ProgressBar from "@/components/progressBar";
import { ChevronLeft, X } from "lucide-react";
import ResultCard from "./ResultCard";
import QuizSubmission from "./Submission";

type Answer = {
    answerText: string;
    isCorrect: boolean;
    id: number;
};

type Question = {
    questionText: string;
    answers: Answer[];
};

const questions: Question[] = [
    {
        questionText: "What is React?",
        answers: [
            { answerText: "Library for building UI", isCorrect: true, id: 1 },
            { answerText: "A database", isCorrect: false, id: 2 },
            { answerText: "A CSS framework", isCorrect: false, id: 3 },
            { answerText: "A backend tool", isCorrect: false, id: 4 },
        ],
    },
    {
        questionText: "What is Angular?",
        answers: [
            { answerText: "JavaScript framework", isCorrect: true, id: 1 },
            { answerText: "A database", isCorrect: false, id: 2 },
            { answerText: "A programming language", isCorrect: false, id: 3 },
            { answerText: "An API", isCorrect: false, id: 4 },
        ],
    },
    {
        questionText: "What is Vue.js?",
        answers: [
            { answerText: "Frontend framework", isCorrect: true, id: 1 },
            { answerText: "A database", isCorrect: false, id: 2 },
            { answerText: "A backend tool", isCorrect: false, id: 3 },
            { answerText: "A server", isCorrect: false, id: 4 },
        ],
    },
];

export default function Home() {
    const [started, setStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);

    const handleStart = () => {
        setStarted(true);
        setScore(0);
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setSubmitted(false); // Reset submitted state
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null); // Reset selected answer for the next question
            setIsCorrect(null); // Reset correctness for the next question
        } else {
            setSubmitted(true);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
            setSelectedAnswer(null);
            setIsCorrect(null);
        }
    };

    const handleAnswer = (answer: Answer) => {
        setSelectedAnswer(answer.id);
        if (answer.isCorrect) {
            setScore((prevScore) => prevScore + 1);
        }
        setIsCorrect(answer.isCorrect);
    };

    const scorePercentage: number = Math.round((score / questions.length) * 100);
    if (submitted) {
        return (
            <QuizSubmission
                score={score}
                scorePercentage={scorePercentage}
                totalQuestions={questions.length}
            />
        );
    }
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="sticky top-0 z-10 shadow-md py-4 w-full bg-teal-500 text-white ">
                <header className="flex flex-col items-center">
                    <h1 className="text-2xl font-semibold mb-4">Expand Your Knowledge</h1>
                    {started && (
                        <div className="flex items-center w-full px-4 gap-4">
                            <Button
                                size="icon"
                                variant="outline"
                                className="text-white border-white hover:bg-white hover:text-teal-500 transition"
                                onClick={handlePrevious}
                            >
                                <ChevronLeft />
                            </Button>
                            <ProgressBar value={progress} />
                            <Button
                                size="icon"
                                variant="outline"
                                className="text-white border-white hover:bg-white hover:text-teal-500 transition"
                                onClick={() => setStarted(false)}
                            >
                                <X />
                            </Button>
                        </div>
                    )}
                </header>
            </div>

            {/* Main Content */}
            <main className="flex flex-1 flex-col items-center justify-center text-center px-4">
                {!started ? (
                    <>
                        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
                            Feel free to expand your knowledge!!!
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mb-6">
                            Unlock a world of information and explore limitless possibilities. Knowledge is power, and the journey to gaining it starts here.
                        </p>
                        <Button
                            onClick={handleStart}
                            className="px-6 py-3 text-lg font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                        >
                            Start
                        </Button>
                    </>
                ) : currentQuestion < questions.length ? (
                    <div className="w-full max-w-xl">
                        <h2 className="text-3xl font-bold mb-6 text-gray-800">
                            {questions[currentQuestion].questionText}
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {questions[currentQuestion].answers.map((answer) => (
                                <Button
                                    key={answer.id}
                                    variant="secondary"
                                    className={`px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg shadow-md transition-all ${selectedAnswer === answer.id ? (isCorrect ? "bg-green-300" : "bg-red-300") : ""
                                        }`}
                                    onClick={() => handleAnswer(answer)}
                                    disabled={selectedAnswer !== null}
                                >
                                    {answer.answerText}
                                </Button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-4 text-green-600">
                            Congratulations!
                        </h2>
                        <p className="text-lg text-gray-800 mb-4">
                            You scored {score} out of {questions.length}.
                        </p>
                        <Button
                            onClick={handleStart}
                            className="px-6 py-3 text-lg font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                        >
                            Restart
                        </Button>
                    </div>
                )}
            </main>

            {/* Footer Section */}
            {started && (
                <footer className="flex flex-col justify-center items-center py-6 bg-gray-100 border-t shadow-md">
                    <ResultCard
                        isCorrect={isCorrect}
                        correctAnswer={
                            questions[currentQuestion].answers.find(answer => answer.isCorrect)?.answerText || ""
                        }
                    />
                    <Button
                        onClick={handleNext}
                        className="mt-4 px-6 py-3 text-lg font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                    >
                        {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
                    </Button>
                </footer>
            )}
        </div>
    );
}