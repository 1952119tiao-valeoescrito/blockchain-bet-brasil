// src/components/ResultSimulator.tsx - VERSÃO REFINADA

'use client';

import { useState } from 'react';

// A interface para guardar os resultados está perfeita.
interface IResult {
  prizeNum: number;
  milhar: string;
  dezena1: number;
  dezena2: number;
  grupo1: number;
  grupo2: number;
  prognostico: string;
}

export default function ResultSimulator() {
  const [lotteryNumbers, setLotteryNumbers] = useState({
    prize1: '', prize2: '', prize3: '', prize4: '', prize5: '',
  });
  
  const [results, setResults] = useState<IResult[] | null>(null);
  // 1. MELHORIA DE UX: Adicionado um estado para feedback, em vez de usar alert().
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, prizeNum: number) => {
    // Permite apenas números no input.
    if (/^\d*$/.test(e.target.value)) {
        setLotteryNumbers({
          ...lotteryNumbers,
          [`prize${prizeNum}`]: e.target.value,
        });
    }
  };

  const handleSimulate = () => {
    setResults(null); // Limpa resultados anteriores a cada simulação.
    setErrorMessage(null); // Limpa mensagens de erro antigas.

    const allResults: IResult[] = [];
    
    // A lógica de cálculo está perfeita e bem implementada.
    for (let i = 1; i <= 5; i++) {
      const numStr = lotteryNumbers[`prize${i}` as keyof typeof lotteryNumbers];
      
      if (numStr && numStr.length >= 4) {
        const milharStr = numStr.slice(-4);
        
        let d1 = parseInt(milharStr.slice(0, 2), 10);
        let d2 = parseInt(milharStr.slice(2, 4), 10);
        
        if (d1 === 0) d1 = 100;
        if (d2 === 0) d2 = 100;

        const g1 = Math.floor((d1 - 1) / 4) + 1;
        const g2 = Math.floor((d2 - 1) / 4) + 1;
        
        allResults.push({
          prizeNum: i,
          milhar: milharStr,
          dezena1: d1,
          dezena2: d2,
          grupo1: g1,
          grupo2: g2,
          prognostico: `${g1}/${g2}`
        });
      }
    }
    
    if (allResults.length === 0) {
      // 2. MELHORIA DE UX: Usa o estado de feedback em vez do alert().
      setErrorMessage('Por favor, preencha ao menos um campo com um número de 4 ou 5 dígitos.');
      return;
    }

    setResults(allResults);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
      <h2 className="text-2xl font-semibold text-center text-white mb-2">Simulador de Resultados</h2>
      <p className="text-center text-gray-300 mb-6">
        Tire a prova você mesmo! Insira os milhares sorteados, do 1º ao 5º prêmio, e veja a conversão.
      </p>
      
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
          {[1, 2, 3, 4, 5].map((prizeNum) => (
            <div key={prizeNum}>
              <label htmlFor={`lottery-sim-${prizeNum}`} className="block text-sm font-medium text-gray-300 mb-1">
                {prizeNum}º Prêmio
              </label>
              <input 
                type="text" 
                id={`lottery-sim-${prizeNum}`}
                placeholder="Ex: 95467"
                value={lotteryNumbers[`prize${prizeNum}` as keyof typeof lotteryNumbers]}
                onChange={(e) => handleInputChange(e, prizeNum)}
                className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white text-center"
                maxLength={5}
              />
            </div>
          ))}
        </div>
        
        {/* 3. MELHORIA DE UX: Exibindo a mensagem de erro de forma elegante. */}
        {errorMessage && (
            <div className="mb-4 p-3 rounded-md text-center font-semibold bg-red-500/20 text-red-300">
                {errorMessage}
            </div>
        )}

        <button onClick={handleSimulate} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-md transition-colors">
          Simular
        </button>
      </div>

      {/* A área de resultados está excelente. */}
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
                  <div className="flex justify-between"><span>Dezena 1:</span> <b className="text-green-400">{res.dezena1}</b></div>
                  <div className="flex justify-between"><span>Dezena 2:</span> <b className="text-blue-400">{res.dezena2}</b></div>
                  <hr className="border-slate-700"/>
                  <div className="flex justify-between"><span>Grupo 1:</span> <b className="text-green-400">{res.grupo1}</b></div>
                  <div className="flex justify-between"><span>Grupo 2:</span> <b className="text-blue-400">{res.grupo2}</b></div>
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