// src/components/Header.tsx - VERSÃO FINAL E CORRETA

'use client';
import Link from 'next/link';
import Image from 'next/image'; 
import { ConnectButton } from '@rainbow-me/rainbowkit';

// A gente unifica a declaração e garante o 'export default' para matar o erro de sintaxe e o de importação de uma vez.
export default function Header() {
  return (
    <header className="w-full">
      <nav className="max-w-7xl mx-auto flex items-center justify-between p-4 text-gray-300">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-cyan-500 p-1 rounded-full">
             <Image src="/logo.png" alt="Logo do Blockchain Bet Brasil" width={28} height={28} />
          </div>
          <span className="font-bold text-xl text-white">Blockchain Bet Brasil</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/#bet-form" className="text-base font-medium hover:text-cyan-400 transition-colors">Apostas</Link>
          <Link href="/como-jogar" className="text-base font-medium hover:text-cyan-400 transition-colors">Como Jogar</Link>
          <Link href="/premiacao" className="text-base font-medium hover:text-cyan-400 transition-colors">Premiação</Link>
          <Link href="/painel-admin" className="text-base font-medium hover:text-cyan-400 transition-colors">Painel Admin</Link>
        </div>
        <div>
          <ConnectButton /> 
        </div>
      </nav>
    </header>
  );
};