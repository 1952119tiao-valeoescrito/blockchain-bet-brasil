// src/components/PrizeDistribution.tsx

const prizeTiers = [
  { points: 5, percentage: 50, color: 'bg-yellow-500' },
  { points: 4, percentage: 20, color: 'bg-cyan-500' },
  { points: 3, percentage: 15, color: 'bg-green-500' },
  { points: 2, percentage: 10, color: 'bg-blue-500' },
  { points: 1, percentage: 5,  color: 'bg-purple-500' },
];

export default function PrizeDistribution() {
  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
      <h2 className="text-2xl font-semibold text-white mb-4">Distribuição do Prêmio Total (95% da Arrecadação)</h2>
      <p className="text-gray-300 mb-6">O valor total do prêmio é dividido, em partes iguais, entre os ganhadores em cada uma das 5 faixas de pontuação da seguinte forma:</p>
      
      {/* A Barra Visual */}
      <div className="w-full flex h-8 rounded-lg overflow-hidden mb-6">
        {prizeTiers.map(tier => (
          <div 
            key={tier.points}
            style={{ width: `${tier.percentage}%` }}
            className={`${tier.color} flex items-center justify-center text-white font-bold text-sm`}
            title={`${tier.percentage}% para ${tier.points} pontos`}
          >
            {tier.percentage}%
          </div>
        ))}
      </div>

      {/* A Legenda */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
        {prizeTiers.map(tier => (
          <div key={tier.points}>
            <div className="flex items-center justify-center gap-2">
              <div className={`w-4 h-4 rounded-full ${tier.color}`}></div>
              <span className="font-bold text-white">{tier.points} Pontos</span>
            </div>
            <p className="text-gray-400 text-sm">{tier.percentage}% do prêmio</p>
          </div>
        ))}
      </div>
    </div>
  );
}