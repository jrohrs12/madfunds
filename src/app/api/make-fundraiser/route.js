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

export async function POST(req) {
  // Get given values
  const { name, goal } = await req.json();
  if (!name || goal === undefined || goal < 0) {
    return NextResponse.json(
      {
        message: "Bad input stoopid",
      },
      {
        status: 400,
      }
    );
  }

  // Import the compiled contract bytecode
  const contractBytecode = fs.readFileSync(
    "src_contracts_FundraiserContract_sol_FundraiserContract.bin"
  );
  //src_contracts_FundraiserContract_sol_FundraiserContract.bin
  // Create a file on Hedera and store the bytecode
  const fileCreateTx = new FileCreateTransaction()
    .setContents(contractBytecode)
    .setKeys([operatorKey])
    .setMaxTransactionFee(new Hbar(2))
    .freezeWith(client);
  const fileCreateSign = await fileCreateTx.sign(operatorKey);
  const fileCreateSubmit = await fileCreateSign.execute(client);
  const fileCreateRx = await fileCreateSubmit.getReceipt(client);
  const bytecodeFileId = fileCreateRx.fileId;

  // Instantiate the smart contract
  const contrractInstantiateTx = new ContractCreateTransaction()
    .setBytecodeFileId(bytecodeFileId)
    .setGas(200000)
    .setConstructorParameters(
      new ContractFunctionParameters().addString(name).addUint256(goal)
    );
  const contrractInstantiateSubmit = await contrractInstantiateTx.execute(
    client
  );
  const contrractInstantiateRx = await contrractInstantiateSubmit.getReceipt(
    client
  );
  const contractId = contrractInstantiateRx.contractId;
  const contractAddress = contractId.toSolidityAddress();
  console.log(`- The smart contract ID is: ${contractId} \n`);
  console.log(
    `- The smart contract ID in Solidity format is: ${contractAddress} \n`
  );

  if (contrractInstantiateRx.status === "FAIL") {
    return NextResponse.json(
      {
        message: "Failed",
      },
      {
        status: 400,
      }
    );
  }

  return NextResponse.json(
    {
      message: "Success",
    },
    {
      status: 200,
    }
  );
}
