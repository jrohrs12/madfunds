import { NextResponse } from "next/server";

console.clear();
require("dotenv").config();
const {
  AccountId,
  PrivateKey,
  Client,
  FileCreateTransaction,
  ContractCreateTransaction,
  Hbar,
} = require("@hashgraph/sdk");
const fs = require("fs");

// Configure accounts and client
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_KEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

export async function GET(req) {
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
  const contrractInstantiateSubmit = await contrractInstantiateTx.execute(client);
  const contrractInstantiateRx = await contrractInstantiateSubmit.getReceipt(client);
  const contractId = contrractInstantiateRx.contractId;

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
      contractId: contractId,
    },
    {
      status: 200,
    }
  );
}
