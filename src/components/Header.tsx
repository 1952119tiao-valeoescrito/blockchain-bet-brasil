// src/components/Header.tsx - VERSÃO AJUSTADA
'use client';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit'; // Ou o botão que você usa

const Header = () => {
  return (
    <header className="w-full">
      <nav className="max-w-7xl mx-auto flex items-center justify-between p-4 text-gray-300">
        <Link href="/" className="flex items-center gap-2">
          {/* O ideal é ter o logo como um SVG ou Imagem */}
          <div className="bg-cyan-500 p-1 rounded-full">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src="/logo.png" alt="Logo" width={28} height={28} />
          </div>
          {/* ===== TEXTO DO LOGO AJUSTADO ===== */}
          <span className="font-bold text-xl text-white">Blockchain Bet Brasil</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {/* ===== TEXTO DOS LINKS AJUSTADO ===== */}
          <Link href="/#bet-form" className="text-base font-medium hover:text-cyan-400 transition-colors">Apostas</Link>
          <Link href="/como-jogar" className="text-base font-medium hover:text-cyan-400 transition-colors">Como Jogar</Link>
          <Link href="/premiacao" className="text-base font-medium hover:text-cyan-400 transition-colors">Premiação</Link>
          <Link href="/painel-admin" className="text-base font-medium hover:text-cyan-400 transition-colors">Painel Admin</Link>
        </div>
        <div>
          {/* Seu botão de conectar carteira */}
          <ConnectButton /> 
        </div>
      </nav>
    </header>
  );
};

export default Header;