type Props = {
    scorePercentage: number;
    score: number;
    totalQuestions: number;
    
};

const QuizzSubmission = (props: Props) => {
    const { scorePercentage, score, totalQuestions} = props;

    // Function to determine the congratulatory message based on score percentage
    const getCongratulatoryMessage = (percentage: number) => {
        if (percentage === 100) {
            return "Perfect Score! You're a genius!";
        } else if (percentage >= 80) {
            return "Great job! You really know your stuff!";
        } else if (percentage >= 50) {
            return "Good effort! Keep it up!";
        } else {
            return "Don't worry! Try again and you'll improve!";
        }
    };

    const congratulatoryMessage = getCongratulatoryMessage(scorePercentage);

    return (
        <div className="flex flex-col flex-1 bg-gradient-to-r from-teal-400 to-blue-500 min-h-screen">
            <main className="flex flex-col items-center justify-center flex-1 py-12">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Quiz Complete!</h2>
                    <p className="text-xl text-gray-600 mb-2">
                        You scored: <span className="font-semibold text-teal-600">{scorePercentage}%</span>
                    </p>
                    <p className="text-lg text-gray-500 mb-2">Total Questions: {totalQuestions}</p>
                    <p className="text-lg text-gray-500 mb-4">Correct Answers: {score}</p>
                    <p className="text-lg font-semibold text-teal-600 mb-4">{congratulatoryMessage}</p> {/* Congratulatory message */}
                    
                </div>
            </main>
        </div>
    );
};

export default QuizzSubmission;