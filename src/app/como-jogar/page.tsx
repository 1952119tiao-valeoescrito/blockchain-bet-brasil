// src/app/como-jogar/page.tsx

import React from 'react';
import PrognosticsTable from '@/components/PrognosticsTable';
import Link from 'next/link';

export default function ComoJogar() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 py-12">
      <div className="container mx-auto px-4">
        {/* Cabeçalho */}
        <header className="text-center mb-12">
          <Link href="/" className="inline-block mb-6">
            <button className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2 rounded-lg transition-colors">
              ← Voltar para a Home
            </button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Como Jogar no Blockchain Bet Brasil
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Aprenda as regras, entenda o sistema de premiação e descubra como maximizar suas chances de ganhar!
          </p>
        </header>

        {/* Seção de Regras Básicas */}
        <section className="bg-slate-800/50 rounded-2xl p-8 mb-12 border border-emerald-500/30">
          <h2 className="text-3xl font-bold text-emerald-400 mb-6">📋 Regras Básicas</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-2">🎯 Formato das Apostas</h3>
                <p className="text-slate-300">
                  Cada aposta consiste em <strong>5 prognósticos</strong> no formato <strong>X/Y</strong>, onde X e Y são números de 1 a 25.
                </p>
                <p className="text-slate-400 text-sm mt-2">
                  Exemplo: <code className="bg-slate-600 px-2 py-1 rounded">15/20</code>, <code className="bg-slate-600 px-2 py-1 rounded">1/25</code>, <code className="bg-slate-600 px-2 py-1 rounded">10/5</code>
                </p>
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-2">💰 Valor das Apostas</h3>
                <ul className="text-slate-300 space-y-2">
                  <li>• <strong>Blockchain Bet Brasil:</strong> R$ 5,00 por aposta</li>
                  <li>• <strong>Invest Bet:</strong> R$ 1.000,00 por aposta</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-2">🏆 Sistema de Premiação</h3>
                <p className="text-slate-300">
                  Ganhe acertando <strong>5, 4, 3, 2 ou até 1 ponto</strong>! Quanto mais pontos, maior o prêmio.
                </p>
                <p className="text-slate-400 text-sm mt-2">
                  Distribuição: 50% (5pts), 20% (4pts), 15% (3pts), 10% (2pts), 5% (1pt)
                </p>
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-2">🎁 Sistema de Bônus</h3>
                <p className="text-slate-300">
                  <strong>Zero pontos não é derrota!</strong> Receba bônus e acumule apostas grátis.
                </p>
                <ul className="text-slate-400 text-sm mt-2 space-y-1">
                  <li>• R$ 0,625 de bônus por aposta com zero pontos</li>
                  <li>• A cada 8 apostas com zero pontos: 1 aposta grátis!</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Tabela de Prognósticos */}
        <section id="prognosticos-validos">
          <PrognosticsTable />
        </section>

        {/* Seção de Dicas */}
        <section className="bg-slate-800/50 rounded-2xl p-8 mt-12 border border-amber-500/30">
          <h2 className="text-3xl font-bold text-amber-400 mb-6">💡 Dicas Estratégicas</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-amber-500/10 p-4 rounded-lg border border-amber-500/30">
                <h4 className="text-lg font-bold text-amber-300 mb-2">🎲 Diversifique Seus Números</h4>
                <p className="text-slate-300">
                  Use números altos e baixos, pares e ímpares. A diversificação aumenta suas chances!
                </p>
              </div>

              <div className="bg-amber-500/10 p-4 rounded-lg border border-amber-500/30">
                <h4 className="text-lg font-bold text-amber-300 mb-2">📊 Consulte a Tabela</h4>
                <p className="text-slate-300">
                  Use a tabela de referência para planejar combinações estratégicas.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-amber-500/10 p-4 rounded-lg border border-amber-500/30">
                <h4 className="text-lg font-bold text-amber-300 mb-2">🔄 Aposte Regularmente</h4>
                <p className="text-slate-300">
                  Com o sistema de bônus, mesmo sem acertar você acumula para apostas grátis!
                </p>
              </div>

              <div className="bg-amber-500/10 p-4 rounded-lg border border-amber-500/30">
                <h4 className="text-lg font-bold text-amber-300 mb-2">🔍 Acompanhe os Resultados</h4>
                <p className="text-slate-300">
                  Fique de olho nos resultados anteriores para identificar padrões.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center mt-12">
          <Link href="/">
            <button className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105">
              🎯 Fazer Minha Primeira Aposta!
            </button>
          </Link>
        </section>
      </div>
    </div>
  );
}