import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import BetBrasilABI from '../artifacts/contracts/BetBrasil.sol/BetBrasil.json';

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [lastWinner, setLastWinner] = useState('');

  const CONTRACT_ADDRESS = "0xSEU_CONTRATO_DEPLOYADO"; // Coloque o endereço aqui!

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) setAccount(accounts[0]);
        else setConnected(false);
      });
    }
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setConnected(true);
      initContract();
    } else {
      alert("Baixa a MetaMask, meu consagrado!");
    }
  };

  const initContract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const betContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      BetBrasilABI.abi,
      signer
    );
    setContract(betContract);
  };

  const makeBet = async () => {
    if (!contract) return;
    try {
      await contract.bet({ value: ethers.utils.parseEther("0.01") });
      alert("Aposta feita! Boa sorte!");
    } catch (error) {
      console.error(error);
      alert("Deu ruim! Confira o console.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-4xl font-bold mb-6">🎰 BET BRASIL (BLOCKCHAIN EDITION)</h1>
      
      {!connected ? (
        <button 
          onClick={connectWallet}
          className="bg-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-700"
        >
          Conectar MetaMask
        </button>
      ) : (
        <div>
          <p className="mb-4">💰 Carteira: {account.slice(0, 6)}...{account.slice(-4)}</p>
          <button 
            onClick={makeBet}
            className="bg-green-600 px-6 py-3 rounded-lg font-bold hover:bg-green-700"
          >
            Apostar 0.01 ETH
          </button>
          {lastWinner && (
            <p className="mt-4">Último vencedor: {lastWinner}</p>
          )}
        </div>
      )}
    </div>
  );
}
