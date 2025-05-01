import { ethers } from 'ethers';
import { useState } from 'react';

export default function Sorteio() {
  const [randomResult, setRandomResult] = useState(null);

  const realizarSorteio = async () => {
    const contractAddress = "0x9D586CbA6c856B4979C1D2e5115ecdBAc85184E8";
    const abi = [  {
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
      const tx = await contract.sortear();
      await tx.wait();
      const result = await contract.randomResult();
      setRandomResult(result);
      alert(`Número sorteado: ${result}`);
    } catch (error) {
      alert("Erro ao realizar sorteio: " + error.message);
    }
  };

  return (
    <div>
      <h1>Realizar Sorteio</h1>
      <button onClick={realizarSorteio}>Sortear</button>
      {randomResult !== null && <p>Número sorteado: {randomResult}</p>}
    </div>
  );
}
export default function handler(req, res) {
  if (req.method === 'POST') {
    const resultado = /* sua lógica */;
    res.status(200).json({ message: 'Sorteio iniciado!', data: resultado });
  } else if (req.method === 'GET') {
    const status = /* sua lógica */;
    res.status(200).json({ status: status });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}