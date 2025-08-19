src/components/LanguageSwitcher.tsx

'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { ChangeEvent } from 'react';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;
    const newPathname = pathname.startsWith(`/${locale}`) 
      ? pathname.substring(locale.length + 1) || '/' 
      : pathname;
    router.replace(`/${nextLocale}${newPathname}`);
  }

  return (
    <select 
      onChange={onSelectChange} 
      defaultValue={locale}
      className="bg-slate-800 border border-slate-600 rounded-md p-2 text-white"
    >
      <option value="pt-br">Português (BR)</option>
      <option value="en">English</option>
    </select>
  );
}