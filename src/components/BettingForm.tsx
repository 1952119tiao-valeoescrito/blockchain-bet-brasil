"use client";

import { useState, useEffect } from 'react'; 
import { useWriteContract, useAccount } from 'wagmi';
import { parseEther } from 'viem';

// <<< PASSO 1: CONFIRME O NOME DO SEU ARQUIVO ABI AQUI
import contractAbi from '@/abi/BlockChainBetBrasil.json'; 

// <<< PASSO 2: CONFIRME O ENDEREÇO CORRETO DO SEU CONTRATO
const contractAddress = '0x9D586CbA6c856B4979C1D2e5115ecdBAc85184E8';

export default function BettingForm() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);

  const { isConnected } = useAccount();
  const { data: hash, isPending, writeContract, error } = useWriteContract();

  const [prognostics, setPrognostics] = useState<string[]>(['', '', '', '', '']);
  const [betAmount, setBetAmount] = useState('');

  const handlePrognosticChange = (index: number, value: string) => {
    if (value.length > 5) return;
    const newPrognostics = [...prognostics];
    newPrognostics[index] = value.trim();
    setPrognostics(newPrognostics);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!betAmount || parseFloat(betAmount) <= 0) {
      alert("Por favor, insira um valor de aposta válido.");
      return;
    }

    const prognosticsX: number[] = [];
    const prognosticsY: number[] = [];

    for (const prog of prognostics) {
      if (!prog.includes('/') || prog.split('/').length !== 2) {
        alert(`Prognóstico inválido: "${prog}". Use o formato X/Y.`);
        return;
      }
      const parts = prog.split('/');
      const x = parseInt(parts[0], 10);
      const y = parseInt(parts[1], 10);

      if (isNaN(x) || isNaN(y) || x < 1 || x > 25 || y < 1 || y > 25) {
        alert(`Valores inválidos no prognóstico "${prog}". Use números de 1 a 25.`);
        return;
      }
      
      prognosticsX.push(x);
      prognosticsY.push(y);
    }
    
    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'apostar', // O nome original da função no seu contrato
      args: [prognosticsX, prognosticsY], // Os dois arrays de números que o contrato espera
      value: parseEther(betAmount),
    });
  };

  const labels = ["1º Prêmio", "2º Prêmio", "3º Prêmio", "4º Prêmio", "5º Prêmio"];

  if (!isClient || !isConnected) {
    return null;
  }

  // O JSX do formulário, sem alterações
  return (
    <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Faça sua Aposta</h2>
      <form onSubmit={handleSubmit}>
        {/* ... (o resto do seu JSX do formulário) ... */}
         {/* Seção de Prognósticos */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end space-y-4 md:space-y-0 md:space-x-4">
          {labels.map((label, index) => (
            <div key={index} className="flex-1 w-full">
              <label htmlFor={`prognostic-${index}`} className="block text-sm font-medium text-gray-300 mb-2 text-center">{label}</label>
              <input id={`prognostic-${index}`} type="text" value={prognostics[index]} onChange={(e) => handlePrognosticChange(index, e.target.value)} placeholder="ex: 10/25" maxLength={5} required className="w-full bg-gray-800 border border-gray-600 text-white text-center rounded-md p-2 focus:ring-2 focus:ring-blue-500" />
            </div>
          ))}
        </div>
        {/* Seção de Valor da Aposta */}
        <div className="mt-6">
          <label htmlFor="bet-amount" className="block text-sm font-medium text-gray-300 mb-2">Valor da Aposta (em ETH/MATIC)</label>
          <input id="bet-amount" type="number" step="0.001" min="0" value={betAmount} onChange={(e) => setBetAmount(e.target.value)} placeholder="Ex: 0.01" required className="w-full bg-gray-800 border border-gray-600 text-white rounded-md p-2 focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="mt-8 flex justify-end">
          <button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-lg transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed">
            {isPending ? 'Confirmando na Carteira...' : 'Submeter Aposta'}
          </button>
        </div>
      </form>
      {/* Seção de Feedback da Transação */}
      {hash && ( <div className="mt-4 p-3 bg-green-900 border border-green-700 rounded-md text-center break-words"><p className="text-green-300 font-bold">Transação Enviada!</p><a href={`https://sepolia.etherscan.io/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Ver na Etherscan: {hash}</a></div> )}
      {error && ( <div className="mt-4 p-3 bg-red-900 border border-red-700 rounded-md text-white break-words"><p className="font-bold">Ocorreu um erro:</p><pre className="text-sm whitespace-pre-wrap">{error.shortMessage || error.message}</pre></div> )}
    </div>
  );
}