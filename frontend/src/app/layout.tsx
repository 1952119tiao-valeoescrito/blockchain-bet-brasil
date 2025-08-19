// Caminho: src/app/layout.tsx

import './globals.css';
import { ReactNode } from 'react';
import { Providers } from '@/providers'; // <- Importa os provedores Web3

export const metadata = {
  title: 'Blockchain Bet Brasil',
  description: 'Sua plataforma de apostas descentralizada',
};

// Este é o layout mais alto da sua aplicação.
// Colocamos os Providers aqui para que eles envolvam TUDO.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-800 text-white flex flex-col min-h-screen">
        {/* AQUI É O LUGAR CORRETO E ÚNICO PARA OS PROVIDERS WEB3 */}
        <Providers>
          {children} {/* O {children} aqui será o seu LocaleLayout */}
        </Providers>
      </body>
    </html>
  );
}