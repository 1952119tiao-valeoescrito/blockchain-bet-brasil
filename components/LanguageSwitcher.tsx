'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleSwitch = (newLocale: string) => {
    // Remove o idioma atual do pathname (ex: /pt/apostas -> /apostas)
    const newPath = pathname.startsWith(`/${locale}`) ? pathname.substring(locale.length + 1) : pathname;
    router.replace(`/${newLocale}${newPath}`);
  };

  return (
    <div className="flex gap-2">
      <button 
        onClick={() => handleSwitch('pt')}
        disabled={locale === 'pt'}
        className="disabled:opacity-50"
      >
        🇧🇷 PT
      </button>
      <button 
        onClick={() => handleSwitch('en')}
        disabled={locale === 'en'}
        className="disabled:opacity-50"
      >
        🇬🇧 EN
      </button>
    </div>
  );
}