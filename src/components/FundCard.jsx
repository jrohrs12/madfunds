import React from "react";

export default function FundCard(props) {
  // Calculate the progress percentage
  const progress = (props.currentAmount / props.goal) * 100;

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
      <h1 className="text-2xl mb-4 font-bold text-blue-600">
        Fundraiser Details
      </h1>
      <p>
        <strong className="text-gray-600">Fundraiser Name:</strong> {props.name}
      </p>
      <p>
        <strong className="text-gray-600">Goal:</strong> ${props.goal}
      </p>
      <p>
        <strong className="text-gray-600">Current Amount Raised:</strong> $
        {props.currentAmount}
      </p>
      <div className="bg-gray-300 h-4 mt-4 rounded">
        <div
          className="bg-green-500 h-full rounded"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="mt-2">
        <strong className="text-gray-600">Progress:</strong>{" "}
        {progress.toFixed(2)}%
      </p>
    </div>
  );
}
