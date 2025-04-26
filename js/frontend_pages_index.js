import { useState } from 'react';
import { ethers } from 'ethers';

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setConnected(true);
    } else {
      alert("Instale a MetaMask!");
    }
  };

  const apostar = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contrato = new ethers.Contract(
      "0xSEU_CONTRATO_AQUI",  // Endereço do contrato deployado
      ["function apostar() external payable"],
      signer
    );
    await contrato.apostar({ value: ethers.utils.parseEther("0.01") });
    alert("Aposta feita! Boa sorte!");
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Bet Brasil 🎰 (Modo Blockchain Chique)</h1>
      {!connected ? (
        <button onClick={connectWallet}>Conectar MetaMask</button>
      ) : (
        <div>
          <p>Conectado: {account.slice(0, 6)}...{account.slice(-4)}</p>
          <button onClick={apostar}>Apostar 0.01 ETH</button>
        </div>
      )}
    </div>
  );
}









