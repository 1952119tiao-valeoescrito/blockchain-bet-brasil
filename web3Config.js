const Web3 = require('web3');
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');
const contractAbi = [/* Cole o ABI do contrato aqui */];
const contractAddress = '0xc6da372D3A0aEd587373dc65b03c3F7056614f49';
const contract = new web3.eth.Contract(contractAbi, contractAddress);

module.exports = { web3, contract };
