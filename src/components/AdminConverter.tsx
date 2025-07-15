// src/components/AdminConverter.tsx

"use client";

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { BlockchainBetBrasilAddress, BlockchainBetBrasilABI } from '../constants/constants';

// Este componente recebe o ID da rodada atual como propriedade
interface AdminConverterProps {
  rodadaId: number;
}

const AdminConverter = ({ rodadaId }: AdminConverterProps) => {
  const [milhares, setMilhares] = useState<string[]>(['', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');

  // Hook para escrever no contrato
  const { data: hash, writeContract, isPending } = useWriteContract();

  // Hook para aguardar a confirmação da transação
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  const handleInputChange = (index: number, value: string) => {
    // Permite apenas números e limita o tamanho
    if (/^\d*$/.test(value) && value.length <= 4) {
      const novosMilhares = [...milhares];
      novosMilhares[index] = value;
      setMilhares(novosMilhares);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validação
    if (milhares.some(m => m.length === 0)) {
      setErrorMessage('Todos os 5 campos de milhar devem ser preenchidos.');
      return;
    }
    if (rodadaId === 0) {
      setErrorMessage('Não há uma rodada ativa para registrar resultados.');
      return;
    }

    const milharesComoNumeros = milhares.map(m => BigInt(m));

    // Chama a função do contrato
    writeContract({
      address: BlockchainBetBrasilAddress,
      abi: CONTRACT_ABI,
      functionName: 'registrarResultadosDaFederalEProcessar',
      args: [BigInt(rodadaId), milharesComoNumeros],
    });
  };

  return (
    <div className="w-full max-w-lg bg-slate-800/50 border border-slate-700 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-4">Registrar Resultados da Rodada #{rodadaId}</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {milhares.map((milhar, index) => (
            <div key={index}>
              <label htmlFor={`milhar-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                {index + 1}º Prêmio
              </label>
              <input
                id={`milhar-${index}`}
                type="text"
                value={milhar}
                onChange={(e) => handleInputChange(index, e.target.value)}
                placeholder="0000"
                className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-center text-white focus:ring-cyan-500 focus:border-cyan-500"
                maxLength={4}
                disabled={isPending || isConfirming || isConfirmed}
              />
            </div>
          ))}
        </div>
        
        <button 
          type="submit"
          disabled={isPending || isConfirming || isConfirmed}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition-all disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isPending && 'Aguardando assinatura...'}
          {isConfirming && 'Processando transação...'}
          {isConfirmed && 'Resultados Registrados!'}
          {!isPending && !isConfirming && !isConfirmed && 'Registrar e Processar Resultados'}
        </button>

        {errorMessage && <p className="text-red-400 text-center">{errorMessage}</p>}
        {isConfirmed && (
            <div className="text-green-400 text-center">
                <p>Sucesso! Os resultados foram registrados e os prêmios calculados.</p>
                <p>A página será atualizada com os detalhes em breve.</p>
            </div>
        )}
      </form>
    </div>
  );
};

export default AdminConverter;