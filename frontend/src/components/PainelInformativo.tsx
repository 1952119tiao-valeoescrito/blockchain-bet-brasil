// Caminho: /src/components/PainelInformativo.tsx
'use client';

import { useLotteryInfo } from '@/hooks/useLotteryInfo';
import { formatUnits } from 'viem';
import { useTranslations } from 'next-intl';

export default function PainelInformativo() {
  const t = useTranslations('PainelInformativo');
  const { contractAddress, rodadaAtualId, taxasAcumuladas, isLoading } = useLotteryInfo();

  if (isLoading) {
    return <div className="info-panel loading">{t('loading')}</div>;
  }

  const explorerUrl = `https://sepolia.etherscan.io/address/${contractAddress}`;

  return (
    <div className="info-panel">
      <h3>{t('title')}</h3>
      <p><strong>{t('currentRound')}:</strong> {rodadaAtualId}</p>
      <p><strong>{t('accumulatedFees')}:</strong> {taxasAcumuladas ? formatUnits(taxasAcumuladas, 6) : '0.00'} USDC</p>
      <p>
        <strong>{t('verifiedContract')}:</strong>{' '}
        <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="link">
          {contractAddress}
        </a>
      </p>
    </div>
  );
}