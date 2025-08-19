// Caminho: /src/app/[locale]/premiacao/page.tsx
'use client';

import { useState } from 'react';
import PrizeClaim from '@/components/PrizeClaim';
import PrizeDistribution from '@/components/PrizeDistribution';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';

export default function PremiacaoPage() {
  const t = useTranslations('PremiacaoPage');
  const [rodadaIdInput, setRodadaIdInput] = useState('');
  const [rodadaIdParaChecar, setRodadaIdParaChecar] = useState(0);

  const handleVerificar = () => { /* ... (sua lógica não muda) */ };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-12">
      
      {/* Módulo de Verificação de Prêmio */}
      <div className="w-full max-w-md mx-auto ...">
        {/* ... (seu código de input e botão) ... */}
      </div>

      {rodadaIdParaChecar > 0 && (
        <PrizeClaim rodadaId={rodadaIdParaChecar} />
      )}

      <hr className="border-slate-700" />

      {/* Módulo de Explicação da Premiação */}
      <PrizeDistribution />

    </div>
  );
}