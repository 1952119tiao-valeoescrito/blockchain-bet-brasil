// Caminho: /src/components/PrizeClaim.tsx
'use client';

import { useAccount } from 'wagmi';
import { useLotteryContract } from '@/hooks/useLotteryContract';
import { formatUnits } from 'viem';
import { useTranslations } from 'next-intl';

interface PrizeClaimProps {
  rodadaId: number;
}

export default function PrizeClaim({ rodadaId }: PrizeClaimProps) {
  const t = useTranslations('PainelDeResultados'); // Reutilizando traduções
  const { isConnected } = useAccount();
  const {
    premioDoUsuario, isPremioLoading,
    jaReivindicado,
    reivindicar, isReivindicando
  } = useLotteryContract(rodadaId);

  if (!isConnected) return null;
  if (isPremioLoading) return <p className="text-center">{t('checking_prize')}</p>;

  const temPremio = premioDoUsuario && premioDoUsuario > BigInt(0);

  if (jaReivindicado) {
    return <div className="user-panel-success text-center">{t('already_claimed', {prize: formatUnits(premioDoUsuario!, 6)})}</div>;
  }
  
  if (temPremio) {
    const valorPremio = formatUnits(premioDoUsuario!, 6);
    let buttonContent = t('claim_button', {prize: valorPremio});
    if (isReivindicando) buttonContent = t('claim_confirming');

    return (
      <div className="w-full max-w-md mx-auto bg-green-900/50 border border-green-700 rounded-lg p-6 text-center">
        <h3 className="text-2xl font-bold text-green-400">{t('congratulations')}</h3>
        <button 
          onClick={() => reivindicar()}
          disabled={isReivindicando}
          className="btn-submit mt-4"
        >
          {buttonContent}
        </button>
      </div>
    );
  }
  
  return <div className="user-panel-info text-center">{t('no_win')}</div>;
}
