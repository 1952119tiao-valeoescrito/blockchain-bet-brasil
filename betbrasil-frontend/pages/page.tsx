import { useState } from 'react';
import { ethers } from 'ethers';

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Por favor, instale o Metamask!");
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setConnected(true);
    setWalletAddress(accounts[0]);
  };

  const apostar = async () => {
    const contractAddress = "0x9D586CbA6c856B4979C1D2e5115ecdBAc85184E8";
    const abi = [ {
      "inputs": [
        {"internalType": "address", "name": "_vrfCoordinator", "type": "address"},
        {"internalType": "address", "name": "_linkToken", "type": "address"},
        {"internalType": "bytes32", "name": "_keyHash", "type": "bytes32"},
        {"internalType": "uint256", "name": "_fee", "type": "uint256"}
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "apostar",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "players",
      "outputs": [{"internalType": "address[]", "name": "", "type": "address[]"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "randomResult",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "sortear",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [{"indexed": false, "internalType": "address", "name": "jogador", "type": "address"}],
      "name": "NovaAposta",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [{"indexed": false, "internalType": "uint256", "name": "numeroSorteado", "type": "uint256"}],
      "name": "SorteioRealizado",
      "type": "event"
    }
   ];
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const tx = await contract.apostar({ value: ethers.utils.parseEther("0.01") });
      await tx.wait();
      alert("Aposta realizada com sucesso!");
    } catch (error) {
      alert("Erro ao apostar: " + error.message);
    }
  };

  return (
    <div>
  <h1>Blockchain Bet Brasil - O BBB da Web3 - Esse é Animal!</h1>
</div>
<div>
  <h3>Ganha com 5, 4, 3, 2 e até com 1 ponto apenas.</h3>
</div>

{!connected ? (
  <button onClick={connectWallet}>Conectar Wallet</button>
) : (
  <div>
    <p>Carteira conectada: {walletAddress}</p>
    <button onClick={apostar}>Apostar</button>
  </div>
)}
      )}
    </div>
  );
}
