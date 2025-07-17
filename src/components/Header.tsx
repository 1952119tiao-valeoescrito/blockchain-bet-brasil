// src/components/Header.tsx - VERSÃO OTIMIZADA

'use client';
import Link from 'next/link';
// 1. IMPORTAÇÃO CORRETA: O componente Image do Next.js para otimização de imagens.
import Image from 'next/image'; 
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Header = () => {
  return (
    <header className="w-full">
      <nav className="max-w-7xl mx-auto flex items-center justify-between p-4 text-gray-300">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-cyan-500 p-1 rounded-full">
             {/* 2. OTIMIZAÇÃO DE IMAGEM: Trocamos <img> por <Image>.
                 O Next.js vai otimizar o tamanho, o formato e o carregamento dessa imagem automaticamente. */}
             <Image src="/logo.png" alt="Logo do Blockchain Bet Brasil" width={28} height={28} />
          </div>
          <span className="font-bold text-xl text-white">Blockchain Bet Brasil</span>
        </Link>
        {/* 3. NAVEGAÇÃO RESPONSIVA: O uso de 'hidden md:flex' é a forma correta
            de esconder os links em telas pequenas e mostrá-los em telas maiores. */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/#bet-form" className="text-base font-medium hover:text-cyan-400 transition-colors">Apostas</Link>
          <Link href="/como-jogar" className="text-base font-medium hover:text-cyan-400 transition-colors">Como Jogar</Link>
          <Link href="/premiacao" className="text-base font-medium hover:text-cyan-400 transition-colors">Premiação</Link>
          <Link href="/painel-admin" className="text-base font-medium hover:text-cyan-400 transition-colors">Painel Admin</Link>
        </div>
        <div>
          {/* 4. BOTÃO DE CONEXÃO PADRÃO: Usando o botão do RainbowKit, que já resolve
              toda a lógica de conexão, desconexão, troca de rede, etc. Perfeito. */}
          <ConnectButton /> 
        </div>
      </nav>
    </header>
  );
};

export default Header;