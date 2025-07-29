// ARQUIVO: /src/components/Header.tsx - VERSÃO COM LINK E MENU CORRIGIDOS

'use client';

import React, { useState } from 'react';
import Link from 'next/link'; // Usado para navegação interna
import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Links do Menu de Navegação
  const navLinks = (
    <>
      <Link href="/apostas" className="text-slate-300 hover:text-emerald-400 transition-colors">Apostas</Link>
      <Link href="/como-jogar" className="text-slate-300 hover:text-emerald-400 transition-colors">Como Jogar</Link>
      <Link href="/premiacao" className="text-slate-300 hover:text-emerald-400 transition-colors">Premiação</Link>
      <Link href="/painel-admin" className="text-slate-300 hover:text-emerald-400 transition-colors">Painel Admin</Link>
    </>
  );

  return (
    <header className="w-full bg-slate-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        
        {/* LOGO CORRIGIDO: Agora é uma tag <a> para link externo, com tudo que você queria */}
        <a 
          href="https://www.valeoescrito.com.br" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-4 group"
        >
          <Image 
            src="/images/logo.png" 
            alt="Blockchain Bet Brasil Logo"
            width={40}
            height={40}
            className="rounded-full group-hover:scale-110 transition-transform"
          />
          <div className="hidden sm:flex items-baseline gap-2">
            <span className="text-xl font-bold text-white uppercase">
              Blockchain Bet Brasil
            </span>
            <span className="text-xs text-emerald-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
              {'<'}===versão brasileira
            </span>
          </div>
        </a>

        {/* Navegação para Desktop */}
        <nav className="hidden lg:flex items-center gap-6 font-medium">
          {navLinks}
        </nav>
        
        <div className="flex items-center gap-4">
          {/* Botão Conectar Carteira */}
          <ConnectButton />

          {/* Botão do Menu Hambúrguer para Mobile */}
          <button
            className="lg:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menu" // Melhor para acessibilidade
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile (Tela Cheia) */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full h-screen bg-slate-900 bg-opacity-95 backdrop-blur-lg flex flex-col items-center justify-center gap-8">
          <nav className="flex flex-col items-center gap-8 text-2xl font-semibold">
            {/* Fechar o menu ao clicar em um link */}
            <div onClick={() => setIsMenuOpen(false)} className="w-full flex flex-col items-center gap-8">
              {navLinks}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}