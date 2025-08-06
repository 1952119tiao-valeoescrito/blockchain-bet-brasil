// src/components/Header.tsx

'use client';

// Importações necessárias
import Link from 'next/link'; // Para os links de navegação INTERNOS
import Image from 'next/image'; // Para o logo otimizado
import { ConnectButton } from '@rainbow-me/rainbowkit'; // O botão da carteira

const Header = () => {
  return (
    <header className="w-full bg-gray-900/80 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between p-4 text-gray-300">

        {/* ====================================================================== */}
        {/* A JOIA RESTAURADA: O seu link para a loteria Web2 */}
        <a
          href="https://www.valeoescrito.com.br"
          target="_blank" // Abre em nova aba
          rel="noopener noreferrer" // Por segurança
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          {/* O Logo */}
          <div className="bg-cyan-500 p-1 rounded-full">
            <Image src="/images/logo.png" alt="Logo Blockchain Bet Brasil" width={28} height={28} />
          </div>

          {/* O Texto em Duas Linhas */}
          <div className="flex flex-col">
            <span className="font-bold text-xl text-white leading-tight">
              Blockchain Bet Brasil
            </span>
            <span className="text-sm text-gray-400 leading-tight">
              versão brasileira
            </span>
          </div>
        </a>
        {/* ====================================================================== */}


        {/* O resto da sua navegação, que já estava perfeita */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/apostas" className="text-base font-medium hover:text-cyan-400 transition-colors">Apostas</Link>
          <Link href="/como-jogar" className="text-base font-medium hover:text-cyan-400 transition-colors">Como Jogar</Link>
          <Link href="/premiacao" className="text-base font-medium hover:text-cyan-400 transition-colors">Premiação</Link>
          <Link href="/painel-admin" className="text-base font-medium hover:text-cyan-400 transition-colors">Painel Admin</Link>
        </div>

        {/* O botão de conectar carteira */}
        <div>
          <ConnectButton />
        </div>
      </nav>
    </header>
  );
};

// Não esqueça da exportação padrão
export default Header;