// src/app/premiacao/page.tsx

'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Chart from 'chart.js/auto' // Importa Chart.js

interface PrizeDistribution {
  '5 Pontos': number;
  '4 Pontos': number;
  '3 Pontos': number;
  '2 Pontos': number;
  '1 Ponto': number;
}

interface Scenario {
  title: string;
  description: string;
  distribution: PrizeDistribution;
  prizeMultiplier: number;
}

interface Scenarios {
  [key: string]: Scenario;
}

export default function Premiacao() {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const prizeChartInstance = useRef<Chart | null>(null);

  const [arrecadacao, setArrecadacao] = useState<number>(2500000);
  const [cenarioAtivo, setCenarioAtivo] = useState<keyof Scenarios>('padrao');
  const [numWinners, setNumWinners] = useState<{ [key: string]: number }>({
    '5 Pontos': 1, '4 Pontos': 1, '3 Pontos': 1, '2 Pontos': 1, '1 Ponto': 1
  });

  const scenarios: Scenarios = {
    padrao: {
      title: 'Cenário Padrão',
      description: 'O prêmio é distribuído entre 5 faixas de acertos, de acordo com os percentuais padrão.',
      distribution: { '5 Pontos': 0.50, '4 Pontos': 0.20, '3 Pontos': 0.15, '2 Pontos': 0.10, '1 Ponto': 0.05 },
      prizeMultiplier: 1.0
    },
    cascata: {
      title: 'Cenário Cascata',
      description: 'Se não houver vencedores nas faixas superiores, o prêmio acumula para as faixas inferiores. Ex: se ninguém acertar 5, 4, 3 ou 2 pontos, 100% do prêmio é destinado a quem acertou 1 ponto.',
      distribution: { '5 Pontos': 0, '4 Pontos': 0, '3 Pontos': 0, '2 Pontos': 0, '1 Ponto': 1.0 }, // Distribuição de exemplo para 100% no 1 Ponto
      prizeMultiplier: 1.0
    },
    turbinada: {
      title: 'Cenário Rodada Turbinada (Prêmio 200%)',
      description: 'O prêmio acumulado da rodada anterior é somado ao prêmio atual, dobrando o montante. A distribuição é feita com percentuais aumentados para todas as faixas (ex: 70% para 5 pontos, etc.).',
      distribution: { '5 Pontos': 0.70, '4 Pontos': 0.40, '3 Pontos': 0.35, '2 Pontos': 0.30, '1 Ponto': 0.25 },
      prizeMultiplier: 2.0
    },
    mega_turbinada: {
      title: 'Cenário Bet Turbinada (Prêmio 300%)',
      description: 'Se a rodada turbinada também acumular, o prêmio da rodada seguinte é triplicado! A distribuição é feita com percentuais ainda maiores para todas as faixas (ex: 90% para 5 pontos, etc.).',
      distribution: { '5 Pontos': 0.90, '4 Pontos': 0.60, '3 Pontos': 0.55, '2 Pontos': 0.50, '1 Ponto': 0.45 },
      prizeMultiplier: 3.0
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const calculatePrizes = (currentArrecadacao: number, currentCenario: keyof Scenarios) => {
    const premioTotalBase = currentArrecadacao * 0.95;
    const activeScenario = scenarios[currentCenario];
    const premioTotalFinal = premioTotalBase * activeScenario.prizeMultiplier;

    const prizeByTier: { [key: string]: { total: number; perWinner: number; numWinners: number } } = {};
    const tiers = Object.keys(activeScenario.distribution);

    // Lógica para cenários de cascata
    if (currentCenario === 'cascata') {
        let remainingPrize = premioTotalFinal;
        let distributedToTier1 = false; // Flag para saber se já distribuímos ao menos ao 1 Ponto

        // Inicia do maior para o menor acerto
        for (let i = tiers.length - 1; i >= 0; i--) { // Percorre do 5 Pontos até 1 Ponto
            const tier = tiers[i];
            const baseDistribution = scenarios.padrao.distribution[tier]; // Usamos a distribuição padrão como base para os percentuais base

            let totalPrizeForTier = 0;
            const numTierWinners = numWinners[tier] || 0;

            if (numTierWinners > 0) { // Se houver ganhadores nesta faixa
                // No cenário cascata, se houver ganhadores em uma faixa,
                // eles recebem o prêmio total acumulado daquela faixa e das superiores
                // que não tiveram ganhadores.
                // Simplificação: vamos dar o percentual padrão SE houver ganhadores, e o restante acumula para baixo
                // Ou, se for cascata pura, o primeiro a ter ganhadores leva tudo.
                
                // Para uma "Cascata" real, precisamos verificar se houve ganhadores nas faixas acima.
                // Vamos simular a lógica de que o prêmio 'desce' se a faixa superior não tiver ganhadores.
                // Para simplificar a simulação no UI, se selecionar "Cascata",
                // consideraremos que o prêmio vai para a faixa mais baixa com ganhadores (ou 1 Ponto se ninguém acima)
                // A descrição do seu HTML sugere que "100% do prêmio vai para quem acertou 1 ponto"
                // se ninguém acertar de 5 a 2 pontos.

                // Para o simulador, a "cascata" pode ser interpretada como: se tiver ganhador no 5, distribui, senão, 4, senão 3...
                // Ou, como a descrição da turbinada/mega turbinada, uma distribuição fixa caso o cenário seja ativado.
                // Pela sua descrição "se ninguém acertar de 5 a 2 pontos, 100% do prêmio vai para quem acertou 1 ponto",
                // vou implementar uma lógica mais fiel: o prêmio "cai" para o próximo nível com ganhadores, ou para 1 Ponto se não houverem acima.

                let hasHigherWinners = false;
                for(let j = tiers.length - 1; j > i; j--) { // Checa se tem ganhadores nas faixas acima
                    if (numWinners[tiers[j]] > 0) {
                        hasHigherWinners = true;
                        break;
                    }
                }

                if (!hasHigherWinners) { // Se não houver ganhadores nas faixas superiores
                    // Este é o nível mais alto com ganhadores OU o 1 Ponto
                    if (numTierWinners > 0) {
                        totalPrizeForTier = remainingPrize; // Leva o restante do prêmio
                        remainingPrize = 0;
                    }
                }
            }
            
            // Lógica Padrão para os outros cenários (e para o "cascata" se não houve acerto acima)
            if (activeScenario.distribution[tier] > 0 && numWinners[tier] > 0 && (currentCenario !== 'cascata' || prizeByTier[tier] === undefined)) {
                totalPrizeForTier = premioTotalFinal * activeScenario.distribution[tier];
            } else if (currentCenario === 'cascata' && tier === '1 Ponto' && remainingPrize > 0) {
                // Se for cenário cascata e chegamos ao 1 Ponto e ainda há prêmio, distribui aqui
                totalPrizeForTier = remainingPrize;
                remainingPrize = 0;
            }

            const prizePerWinner = totalPrizeForTier / (numWinners[tier] > 0 ? numWinners[tier] : 1);
            prizeByTier[tier] = {
                total: totalPrizeForTier,
                perWinner: prizePerWinner,
                numWinners: numWinners[tier] > 0 ? numWinners[tier] : 1 // Garante que não é 0 para divisão
            };
        }
        
    } else { // Lógica para Padrão, Turbinada, Mega Turbinada
        for (const tier in activeScenario.distribution) {
            const totalPrizeForTier = premioTotalFinal * activeScenario.distribution[tier];
            const numTierWinners = numWinners[tier] > 0 ? numWinners[tier] : 1;
            const prizePerWinner = totalPrizeForTier / numTierWinners;
            prizeByTier[tier] = {
                total: totalPrizeForTier,
                perWinner: prizePerWinner,
                numWinners: numTierWinners
            };
        }
    }
    return prizeByTier;
  };

  const updateChart = (activeScenario: Scenario) => {
    if (prizeChartInstance.current) {
      prizeChartInstance.current.data.labels = Object.keys(activeScenario.distribution);
      prizeChartInstance.current.data.datasets[0].data = Object.values(activeScenario.distribution);
      prizeChartInstance.current.update();
    }
  };

  useEffect(() => {
    // Inicializa o Chart.js
    if (chartRef.current && !prizeChartInstance.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        prizeChartInstance.current = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: [],
            datasets: [{
              data: [],
              backgroundColor: ['#b38b6d', '#c09a7f', '#cca891', '#d9b7a3', '#e6c5b5'],
              borderColor: '#FDFBF7',
              borderWidth: 4,
              hoverOffset: 8
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  font: { size: 14, family: 'Inter' }
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw as number || 0;
                    const total = context.dataset.data.reduce((sum, val) => (sum as number) + (val as number), 0) as number;
                    const percentage = total > 0 ? (value / total * 100) : 0;
                    return `${label}: ${percentage.toFixed(0)}% da distribuição`;
                  }
                }
              }
            },
            cutout: '60%'
          }
        });
      }
    }
    // Atualiza o gráfico e a UI quando arrecadação, cenário ou numWinners mudam
    const activeScenario = scenarios[cenarioAtivo];
    updateChart(activeScenario);

    // Adiciona o listener para o accordion
    const accordionContainer = document.getElementById('accordion-container');
    const handleAccordionClick = (e: Event) => {
      const button = (e.target as HTMLElement).closest('.accordion-button');
      if (button) {
        button.classList.toggle('active');
        const content = button.nextElementSibling as HTMLElement;
        const icon = button.querySelector('span:last-child');
        if (content) {
          content.style.maxHeight = button.classList.contains('active') ? `${content.scrollHeight}px` : '0';
        }
        if (icon) {
          icon.innerHTML = button.classList.contains('active') ? '&#9652;' : '&#9662;';
        }
      }
    };

    if (accordionContainer) {
      accordionContainer.addEventListener('click', handleAccordionClick);
    }

    return () => {
      if (accordionContainer) {
        accordionContainer.removeEventListener('click', handleAccordionClick);
      }
    };
  }, [arrecadacao, cenarioAtivo, numWinners]); // Dependências do useEffect


  const prizeDistribution = calculatePrizes(arrecadacao, cenarioAtivo);
  const activeScenario = scenarios[cenarioAtivo];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 py-12">
      {/* Estilos globais (adaptação do HTML original) */}
      <style jsx global>{`
        body {
          font-family: 'Inter', sans-serif;
          background-color: #FDFBF7; /* Cor de fundo principal do HTML */
          color: #4A4A4A; /* Cor de texto principal do HTML */
        }
        .chart-container {
          position: relative;
          width: 100%;
          max-width: 400px;
          height: auto;
          margin-left: auto;
          margin-right: auto;
          aspect-ratio: 1 / 1;
        }
        .accordion-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-out;
        }
        .accordion-button.active + .accordion-content {
            max-height: 500px; /* Será ajustado dinamicamente via JS */
        }
        input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 24px;
            height: 24px;
            background: #D4A373;
            cursor: pointer;
            border-radius: 50%;
            margin-top: -8px;
        }
        input[type="range"]::-moz-range-thumb {
            width: 24px;
            height: 24px;
            background: #D4A373;
            cursor: pointer;
            border-radius: 50%;
        }
        /* Override para o background principal para o componente React */
        .min-h-screen {
          background-color: #FDFBF7; /* Usar a cor de fundo do HTML */
        }
        .text-slate-100 {
            color: #4A4A4A; /* Usar a cor de texto do HTML */
        }
      `}</style>
      
      <div className="container mx-auto px-4">
        {/* Cabeçalho */}
        <header className="text-center mb-12">
          <Link href="/" className="inline-block mb-6">
            <button className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2 rounded-lg transition-colors">
              ← Voltar para a Home
            </button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-[#4A4A4A] mb-4">
            Regulamento Interativo
          </h1>
          <p classsName="text-lg text-gray-600 max-w-3xl mx-auto">
            Descubra como nosso sistema revolucionário recompensa todos os participantes!
          </p>
        </header>

        {/* Visão Geral (Overview Section do HTML) */}
        <section id="overview" className="mb-16">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/80 p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-[#D4A373] mb-2">O Que É?</h3>
              <p className="text-gray-700">A Blockchain Bet Brasil é um ecossistema de prognósticos baseada nos 5 prêmios da **Loteria Oficial do Brasil**. ACERTANDO APENAS 1 PONTO VOCÊ JÁ PODE IR PRA GALERA!</p>
            </div>
            <div className="bg-white/80 p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-[#D4A373] mb-2">Como Apostar?</h3>
              <p className="text-gray-700">Cada aposta consiste na escolha aleatória de 5 prognósticos de uma <a href="tabela_de_prognosticos.html" className="text-blue-500 hover:underline">tabela matriz 25x25, um para cada faixa de prêmio</a>. <a href="/" className="text-blue-500 hover:underline">VALE O ESCRITO.</a></p>
            </div>
            <div className="bg-white/80 p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-[#D4A373] mb-2">Como Ganhar?</h3>
              <p className="text-gray-700">A pontuação é baseada no número de acertos entre seus prognósticos e os resultados oficiais, na ordem exata. E ganha mesmo, quer seja com 5, 4, 3, 2 ou 1 ponto apenas, o segredo é a PERSISTÊNCIA.</p>
            </div>
          </div>
        </section>

        {/* Sistema de Premiação - Adaptado com o Simulador do HTML */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#4A4A4A]">Simulador de Prêmios</h2>
            <p className="mt-2 text-gray-600">Veja como a premiação funciona na prática. Ajuste a arrecadação e explore os cenários.</p>
          </div>

          <div className="mb-8">
            <label htmlFor="arrecadacao-slider" className="block text-lg font-semibold text-center mb-2">
              Arrecadação da Rodada: <span id="arrecadacao-valor" className="font-bold text-[#D4A373]">{formatCurrency(arrecadacao)}</span>
            </label>
            <input
              id="arrecadacao-slider"
              type="range"
              min="100000"
              max="5000000"
              value={arrecadacao}
              step="100000"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              onChange={(e) => setArrecadacao(parseInt(e.target.value, 10))}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10 text-center">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="text-sm text-gray-500">Montante Base para Prêmios (95%)</p>
              <p id="premio-total" className="text-2xl font-bold text-green-600">{formatCurrency(arrecadacao * 0.95)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="text-sm text-gray-500">Taxa Administrativa (5%)</p>
              <p id="taxa-admin" className="text-2xl font-bold text-red-600">{formatCurrency(arrecadacao * 0.05)}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-center mb-4">Explore os Cenários de Premiação</h3>
                <div id="scenario-buttons" className="flex flex-wrap justify-center gap-3">
                  {Object.keys(scenarios).map((key) => (
                    <button
                      key={key}
                      data-scenario={key}
                      className={`scenario-btn font-semibold py-2 px-4 rounded-lg ${
                        cenarioAtivo === key ? 'bg-[#D4A373] text-white shadow' : 'bg-gray-200 text-gray-700'
                      }`}
                      onClick={() => setCenarioAtivo(key as keyof Scenarios)}
                    >
                      {scenarios[key].title.replace('Cenário ', '').split('(')[0].trim()}
                    </button>
                  ))}
                </div>
              </div>
              <div id="scenario-description" className="bg-gray-50 p-4 rounded-lg border min-h-[140px]">
                <h4 classNameName="font-bold text-lg mb-1">{activeScenario.title}</h4>
                <p className="text-sm text-gray-600">{activeScenario.description}</p>
              </div>
            </div>
            <div className="chart-container">
              <canvas ref={chartRef} id="prizeChart"></canvas>
            </div>
          </div>

          <div id="results-display" className="mt-10">
            <h3 className="text-xl font-semibold text-center mb-4">Distribuição do Prêmio por Faixa</h3>
            <div className="space-y-3">
              {Object.entries(prizeDistribution).map(([tier, values]) => {
                const basePercentage = scenarios.padrao.distribution[tier as keyof PrizeDistribution] * 100;
                const effectivePercentage = activeScenario.distribution[tier as keyof PrizeDistribution] * 100;

                let percentageText = `${basePercentage.toFixed(0)}%`;
                if (cenarioAtivo.includes('turbinada')) {
                  percentageText = `${effectivePercentage.toFixed(0)}% do prêmio turbinado`;
                } else if (cenarioAtivo === 'cascata' && tier === '1 Ponto' && values.total > 0) {
                  percentageText = '100% (Cascata)';
                } else if (cenarioAtivo === 'cascata' && tier !== '1 Ponto' && values.total === 0) {
                    percentageText = '0% (acumulado)';
                } else if (cenarioAtivo === 'cascata' && values.total > 0 && tier !== '1 Ponto') {
                    // Se em cascata e o prêmio foi distribuído aqui, mas não é 1 Ponto
                    percentageText = `${(values.total / (arrecadacao * 0.95)).toFixed(0)}% (cascata)`;
                }


                return (
                  <div key={tier} className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-2">
                      <span className="font-semibold text-lg text-[#D4A373]">{tier}</span>
                      <span className="text-sm text-gray-500">{percentageText}</span>
                    </div>
                    <div className="flex justify-between items-center flex-wrap">
                      <div>
                        <p className="text-sm text-gray-600">Total para a Faixa</p>
                        <p className="font-bold text-xl text-green-700">{formatCurrency(values.total)}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <label htmlFor={`winners-${tier.replace(/\s/g, '-')}`} className="text-sm text-gray-600">Nº de Ganhadores</label>
                        <input
                          id={`winners-${tier.replace(/\s/g, '-')}`}
                          type="number"
                          min="1"
                          value={numWinners[tier] || 1}
                          onChange={(e) => setNumWinners(prev => ({
                            ...prev,
                            [tier]: parseInt(e.target.value, 10) || 1
                          }))}
                          className="winner-input w-24 text-right border rounded-md p-1 mt-1 text-gray-700"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 text-right">Prêmio por Ganhador</p>
                        <p className="font-bold text-xl text-green-700">{formatCurrency(values.perWinner)}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Sistema de Bônus (Original do page.tsx) */}
        <section className="bg-slate-800/50 rounded-2xl p-8 mb-12 border border-amber-500/30">
          <h2 className="text-3xl font-bold text-amber-400 mb-6">💰 Sistema de Bônus</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-amber-500/10 p-6 rounded-lg border border-amber-500/30">
              <h3 className="text-xl font-bold text-amber-300 mb-4">🎁 Bônus por Zero Pontos</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-500 text-amber-900 rounded-full p-2">
                    <span className="font-bold">R$</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Blockchain Bet Brasil</p>
                    <p className="text-slate-300">R$ 0,625 por aposta com zero pontos</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-amber-500 text-amber-900 rounded-full p-2">
                    <span className="font-bold">R$</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Invest Bet</p>
                    <p className="text-slate-300">R$ 125,00 por aposta com zero pontos</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-500/10 p-6 rounded-lg border border-emerald-500/30">
              <h3 className="text-xl font-bold text-emerald-300 mb-4">🔄 Apostas Grátis</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500 text-emerald-900 rounded-full p-2">
                    <span className="font-bold">8×</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Acumule 8 apostas com zero pontos</p>
                    <p className="text-slate-300">E ganhe 1 aposta grátis automaticamente!</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm mt-4">
                  Seu progresso é salvo na blockchain e pode ser verificado a qualquer momento.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Regras Detalhadas (Detailed Rules Section do HTML) */}
        <section id="detailed-rules" className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#4A4A4A]">Regras Detalhadas</h2>
            <p className="mt-2 text-gray-600">Consulte os artigos completos do regulamento.</p>
          </div>
          <div id="accordion-container" className="space-y-4 max-w-4xl mx-auto">
            <div className="border rounded-lg bg-white">
                <button className="accordion-button w-full text-left p-4 font-semibold text-lg flex justify-between items-center">
                    <span>Art. 2º - Mecânica da Aposta</span>
                    <span>&#9662;</span>
                </button>
                <div className="accordion-content px-4 pb-4 text-gray-700">
                    <p>2.1. Para concorrer, o participante pode realizar quantas apostas desejar, que consiste na escolha aleatoria de 5 (cinco) prognósticos da tabela matriz 25x25.</p>
                    <p>2.2. Cada um dos 5 prognósticos escolhidos corresponde, em ordem, a uma das 5 faixas de premiação da **Loteria Oficial do Brasil** (1º ao 5º prêmio). A premiacao real em cada rodada sera o equivalente a 95% do total que tiver sido arrecadado ate o fechamento das apostas, distribuidos percentualmente em cada faixa de pontuacao.</p>
                    <p>2.3. É permitida a repetição de prognósticos dentro de uma mesma aposta no formulario de captacao de apostas.</p>
                    <p>2.4. A aposta é considerada válida após a confirmação e o devido registro na plataforma.</p>
                </div>
            </div>
            <div className="border rounded-lg bg-white">
                <button className="accordion-button w-full text-left p-4 font-semibold text-lg flex justify-between items-center">
                    <span>Art. 8º e 9º - Normalidade e Disposições Gerais</span>
                    <span>&#9662;</span>
                </button>
                <div className="accordion-content px-4 pb-4 text-gray-700">
                    <p><strong>Art. 8º:</strong> Após a conclusão de qualquer rodada com premiação distribuída, a estrutura de premiação para a rodada subsequente retornará imediatamente ao modelo Padrão.</p>
                    <p><strong>Art. 9.1:</strong> Os prêmios são distribuídos em partes iguais entre os acertadores em cada uma das faixas de pontuação os quais podem solicitar imediatamente após o sorteio.</p>
                    <p><strong>Art. 9.2:</strong> As decisões da administração da Bet Brasil sobre a interpretação destas regras são finais.</p>
                    <p><strong>Art. 9.3:</strong> Este regulamento pode ser alterado a qualquer momento, com a devida comunicação aos usuários.</p>
                </div>
            </div>
          </div>
        </section>

        {/* Call to Action (Original do page.tsx) */}
        <section className="text-center mt-12">
          <Link href="/">
            <button className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105">
              🎯 Fazer Minha Aposta!
            </button>
          </Link>
        </section>
      </div>

      <footer className="text-center mt-16 text-sm text-gray-500">
        <p><a href="https://www.valeoescrito.com.br" className="text-blue-500 hover:underline">www.valeoescrito.com.br</a></p><br/>
        <p><a href="https://blockchain-betbrasil.io" className="text-blue-500 hover:underline">JÁ ESTAMOS NA BLOCKCHAIN</a></p><br/>
        <p>Rio de Janeiro, 27 de Agosto de 2025.</p>
      </footer>
    </div>
  )
}