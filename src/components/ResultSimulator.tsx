// /src/components/ResultSimulator.tsx - VERSÃO FINAL COM AÇÃO DIRETA

'use client';

import { useState, useEffect } from 'react';
import { useConfig, useReadContract } from 'wagmi';
import { readContract } from 'wagmi/actions';
import { bettingContractAddress, bettingContractABI } from '@/contracts';
import { BaseError } from 'viem';
import toast from 'react-hot-toast';

interface IResult {
  prizeNum: number;
  milhar: string;
  prognostico: string;
}

export default function ResultSimulator() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const [lotteryNumbers, setLotteryNumbers] = useState<(string | number)[]>(Array(5).fill(''));
  const [results, setResults] = useState<IResult[] | null>(null);
  const [rodadaId, setRodadaId] = useState<string>('');
  
  // ===================================================================
  // ==================  MUDANÇA DE ESTRATÉGIA  ========================
  // ===================================================================
  const config = useConfig(); // Pegamos a configuração do wagmi para usar nas ações.
  const [isSimulating, setIsSimulating] = useState(false); // Nosso próprio estado de loading.
  // ===================================================================
  // ===================================================================

  const { data: rodadaAtualId } = useReadContract({
      address: bettingContractAddress,
      abi: bettingContractABI,
      functionName: 'rodadaAtualId',
  });
  
  useEffect(() => {
    if (rodadaAtualId !== undefined) {
      setRodadaId(rodadaAtualId.toString());
    }
  }, [rodadaAtualId]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (/^\d*$/.test(e.target.value)) {
        const newNumbers = [...lotteryNumbers];
        newNumbers[index] = e.target.value;
        setLotteryNumbers(newNumbers);
    }
  };

  // ===================================================================
  // ==================  NOVA FUNÇÃO HANDLE SIMULATE  ==================
  // ===================================================================
  const handleSimulate = async () => {
    setResults(null);
    if (!rodadaId || isNaN(parseInt(rodadaId)) || parseInt(rodadaId) <= 0) {
        toast.error('Por favor, insira um ID de Rodada válido para o contexto da simulação.');
        return;
    }

    const milharesParaSimular: bigint[] = [];
    lotteryNumbers.forEach(num => {
        if (num.toString().length >= 4) {
            milharesParaSimular.push(BigInt(num.toString().slice(-4)));
        }
    });

    if (milharesParaSimular.length === 0) {
        toast.error('Preencha ao menos um campo com um número de 4 ou 5 dígitos.');
        return;
    }
    
    while (milharesParaSimular.length < 5) {
        milharesParaSimular.push(BigInt(0));
    }

    setIsSimulating(true);
    try {
        const simulationData = await readContract(config, {
            address: bettingContractAddress,
            abi: bettingContractABI,
            functionName: 'simularConversaoMilhares',
            args: [BigInt(rodadaId), milharesParaSimular as [bigint, bigint, bigint, bigint, bigint]],
        });

        const resultadosX = [...simulationData[0]];
        const resultadosY = [...simulationData[1]];
        
        const allResults: IResult[] = [];
        const filledNumbers = lotteryNumbers.filter(num => num.toString().length >= 4);

        for (let i = 0; i < filledNumbers.length; i++) {
            const numStr = filledNumbers[i].toString();
            allResults.push({
                prizeNum: i + 1,
                milhar: numStr.slice(-4),
                prognostico: `${resultadosX[i]}/${resultadosY[i]}`,
            });
        }
        setResults(allResults);

    } catch (err) {
        toast.error((err as BaseError)?.shortMessage || (err as Error).message);
    } finally {
        setIsSimulating(false);
    }
  };
  // ===================================================================
  // ===================================================================

  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 w-full max-w-4xl">
      <h2 className="text-2xl font-semibold text-center text-white mb-2">Simulador de Resultados</h2>
      <p className="text-center text-gray-300 mb-6">
        Insira os milhares sorteados e veja a conversão que será feita na blockchain.
      </p>
      
      <div className="mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-6 items-end">
            <div className='md:col-span-1'>
                <label htmlFor="rodada-id" className="block text-sm font-medium text-gray-300 mb-1">
                    ID da Rodada
                </label>
                <input 
                    type="text" 
                    id="rodada-id"
                    placeholder="Ex: 1"
                    value={rodadaId}
                    onChange={(e) => /^\d*$/.test(e.target.value) && setRodadaId(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white text-center"
                />
            </div>
          {[...Array(5)].map((_, index) => (
            <div key={index} className='md:col-span-1'>
              <label htmlFor={`lottery-sim-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                {index + 1}º Prêmio
              </label>
              <input 
                type="text" 
                id={`lottery-sim-${index}`}
                placeholder="Ex: 95467"
                value={lotteryNumbers[index]}
                onChange={(e) => handleInputChange(e, index)}
                className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white text-center"
                maxLength={5}
              />
            </div>
          ))}
        </div>
        
        <button 
          onClick={handleSimulate} 
          disabled={!isClient || isSimulating}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-md transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          {isSimulating ? 'Simulando na Blockchain...' : 'Simular'}
        </button>
      </div>

      {results && results.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-center text-white mb-4">Resultados da Simulação</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((res) => (
              <div key={res.prizeNum} className="p-4 bg-slate-900 rounded-lg text-base border border-slate-700">
                <h4 className="font-bold text-lg text-cyan-400 mb-2">{res.prizeNum}º Prêmio:</h4>
                <div className="space-y-1">
                  <div className="flex justify-between"><span>Milhar Utilizado:</span> <b className="text-yellow-400">{res.milhar}</b></div>
                  <hr className="border-slate-700"/>
                  <div className="text-xl mt-2 text-center">Prognóstico Final: <b className="text-cyan-400">{res.prognostico}</b></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}