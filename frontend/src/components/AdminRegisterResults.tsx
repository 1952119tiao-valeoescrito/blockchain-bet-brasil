// Caminho: /src/components/AdminRegisterResults.tsx
'use client';

import { useState } from 'react';
import { RodadaInfo } from '@/types';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';

export type AdminRegisterResultsProps = {
  isBusy: boolean;
  roundInfo: RodadaInfo | null;
  fecharApostas: (roundId: bigint) => void;
  registrarResultados: (roundId: bigint, milhares: string[]) => void;
};

export default function AdminRegisterResults({
  isBusy, roundInfo, fecharApostas, registrarResultados,
}: AdminRegisterResultsProps) {
  const t = useTranslations('AdminPanel.RegisterResults');
  const [numerosSorteados, setNumerosSorteados] = useState('');

  const handleCloseBets = () => roundInfo && fecharApostas(roundInfo.id);

  const handleRegisterResults = () => {
    const milhares = numerosSorteados.split(',').map(n => n.trim());
    if (milhares.length !== 5) {
      return toast.error(t('error_5_numbers'));
    }
    roundInfo && registrarResultados(roundInfo.id, milhares);
  };

  const canCloseBets = roundInfo?.status === 1;
  const canRegisterResults = roundInfo?.status === 2;

  return (
    <div className="w-full p-6 bg-slate-800/50 rounded-lg border border-slate-700">
      <h3 className="text-xl font-bold text-center text-slate-100 mb-6">{t('title', { id: roundInfo ? roundInfo.id.toString() : 'N/A' })}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col items-center gap-2 p-4 bg-slate-900/50 rounded-md">
          <h4 className='font-semibold'>{t('step1_title')}</h4>
          <p className='text-xs text-slate-400 mb-2 text-center'>{t('step1_desc')}</p>
          <button onClick={handleCloseBets} disabled={isBusy || !canCloseBets} className="btn-admin bg-orange-600 hover:bg-orange-700">
            {t('button_close')}
          </button>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 bg-slate-900/50 rounded-md">
          <h4 className='font-semibold'>{t('step2_title')}</h4>
          <p className='text-xs text-slate-400 mb-2 text-center'>{t('step2_desc')}</p>
          <input type="text" value={numerosSorteados} onChange={(e) => setNumerosSorteados(e.target.value)} placeholder={t('placeholder')} className="input-admin" disabled={isBusy || !canRegisterResults}/>
          <button onClick={handleRegisterResults} disabled={isBusy || !canRegisterResults} className="btn-admin bg-teal-600 hover:bg-teal-700 mt-2">
            {t('button_register')}
          </button>
        </div>
      </div>
    </div>
  );
}