const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
});

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

const Fundraiser = {
  name: String,
  goal: Number,
  current: Number,
};

let contractIds = {};

app.post("/make-fundraiser", async (req, res) => {
  // Get given values
  const { id, name, goal } = req;

  if (!id || !name || !goal) {
    res.status(400).send("Bad inputs idiot");
  }

  // Import the compiled contract bytecode
  const contractBytecode = fs.readFileSync(
    "../../src_contracts_FundraiserContract_sol_FundraiserContract.bin"
  );

  // Create a file on Hedera and store the bytecode
  const fileCreateTx = new FileCreateTransaction()
    .setContents(contractBytecode)
    .setKeys([operatorKey])
    .setMaxTransactionFee(new Hbar(0.75))
    .freezeWith(client);
  const fileCreateSign = await fileCreateTx.sign(operatorKey);
  const fileCreateSubmit = await fileCreateSign.execute(client);
  const fileCreateRx = await fileCreateSubmit.getReceipt(client);
  const bytecodeFileId = fileCreateRx.fileId;

  // Instantiate the smart contract
  const contrractInstantiateTx = new ContractCreateTransaction()
    .setBytecodeFileId(bytecodeFileId)
    .setGas(100000)
    .setConstructorParameters(
      new ContractFunctionParameters()
        .addUint256(id)
        .addString(name)
        .addUint256(goal)
    );
  const contrractInstantiateSubmit = await contrractInstantiateTx.execute(
    client
  );
  const contrractInstantiateRx = await contrractInstantiateSubmit.getReceipt(
    client
  );
  const contractId = contrractInstantiateRx.contractId;
  contractIds = { ...contractIds, id: contractId };
  const contractAddress = contractId.toSolidityAddress();
  console.log(`- The smart contract ID is: ${contractId} \n`);
  console.log(
    `- The smart contract ID in Solidity format is: ${contractAddress} \n`
  );

  if (contrractInstantiateRx.status === FAIL) {
    res.status(400).send("Contract creation failed");
  }

  res.status(200).send("Contract created successful");
});

app.get("get-fundraiser/:id", async (req, res) => {
  // Get the given data
  const id = req.query.id;

  console.log("id fail");

  if (!id) {
    res.status(400).send("Bad id idiot");
  }

  // Quert the smart contract
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

  res.status(200).send(contractQueryResult);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
