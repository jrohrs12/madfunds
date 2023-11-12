import { NextResponse } from "next/server";

console.clear();
require("dotenv").config();
const {
  AccountId,
  PrivateKey,
  Client,
  ContractFunctionParameters,
  ContractExecuteTransaction,
  ContractId,
  Hbar,
} = require("@hashgraph/sdk");
const fs = require("fs");

// Configure accounts and client
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_KEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

export async function POST(req) {
  // Get given values
  const { name, goal, contractId } = await req.json();
  if (!name || goal === undefined || goal < 0 || !contractId) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }
  console.log(contractId);
  const contractIdObj = new ContractId(
    contractId.shard.low,
    contractId.realm.low,
    contractId.num.low
  );
  // Call contract function to add fundraiser
  const contractExecuteTx = new ContractExecuteTransaction()
    .setContractId(contractIdObj)
    .setGas(100000)
    .setFunction(
      "addFundraiser",
      new ContractFunctionParameters().addString(name).addUint256(goal)
    )
    .setMaxTransactionFee(new Hbar(1));
  const contractExecuteSubmit = await contractExecuteTx.execute(client);
  const contractExecuteRx = await contractExecuteSubmit.getReceipt(client);

  if (contractExecuteRx.status === "FAIL") {
    return NextResponse.json({ message: "Failed" }, { status: 400 });
  }

  return NextResponse.json({ message: "Success" }, { status: 200 });
}
