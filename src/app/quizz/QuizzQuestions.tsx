"use client";

import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import QuizzSubmission from "./Submission";
import { InferSelectModel } from "drizzle-orm";
import { questionAnswers, questions as DbQuestions, quizzes } from "@/db/quizz_schema";

// Type definitions for Quiz data
type Answer = InferSelectModel<typeof questionAnswers>;
type Question = InferSelectModel<typeof DbQuestions> & { answers: Answer[] };
type Quizz = InferSelectModel<typeof quizzes> & { questions: Question[] };

type Props = {
    quizz: Quizz;
};

// Utility function to shuffle an array (Fisher-Yates shuffle algorithm)
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export default function QuizzQuestions(props: Props) {
    const { questions } = props.quizz;

    // State hooks for managing quiz states
    const [started, setStarted] = useState(false); // Tracks if the quiz has started
    const [currentQuestion, setCurrentQuestion] = useState(0); // Current question index
    const [score, setScore] = useState(0); // User's current score
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null); // Tracks selected answer ID
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null); // Tracks if the selected answer is correct
    const [submitted, setSubmitted] = useState<boolean>(false); // Tracks if the quiz is submitted
    const [timeLeft, setTimeLeft] = useState<number>(15); // Time left for the current question
    const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]); // Stores shuffled questions for the quiz
    const [questionLimit, setQuestionLimit] = useState<number>(5); // Number of questions user wants to attempt
    const [feedback, setFeedback] = useState<string>(""); // Feedback for selected answers

    // Timer logic to manage countdown for each question
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (started && !submitted) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        handleNext(); // Automatically move to the next question if time runs out
                        return 15;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer); // Cleanup timer on component unmount or dependency change
    }, [currentQuestion, started, submitted]);

    // Handles starting the quiz, shuffling questions, and resetting state
    const handleStart = () => {
        const shuffled = shuffleArray(questions).slice(0, questionLimit); // Shuffle and limit questions
        setShuffledQuestions(shuffled);
        setStarted(true);
        setScore(0);
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setSubmitted(false);
        setTimeLeft(15);
        setFeedback("");
    };

    // Handles moving to the next question or submitting the quiz if it’s the last question
    const handleNext = () => {
        if (currentQuestion < shuffledQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setIsCorrect(null);
            setTimeLeft(15);
            setFeedback("");
        } else {
            setSubmitted(true); // Mark the quiz as completed
        }
    };

    // Handles answer selection and provides feedback
    const handleAnswer = (answer: Answer) => {
        setSelectedAnswer(answer.id);
        if (answer.isCorrect) {
            setScore((prevScore) => prevScore + 1); // Increment score for correct answers
            setIsCorrect(true);
            setFeedback("🎉 Correct! Well done! 🎉");
        } else {
            setIsCorrect(false);
            const correctAnswer = shuffledQuestions[currentQuestion].answers.find(
                (ans) => ans.isCorrect
            )?.answerText;
            setFeedback(`❌ Wrong! Correct answer is: ${correctAnswer}`); // Display correct answer if incorrect
        }
    };

    // Calculate progress for the progress bar
    const progress = ((currentQuestion + 1) / shuffledQuestions.length) * 100;

    // Render the submission screen when the quiz is completed
    if (submitted) {
        return (
            <QuizzSubmission
                score={score}
                scorePercentage={Math.round((score / shuffledQuestions.length) * 100)}
                totalQuestions={shuffledQuestions.length}
            />
        );
    }

    return (
        <div className="bg-blue-50 min-h-screen flex flex-col items-center justify-center p-4">
            {/* Header */}
            <header className="w-full max-w-2xl mb-6 text-center">
                {!started && (
                    <h1 className="text-3xl md:text-4xl font-bold text-blue-600">
                        🌟 Test Your Knowledge! 🌟
                    </h1>
                )}
            </header>

            {/* Main Quiz Content */}
            <main className="w-full max-w-2xl">
                {!started ? (
                    <Card className="text-center p-6 bg-white shadow-lg rounded-xl">
                        {/* Initial Screen with Question Limit Options */}
                        <CardHeader>
                            <h2 className="text-2xl font-semibold mb-2">🎉 Are You Ready? 🎉</h2>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">
                                Select how many questions you want to attempt! 🚀
                            </p>
                            <div className="flex justify-center gap-4 mb-4">
                                {/* Buttons for choosing question limit */}
                                <Button
                                    onClick={() => setQuestionLimit(5)}
                                    className={`${questionLimit === 5 ? "bg-green-400 text-white" : "bg-gray-200"
                                        } py-2 px-4 rounded-lg`}
                                >
                                    5 Questions
                                </Button>
                                <Button
                                    onClick={() => setQuestionLimit(10)}
                                    className={`${questionLimit === 10 ? "bg-green-400 text-white" : "bg-gray-200"
                                        } py-2 px-4 rounded-lg`}
                                >
                                    10 Questions
                                </Button>
                                <Button
                                    onClick={() => setQuestionLimit(20)}
                                    className={`${questionLimit === 20 ? "bg-green-400 text-white" : "bg-gray-200"
                                        } py-2 px-4 rounded-lg`}
                                >
                                    20 Questions
                                </Button>
                                <Button
                                    onClick={() =>
                                        setQuestionLimit(Math.floor(Math.random() * 16) + 5)
                                    }
                                    className="bg-yellow-400 text-white py-2 px-4 rounded-lg"
                                >
                                    🎲 Random
                                </Button>
                            </div>
                        </CardContent>
                        <CardFooter>
                            {/* Start Quiz Button */}
                            <Button
                                onClick={handleStart}
                                className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full"
                            >
                                🚀 Start Quiz
                            </Button>
                        </CardFooter>
                    </Card>
                ) : (
                    <Card className="p-6 bg-white shadow-lg rounded-xl">
                        {/* Question Screen */}
                        <CardHeader>
                            <h2 className="text-xl font-semibold text-blue-600 mb-4">
                                📝 {shuffledQuestions[currentQuestion].questionText}
                            </h2>
                            <div className="text-red-500 font-semibold text-lg">
                                ⏰ Time Left: {timeLeft} sec
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-4">
                                {/* Display answers for the current question */}
                                {shuffledQuestions[currentQuestion].answers.map((answer) => (
                                    <Button
                                        key={answer.id}
                                        variant="secondary"
                                        className={`w-full py-3 text-base font-medium rounded-lg
                ${selectedAnswer === answer.id
                                                ? isCorrect && answer.isCorrect
                                                    ? "bg-green-500 text-white shadow-md"
                                                    : "bg-red-500 text-white shadow-md"
                                                : "bg-blue-100 hover:bg-blue-200"
                                            }`}
                                        onClick={() => handleAnswer(answer)}
                                        disabled={selectedAnswer !== null}
                                        style={{
                                            whiteSpace: "normal",  
                                            wordBreak: "break-word",  
                                            minHeight: "60px",  
                                            lineHeight: "1.5",  
                                            fontSize: "1rem",  
                                        }}
                                    >
                                        {answer.answerText}
                                    </Button>
                                ))}
                            </div>
                            {/* Feedback for answer */}
                            {feedback && (
                                <div
                                    className={`mt-4 text-center text-lg font-semibold ${isCorrect ? "text-green-600" : "text-red-600"
                                        }`}
                                >
                                    {feedback}
                                </div>
                            )}
                        </CardContent>

                        <CardFooter className="flex justify-end">
                            {/* Button to move to next question or submit */}
                            <Button
                                onClick={handleNext}
                                className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full"
                            >
                                {currentQuestion === shuffledQuestions.length - 1
                                    ? "🎉 Submit 🎉"
                                    : "➡️ Next Question"}
                            </Button>
                        </CardFooter>
                    </Card>
                )}
            </main>
        </div>
    );
}
