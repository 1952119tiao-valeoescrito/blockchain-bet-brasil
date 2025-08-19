// Caminho: /src/components/PainelDeResultados.tsx
'use client';

import { useAccount } from 'wagmi';
import { useLotteryContract } from '@/hooks/useLotteryContract';
import { formatUnits } from 'viem';
import { useTranslations } from 'next-intl';

interface PainelDeResultadosProps { rodadaId: number; }

export default function PainelDeResultados({ rodadaId }: PainelDeResultadosProps) {
  const t = useTranslations('PainelDeResultados');
  const { isConnected } = useAccount();
  const { rodadaResultados, isResultadosLoading, premioDoUsuario, isPremioLoading, jaReivindicado, reivindicar, isReivindicarPending, isReivindicarConfirming, isReivindicarSuccess } = useLotteryContract(rodadaId);

  const renderResultados = () => {
    if (isResultadosLoading) return <p>{t('loading')}</p>;
    if (!rodadaResultados || !rodadaResultados[1]) {
      return <p>{t('awaiting')}</p>;
    }
    return (
      <div className="results-grid">
        <p><strong>{t('resultsX')}:</strong> {rodadaResultados[2].join(', ')}</p>
        <p><strong>{t('resultsY')}:</strong> {rodadaResultados[3].join(', ')}</p>
      </div>
    );
  };

  const renderPainelDoUsuario = () => {
    if (!isConnected) return null;
    if (isPremioLoading) return <p>{t('checking_prize')}</p>;
    const temPremio = premioDoUsuario && premioDoUsuario > BigInt(0);

    if (jaReivindicado) {
      return <div className="user-panel-success">{t('already_claimed', {prize: formatUnits(premioDoUsuario!, 6)})}</div>;
    }
    
    if (temPremio) {
      const valorPremio = formatUnits(premioDoUsuario!, 6);
      let buttonContent = t('claim_button', {prize: valorPremio});
      if (isReivindicarPending) buttonContent = t('claim_pending');
      if (isReivindicarConfirming) buttonContent = t('claim_confirming');
      if (isReivindicarSuccess) buttonContent = t('claim_success');

      return (
        <div className="user-panel-action">
          <h3>{t('congratulations')}</h3>
          <button onClick={() => reivindicar()} disabled={isReivindicarPending || isReivindicarConfirming || isReivindicarSuccess} className={isReivindicarSuccess ? "btn-success" : "btn-submit"}>
            {buttonContent}
          </button>
        </div>
      );
    }
    
    if (rodadaResultados && rodadaResultados[1]) {
        return <div className="user-panel-info">{t('no_win')}</div>;
    }
    return null;
  };

  return (
    <div className="panel results-panel">
      <h2>{t('title', {id: rodadaId})}</h2>
      {renderResultados()}
      {renderPainelDoUsuario()}
    </div>
  );
}