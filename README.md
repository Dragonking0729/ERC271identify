Node.js script(16+) that will start streaming addresses of ERC721 smart contracts that were created in the block, starting from the N-th block on Ethereum blockchain. Each block should print an array of ERC721 smart contract addresses in the console.

For example:

The input is Block number. The output is streaming arrays of ERC-721 smart contracts. 

Block number 13821429 will return [“0xD16bdCCAe06DFD701a59103446A17e22e9ca0eF0”]

you can override {Alchemy_api_key} with your alchemy key after creating .env file
API_KEY = {Alchemy_api_key}
RPC_NODE = 'https://rpc.ankr.com/eth'
