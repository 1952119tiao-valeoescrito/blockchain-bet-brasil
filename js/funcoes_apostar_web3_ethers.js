// services/blockchain.js
import { ethers } from 'ethers';
import BetBrasilABI from '../contracts/BetBrasil.json';

const contractAddress = "0x123..."; // Endereço do contrato

export async function fazerAposta(palpites) {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, BetBrasilABI, signer);
    
    try {
      const tx = await contract.apostar(palpites, { value: ethers.utils.parseEther("0.00033") });
      await tx.wait();
      return true;
    } catch (err) {
      console.error("Erro na aposta:", err);
      return false;
    }
  } else {
    alert("Instale a MetaMask!");
  }
}