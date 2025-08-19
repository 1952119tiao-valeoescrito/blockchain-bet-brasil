// Caminho: /src/components/PrizeDistribution.tsx
'use client';

import { useTranslations } from 'next-intl';
import { Award, TrendingDown, Gem } from 'lucide-react';

export default function PrizeDistribution() {
  const t = useTranslations('PremiacaoPage');

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      
      {/* Título Principal */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-green-400 mb-4">{t('main_title')}</h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* Coluna 1: A Distribuição Padrão */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 h-full">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-8 h-8 text-cyan-400" />
            <h2 className="text-2xl font-bold text-cyan-400">{t('distribution_title')}</h2>
          </div>
          <p className="text-gray-400 mb-6">{t('distribution_desc')}</p>
          <ul className="space-y-4">
            <li><strong className="text-xl text-white">🎯 5 {t('points')}:</strong> <span className="text-yellow-400 font-bold">50%</span> {t('of_prize')}</li>
            <li><strong className="text-xl text-white">🎯 4 {t('points')}:</strong> <span className="text-yellow-400 font-bold">20%</span> {t('of_prize')}</li>
            <li><strong className="text-xl text-white">🎯 3 {t('points')}:</strong> <span className="text-yellow-400 font-bold">15%</span> {t('of_prize')}</li>
            <li><strong className="text-xl text-white">🎯 2 {t('points')}:</strong> <span className="text-yellow-400 font-bold">10%</span> {t('of_prize')}</li>
            <li><strong className="text-xl text-white">🎯 1 {t('point')}:</strong> <span className="text-yellow-400 font-bold">5%</span> {t('of_prize')}</li>
          </ul>
        </div>

        {/* Coluna 2: A Mágica do Efeito Cascata */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 h-full">
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="w-8 h-8 text-green-400" />
            <h2 className="text-2xl font-bold text-green-400">{t('cascade_title')}</h2>
          </div>
          <p className="text-gray-400 mb-6">{t('cascade_desc')}</p>
          <div className="space-y-4 text-gray-200">
            <p>{t('cascade_example1')}</p>
            <p className="font-bold text-white">{t('cascade_example2')}</p>
          </div>
        </div>
      
      </div>

      {/* Seção de Conclusão */}
      <div className="text-center bg-slate-900 border border-green-500/50 rounded-lg p-6">
        <Gem className="w-10 h-10 text-green-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white">{t('conclusion_title')}</h3>
        <p className="text-lg text-gray-300 mt-2">{t('conclusion_desc')}</p>
      </div>

    </div>
  );
}