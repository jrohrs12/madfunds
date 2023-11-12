"use client";

import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";

export default function Fundraiser() {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState();
  const [errMessage, setErrMessage] = useState("");
  const router = useRouter();
  const [fundraiserData, setFundraiserData] = useState([]);
  const handleSubmit = () => {
    router.push("/FundraiserView");
  };

  return (
    <div className=" flex flex-col items-center justify-center mt-36">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className=" text-2xl mb-4">Start a Fundraiser</h1>
        {
          <Form className=" flex flex-col">
            <Form.Label htmlFor="name" className="mb-2">
              Fundraiser Name
            </Form.Label>
            <Form.Control
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-4 p-2 border border-gray-300 rounded"
            />
            <Form.Label htmlFor="goal" className="mb-2">
              Goal
            </Form.Label>
            <Form.Control
              id="goal"
              className="mb-4 p-2 border border-gray-300 rounded"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              type="number"
              min="0"
              placeholder="$$$"
            />

            <Button
              onClick={handleSubmit}
              className="p-2 bg-blue-500 text-white hover:bg-blue-600 rounded"
            >
              Create Fundraiser
            </Button>
          </Form>
        }
      </div>
    </div>
  );
}
