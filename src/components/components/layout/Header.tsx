// src/components/layout/Header.tsx
'use client';

import { ConnectKitButton } from 'connectkit';
import Image from 'next/image';
import Link from 'next/link'; // Importe o Link para navegação

export function Header() {
  return (
    <header className="w-full p-4 sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Lado Esquerdo: Logo e Título */}
        <Link href="/" className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image 
              src="/logo.svg" // Garanta que este arquivo existe em /public/logo.svg
              alt="Blockchain Bet Brasil Logo" 
              width={32} 
              height={32}
              priority // Ajuda a carregar o logo mais rápido
            />
          </div>

          {/* Título - A MÁGICA ESTÁ AQUI */}
          <span className="font-bold text-lg text-white hidden sm:block">
            Blockchain Bet Brasil
          </span>
        </Link>

        {/* Lado Direito: Botão de Conexão */}
        <div>
          <ConnectKitButton />
        </div>
      </div>
    </header>
  );
}