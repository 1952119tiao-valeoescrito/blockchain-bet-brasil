// Caminho: /src/components/AnnouncementBanner.tsx
'use client';

import { ShieldCheck } from 'lucide-react'; // Ícone de Segurança e Confiança
import { useTranslations } from 'next-intl';

export function AnnouncementBanner() {
  const t = useTranslations('AnnouncementBanner');

  return (
    // Estilo novo: Um gradiente sutil que inspira tecnologia e sucesso.
    <div className="w-full max-w-4xl bg-gradient-to-r from-blue-600 to-green-500 text-white p-4 rounded-lg flex items-center justify-center gap-4 my-12 shadow-lg">
      
      {/* Ícone novo: O escudo representa a segurança que implementamos. */}
      <ShieldCheck className="h-8 w-8 flex-shrink-0" />

      <div>
        <h2 className="font-bold text-lg">{t('title')}</h2>
        <p className="text-sm">{t('body')}</p>
      </div>
    </div>
  );
}