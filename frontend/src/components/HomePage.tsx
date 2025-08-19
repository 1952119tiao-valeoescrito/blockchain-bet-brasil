'use client';

import { useTranslations } from 'next-intl';

export default function HomePage() {
  const tCommon = useTranslations('Common');
  const tWelcome = useTranslations('WelcomeMessage');

  return (
    <main className="flex flex-col items-center justify-center min-h-screen w-full px-4 text-center bg-gradient-to-b from-blue-900 to-black">
      {/* Caixa de Atenção */}
      <div className="bg-yellow-400 text-black p-3 rounded-lg max-w-lg mb-8 font-semibold shadow-lg">
        <strong>{tCommon('attention')}</strong> {tCommon('test_site_warning')}
      </div>

      {/* Conteúdo Principal */}
      <h1 className="text-5xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">
        {tWelcome('title')}
      </h1>

      <p className="text-xl md:text-2xl text-white mb-4">
        {tWelcome('subtitle')}{' '}
        <span className="text-cyan-300 font-semibold">
          {tWelcome('title_emphasis')}
        </span>
      </p>

      <p className="text-3xl md:text-4xl text-cyan-400 font-bold mb-4">
        {tWelcome('tagline')}
      </p>

      <p className="text-lg text-gray-300 mb-6">
        {tWelcome('rules_summary')}
      </p>

      <p className="text-md text-gray-400">
        {tWelcome('platform_type')}
      </p>
    </main>
  );
}
