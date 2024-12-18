import React from 'react';

type Props = {
    isCorrect: boolean | null;
    correctAnswer: string;
};

const ResultCard = (props: Props) => {
    const { isCorrect, correctAnswer } = props;

    if (isCorrect === null) {
        return null;
    }

    const text = isCorrect 
        ? 'Correct!' 
        : 'Incorrect! The correct answer is: ' + correctAnswer;

    const borderClasses = isCorrect ? "border-green-500 bg-green-100" : "border-red-500 bg-red-100";
    
    return (
        <div className={`border-l-4 p-4 rounded-lg shadow-md ${borderClasses}`}>
            <p className={`text-lg font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {text}
            </p>
        </div>
    );
};

export default ResultCard;