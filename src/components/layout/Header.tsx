// src/components/layout/Header.tsx - VERSÃO CORRIGIDA

'use client';

// ✅ CORREÇÃO: Importando o botão correto da biblioteca que configuramos
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/logo.png" // Garanta que você tem uma imagem 'logo.png' na sua pasta /public
                alt="Blockchain Bet Brasil Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-xl font-bold text-white hidden sm:inline">
                Blockchain Bet Brasil
              </span>
          </Link>

          <nav className="flex items-center space-x-4">
            {/* Link para o painel de admin, por exemplo */}
            <Link href="/painel-admin" className="text-slate-300 hover:text-white transition-colors">
              Admin
            </Link>

            {/* ✅ CORREÇÃO: Usando o botão correto */}
            <ConnectButton />
          </nav>
        </div>
      </div>
    </header>
  );
}