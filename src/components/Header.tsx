// src/components/Header.tsx
'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-slate-800 p-4 shadow-lg">
      <nav className="container mx-auto flex justify-between items-center">
        {/* ... */}
        <div className="flex items-center gap-6">
          <Link href="/apostas" className="text-slate-300 hover:text-white transition">
            Apostas
          </Link>
          <Link href="/como-jogar" className="text-slate-300 hover:text-white transition">
            Como Jogar
          </Link>

          {/* >>> NOVO LINK ESTRATÉGICO AQUI <<< */}
          <Link href="/premiacao" className="text-slate-300 hover:text-white transition font-semibold text-cyan-300">
            Premiação
          </Link>

          <Link href="/admin" className="text-slate-300 hover:text-white transition">
            Painel Admin
          </Link>
          <ConnectButton /* ...props... */ />
        </div>
      </nav>
    </header>
  );
}