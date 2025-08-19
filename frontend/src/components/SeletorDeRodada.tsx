// Caminho: /src/components/SeletorDeRodada.tsx
'use client';

import { useLotteryInfo } from '@/hooks/useLotteryInfo';
import { useTranslations } from 'next-intl';

interface SeletorDeRodadaProps {
  rodadaSelecionada: number;
  onRodadaChange: (id: number) => void;
}

export default function SeletorDeRodada({ rodadaSelecionada, onRodadaChange }: SeletorDeRodadaProps) {
  const t = useTranslations('SeletorDeRodada');
  const { rodadaAtualId, isLoading } = useLotteryInfo();

  if (isLoading || rodadaAtualId === 0) {
    return <div className="selector-loading">{t('loading')}</div>;
  }

  const todasAsRodadas = Array.from({ length: rodadaAtualId }, (_, i) => rodadaAtualId - i);

  return (
    <nav className="round-selector">
      <h4>{t('title')}:</h4>
      <ul>
        {todasAsRodadas.map(id => (
          <li key={id}>
            <button
              onClick={() => onRodadaChange(id)}
              className={rodadaSelecionada === id ? 'active' : ''}
            >
              {t('roundLabel', {id: id})} {id === rodadaAtualId && t('currentLabel')}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}