const prompt = require('prompt-sync')({sigint: true});
const axios = require('axios');
const ethers = require('ethers');
const Web3 = require('web3');
const { ERC721Validator } = require('@nibbstack/erc721-validator');
const dotenv = require('dotenv');
dotenv.config();

// input data prefix of created contract is 0x60806040
const inputDataPrefix = '0x60806040';

const alchemyProvider = new ethers.providers.AlchemyProvider(null, process.env.API_KEY);;

let blockNumber = "";
let createdContracts = [];

// convert decimal string to Hex String
const toHex = function(number) {
  return "0x" + Number(number).toString(16);
}

const detectERC721 = async function(transactions) {

  // loop index of txs array
  let index = 0;

  // mainnet RPC URL
  const web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_NODE));
  const validator = new ERC721Validator(web3);

  do {
    let trans = transactions[index];

    // check if contract address exists, then it is created contract
    if (trans.contractAddress !== null) {
      const tx = await alchemyProvider.getTransaction(trans.transactionHash);

      // double check with input data prefix
      if (tx.data.startsWith(inputDataPrefix)) {
      
        // ERC-721 contract test case is 3 and determine created contract if 
        // the result returns true
        const type = await validator.basic(3, trans.contractAddress);

        if (type.result) {
          // collect output results
          createdContracts.push(trans.contractAddress);
        }

      }
    }

    index++;
  } while ( index < transactions.length );

  console.log(`ERC-721 smart contracts created in block: ${toHex(blockNumber)}`);
  console.log(createdContracts);
};

const app = function() {

  // Get block number input
  blockNumber = prompt('Input Block number: ');

  // alchemy getTransactionReceipts post data
  const data = {
    "jsonrpc": "2.0",
    "method": "alchemy_getTransactionReceipts",
    "params":[
      {
        "blockNumber": toHex(blockNumber)
      }
    ],
    "id": 1
  };
  
  var requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(data)
  };

  const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.API_KEY}`;
  const axiosURL = `${baseURL}`;

  // send axios request
  axios(axiosURL, requestOptions)
    .then(response => {detectERC721(response.data.result.receipts);})
    .catch(error => console.log("Alchemy getTransactionReceipts Error"));
};

app();

