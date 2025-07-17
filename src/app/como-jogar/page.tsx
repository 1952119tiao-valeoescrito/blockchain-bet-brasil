// src/app/como-jogar/page.tsx - VERSÃO CORRIGIDA E OTIMIZADA

// 1. Caminhos de importação usando aliases (@/) para consistência no projeto.
import TabelaConversao from '@/components/TabelaConversao';
import BlockchainBetBrasilTable from '@/components/BlockchainBetBrasilTable';
import ResultSimulator from '@/components/ResultSimulator';

const ComoJogarPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 text-gray-300">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        
        {/* Seção Principal */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white mb-2">Como Funciona o Jogo</h1>
          <p className="text-lg text-cyan-400">Transparência é nosso lema. Entenda cada passo do processo.</p>
        </div>

        {/* Card de Lógica */}
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 max-w-4xl mx-auto">
          <h2 id="logica-prognosticos" className="text-2xl font-bold text-white mb-4">
            A Lógica por Trás dos Prognósticos
          </h2>
          <p className="text-lg leading-relaxed">
            {/* 2. Aspas corrigidas para entidades HTML (") para resolver o aviso do linter. */}
            O sistema se baseia nos resultados de um sorteio público e auditável, a "Extração Oficial". Os últimos dois dígitos de cada um dos cinco prêmios principais (as "dezenas") são utilizados para gerar os prognósticos do nosso jogo.
          </p>
          <p className="mt-4 text-lg leading-relaxed">
            {/* 2. Aspas corrigidas aqui também. */}
            Usamos a regra clássica de um Centenário Jogo Popular para converter cada dezena em um grupo de 1 a 25. Por exemplo, a dezena 15 pertence ao grupo 4, então o caracter gerado é "4". A dezena 00 (cem) pertence ao grupo 25, então o caracter gerado é 25. Nesse caso, o prognóstico será (4/25). Consulte a tabela abaixo para ver a correspondência de todos os grupos.
          </p>
        </div>

        {/* Tabela de Conversão */}
        <TabelaConversao />

        {/* Tabela de Referência de Prognósticos */}
        <BlockchainBetBrasilTable />

        {/* Simulador de Resultados */}
        <ResultSimulator />

      </div>
    </div>
  );
};

export default ComoJogarPage;