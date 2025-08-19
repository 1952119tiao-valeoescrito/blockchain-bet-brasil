'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import ConnectWalletButton from './ConnectWalletButton';

export default function Header() {
  const t = useTranslations('Header');

  return (
    <header className="w-full bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-wider">
          BLOCKCHAIN BET BRASIL
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/apostas" className="hover:text-green-400 transition-colors">{t('betting')}</Link>
          <Link href="/como-jogar" className="hover:text-green-400 transition-colors">{t('howToPlay')}</Link>
          <Link href="/premiacao" className="hover:text-green-400 transition-colors">{t('prizes')}</Link>
          <Link href="/painel-admin" className="hover:text-green-400 transition-colors">{t('adminPanel')}</Link>
        </nav>
        <div className="flex items-center">
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  );
}