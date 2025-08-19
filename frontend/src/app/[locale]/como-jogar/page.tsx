// Caminho: /src/app/[locale]/como-jogar/page.tsx
'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function HowToPlayPage() {
  const t = useTranslations('ComoJogarPage');

  return (
    <div className="flex flex-col items-center justify-start h-full p-4 pt-12">
      <div className="w-full max-w-4xl mx-auto p-8 bg-gray-900/50 rounded-lg shadow-lg border border-gray-700">
        
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          {t('title')}
        </h1>

        <p className="text-gray-300 mb-6">
          {t.rich('intro_p1', {
            link: (chunks) => <a href="https://loterias.caixa.gov.br/Paginas/Loteria-Federal.aspx" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">{chunks}</a>
          })}
        </p>

        <h2 className="text-2xl font-bold text-cyan-400 mb-4">{t('betting_title')}</h2>
        <p className="text-gray-300 mb-6">
          {t.rich('betting_p1', {
            mono: (chunks) => <span className="font-mono bg-gray-700 px-1 rounded">{chunks}</span>
          })}
        </p>
        
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">{t('clearing_title')}</h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 mb-8">
          <li>{t('clearing_li1')}</li>
          <li>
            {t.rich('clearing_li2', {
              yellow: (chunks) => <span className="font-semibold text-yellow-400">{chunks}</span>
            })}
          </li>
          <li>{t('clearing_li3')}</li>
          <li>{t('clearing_li4')}</li>
        </ol>

        <div className="text-center">
          <Link 
            href="/apostas" // CORREÇÃO: Link agora aponta para a página de apostas correta
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg"
          >
            {t('cta_button')}
          </Link>
        </div>

      </div>
    </div>
  );
}