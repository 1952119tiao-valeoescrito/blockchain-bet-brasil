// src/components/WelcomeMessage.tsx
'use client';
import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
const WelcomeMessage = () => {
const t = useTranslations('WelcomeMessage');
const tCommon = useTranslations('Common');
return (
<div className="text-center text-white max-w-5xl w-full px-4">
code
Code
<div className="bg-yellow-500 text-black p-3 rounded-md mb-6 max-w-lg mx-auto">
    <p><strong>{tCommon('attention')}</strong> {tCommon('test_site_warning')}</p>
  </div>

  <h1 className="text-4xl font-bold mb-3">{t('title')}</h1>
  <h2 className="text-2xl font-semibold text-cyan-400 mb-4">{t('subtitle')}</h2>
  <p className="text-xl font-light text-gray-300 mb-4">{t('tagline')}</p>
  
  <p className="text-lg text-gray-400">{t('rules_summary')}</p>
  <p className="text-lg text-gray-400 mb-4">{t('platform_type')}</p>
  <p className="text-yellow-400">{t('connect_prompt')}</p>
  
  <div className="mt-6 max-w-3xl mx-auto">
    <Image
      src="/images/2-animais.png"
      alt={t('image_alt')}
      width={800}
      height={450}
      className="rounded-lg border-2 border-gray-700"
      priority
    />
  </div>

</div>
);
};
export default WelcomeMessage;