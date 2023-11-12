import { NextResponse } from "next/server";

console.clear();
require("dotenv").config();
const {
  AccountId,
  PrivateKey,
  Client,
  FileCreateTransaction,
  ContractCreateTransaction,
  ContractFunctionParameters,
  ContractExecuteTransaction,
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
  const id = parseInt(req.query.id);

  console.log("id fail");

  if (!id) {
    return NextResponse.json(
        {
          message: "Bad input stoopid",
        },
        {
          status: 400,
        }
      );
  }

  // Query the smart contract
  const contractQueryTx = new ContractCallQuery()
    .setContractId(contractIds[id])
    .setGas(100000)
    .setFunction(
      "getFundraiser",
      new ContractFunctionParameters().addUint256(id)
    )
    .setMaxQueryPayment(new Hbar.fromTinybars(1));
  const contractQuerySubmit = await contractQueryTx.execute(client);
  const contractQueryResult = contractQuerySubmit.getStruct("Fundraiser");

  return NextResponse.json(
    {
      message: "Success",
    },
    {
      status: 200,
    }
  );
}
