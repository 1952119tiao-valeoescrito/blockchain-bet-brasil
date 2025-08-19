// Caminho: src/app/[locale]/layout.tsx

import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, useMessages } from 'next-intl';
// import { Providers } from '@/providers'; // <-- REMOVA ESTA LINHA. Não precisamos mais dela aqui.
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const locales = ['pt-BR', 'en'];

interface LocaleLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

export default function LocaleLayout({ children, params: { locale } }: LocaleLayoutProps) {
  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = useMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {/* O <Providers> foi removido daqui. Os componentes abaixo já
          têm acesso ao contexto Web3 porque o RootLayout os proveu. */}
      <Header />
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
      <Footer />
    </NextIntlClientProvider>
  );
}