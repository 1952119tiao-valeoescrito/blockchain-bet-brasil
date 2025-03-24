const Web3 = require('web3');
const web3 = new Web3('https://mainnet.infura.io/v3/fae945e93b314e3b91d70b1b3982ef1d');
const contractAbi = [/* Cole o ABI do contrato aqui */];
const contractAddress = '0xc6da372D3A0aEd587373dc65b03c3F7056614f49';
const contract = new web3.eth.Contract(contractAbi, contractAddress);

module.exports = { web3, contract };