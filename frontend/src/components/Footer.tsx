// Caminho: /src/components/Footer.tsx
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="w-full bg-gray-900 text-gray-400 p-4 mt-auto">
      <div className="container mx-auto text-center text-sm">
        <p>© 2025 Blockchain Bet Brasil. {t('copyright')}</p>
        <div className="mt-2">
          <Link href="/termos" className="hover:text-white">{t('terms')}</Link>
          <span className="mx-2">|</span>
          <Link href="/privacidade" className="hover:text-white">{t('privacy')}</Link>
        </div>
      </div>
    </footer>
  );
}