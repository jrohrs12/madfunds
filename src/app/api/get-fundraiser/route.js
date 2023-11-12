import { NextResponse } from "next/server";

console.clear();
require("dotenv").config();
const {
  AccountId,
  PrivateKey,
  Client,
  ContractFunctionParameters,
  ContractCallQuery,
  Hbar,
} = require("@hashgraph/sdk");
const fs = require("fs");

// Configure accounts and client
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_KEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

export async function GET(req) {
  // Get the given data from search params
  const id = req.query.id;
  const contractId = req.query.contractId;

  if (!id || !contractId) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  // Query the smart contract
  const contractQueryTx = new ContractCallQuery()
    .setContractId(contractId)
    .setGas(100000).setFunction("getFundraiser", new ContractFunctionParameters().addUint256(id))
    .setMaxQueryPayment(new Hbar.fromTinybars(1));
  const contractQuerySubmit = await contractQueryTx.execute(client);
  const contractQueryResult = contractQuerySubmit.getStruct("Fundraiser");

  return NextResponse.json(
    {
      message: "Success",
      fundraiser: contractQueryResult,
    },
    {
      status: 200,
    }
  );
}
