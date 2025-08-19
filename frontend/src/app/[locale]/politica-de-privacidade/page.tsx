// app/politica-de-privacidade/page.tsx

import React from 'react';

const PoliticaDePrivacidadePage = () => {
  return (
    // Aplicamos a mesma estrutura: um container padrão com padding vertical.
    <main className="container mx-auto py-16 px-4">
      
      <div className="bg-gray-800/60 p-8 rounded-lg shadow-2xl border border-gray-700">
        
        <h1 className="text-4xl font-bold text-white text-center mb-6">
          Política de Privacidade
        </h1>

        <div className="space-y-6 text-gray-300">
          <p className="text-sm text-gray-400">
            Data da Última Atualização: 07 de Julho de 2025
          </p>
          <p>
            A sua privacidade é importante para nós. É política do Blockchain Bet Brasil respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site Blockchain Bet Brasil, e outros sites que possuímos e operamos.
          </p>
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">1. Coleta de Informações</h2>
            <p>
              Coletamos informações apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">2. Uso de Dados</h2>
            <p>
              Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PoliticaDePrivacidadePage;