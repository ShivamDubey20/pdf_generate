import React from "react";

type ProgressBarProps = {
  value: number; // Percentage value for progress bar
};

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  return (
    <div className="w-full bg-secondary rounded-full h-2.5">
      <div
        className="bg-primary h-2.5 rounded-md transition-all duration-300"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;