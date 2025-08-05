// app/como-jogar/page.tsx (VERSÃO COMPLETA)

'use client';

import GroupReferenceTable from '@/components/GroupReferenceTable';
import ResultSimulator from '@/components/ResultSimulator';
import Link from 'next/link';

export default function ComoJogarPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-12 text-gray-300">
      
      {/* Seção Explicativa */}
      <div className="w-full max-w-4xl mx-auto bg-slate-800/50 border border-slate-700 rounded-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold text-cyan-400 text-center mb-6">
          Como Jogar na Blockchain  Bet Brasil
        </h1>
        
        <div className="space-y-4 text-lg">
          <p>
            Nosso sistema é inspirado na mecânica clássica do Centenário Jogo Popular, mas com a transparência e segurança da tecnologia blockchain. O resultado é 100% baseado nos sorteios da <span className="font-semibold text-yellow-400">Loteria Oficial do Brasil</span>, com ocorrência aos sábados.
          </p>
          
          <h2 className="text-2xl font-semibold text-white pt-4">A  Aposta</h2>
          <p>
            Sua aposta consiste em 5 prognósticos, cada um dos quais corresponde a 16 diferentes milhares,  válidos do 1º ao 5º prêmio da Loteria Oficial do Brasil, portanto você estará concorrendo com 80 milhares em cada jogo. Cada prognóstico é um par de números no formato <span className="font-mono bg-slate-700 px-2 py-1 rounded">X / Y</span>, onde tanto X quanto Y são números de 1 a 25, representando os grupos dos animais.
          </p>
          
          <h2 className="text-2xl font-semibold text-white pt-4">A Apuração</h2>
          <ol className="list-decimal list-inside space-y-2 pl-4">
            <li>Após o sorteio da Loteria Oficial do Brasil, o administrador registra os 5 números (milhares) sorteados.</li>
            <li>Nosso smart contract converte as <span className="font-semibold text-yellow-400">duas últimas dezenas</span> de cada milhar no grupo correspondente (de 1 a 25), usando a tabela de referência abaixo.</li>
            <li>O contrato então compara o grupo sorteado (X) e o grupo sorteado (Y) de cada milhar com os seus prognósticos para cada um dos 5 prêmios, obedecendo a colocação dos mesmos.</li>
            <li>A premiação é distribuída automaticamente, em partes iguais, para todos os vencedores. Você pode ganhar com 5, 4, 3, 2 e até com 1 acerto apenas!</li>
          </ol>

          <div className="text-center pt-6">
            <Link href="/apostas" className="btn-admin bg-cyan-600 hover:bg-cyan-700 text-xl">
              Fazer Minha Aposta Agora!
            </Link>
          </div>
        </div>
      </div>

      {/* Tabela de Referência de Grupos */}
      <div className="flex justify-center">
        <GroupReferenceTable />
      </div>

      {/* Simulador de Resultados */}
      <div className="flex justify-center">
        <ResultSimulator />
      </div>

    </div>
  );
}