import React from "react";

export default function FundView() {
  const res = fetch("/api/get-fundraiser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // name: name,
      // goal: goal,
      // contractId: contractId,
    }),
  });
  if (res.status === 200) {
    alert("Fundraiser created success");
    router.push(`/FundraiserView`);
  } else {
    alert("Fundraiser creation failed");
  }
  return <h1>Fundraiser View</h1>;
}
