// src/components/BettingForm.tsx

'use client'; 

import React, { useState } from 'react';
// import { useAccount, useContractWrite } from 'wagmi'; 

const BettingForm = () => {
  // const { isConnected } = useAccount();

  const handleBetSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Aposta enviada:');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-gray-800/50 rounded-lg shadow-lg border border-gray-700">
      <div className="text-center mb-6">
        <div className="bg-yellow-500 text-black p-3 rounded-md mb-6 max-w-lg mx-auto">
          <p><strong>ATENÇÃO:</strong> ESTE SITE ESTÁ EM FASE DE TESTES</p>
          <p>Utilizando a rede de teste Sepolia. NÃO UTILIZE FUNDOS REAIS.</p>
        </div>
        <h2 className="text-3xl font-bold text-white">Faça sua Aposta na Rodada #...</h2>
      </div>

      <form onSubmit={handleBetSubmit}>
        {/* 
          AQUI ESTÁ A CORREÇÃO:
          1. Trocamos 'md:grid-cols-4' para 'md:grid-cols-5' para criar 5 colunas.
          2. Adicionamos o QUINTO input.
        */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
          <input type="text" placeholder="X/Y" className="bg-gray-700 text-white p-3 rounded-md text-center" />
          <input type="text" placeholder="X/Y" className="bg-gray-700 text-white p-3 rounded-md text-center" />
          <input type="text" placeholder="X/Y" className="bg-gray-700 text-white p-3 rounded-md text-center" />
          <input type="text" placeholder="X/Y" className="bg-gray-700 text-white p-3 rounded-md text-center" />
          <input type="text" placeholder="X/Y" className="bg-gray-700 text-white p-3 rounded-md text-center" /> {/* <-- 5º INPUT ADICIONADO */}
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors"
        >
          Carregando Preço...
        </button>
      </form>
      
      <div className="text-center mt-4 text-blue-400">
        <a href="/como-jogar#prognosticos-validos" className="hover:underline">Ver prognósticos válidos.</a><br />
        <a href="/simulador" className="hover:underline">Testar conversão no Simulador de Resultados.</a>
      </div>
    </div>
  );
};

export default BettingForm;