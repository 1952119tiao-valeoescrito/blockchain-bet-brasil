// src/components/Header.tsx

'use client';

// Importações necessárias para o componente
import Link from 'next/link';
import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// Definição do componente Header
const Header = () => {
  return (
    // O 'header' agora tem um fundo semi-transparente, um desfoque (backdrop-blur) e fica fixo no topo (sticky)
    <header className="w-full bg-gray-900/80 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      
      {/* Container da navegação com largura máxima, centralizado e com espaçamento */}
      <nav className="max-w-7xl mx-auto flex items-center justify-between p-4 text-gray-300">
        
        {/* --- INÍCIO DO BLOCO MODIFICADO --- */}
        
        {/* 1. LINK EXTERNO: Usamos a tag <a> para apontar para o site da sua loteria web2.
            - href: O endereço de destino.
            - target="_blank": Garante que o link abrirá em uma nova aba do navegador.
            - rel="noopener noreferrer": Uma boa prática de segurança para links externos.
            - className: Estilização com Tailwind CSS para alinhar itens e adicionar efeito ao passar o mouse.
        */}
        <a
          href="https://www.valeoescrito.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          {/* Container do Logo */}
          <div className="bg-cyan-500 p-1 rounded-full">
            {/* O componente <Image> do Next.js para otimização automática da imagem. */}
            <Image src="/images/logo.png" alt="Logo do Blockchain Bet Brasil" width={28} height={28} />
          </div>

          {/* 2. CONTAINER DOS TEXTOS:
              - 'flex flex-col': Organiza os spans internos em uma coluna vertical.
          */}
          <div className="flex flex-col">
            {/* Título Principal */}
            <span className="font-bold text-xl text-white leading-tight">
              Blockchain Bet Brasil
            </span>
            {/* Subtítulo */}
            <span className="text-sm text-gray-400 leading-tight">
              versão brasileira
            </span>
          </div>
        </a>
        
        {/* --- FIM DO BLOCO MODIFICADO --- */}

        {/* Links de navegação internos do DApp.
            - 'hidden md:flex': Fica escondido em telas pequenas (mobile) e visível como flex em telas médias ou maiores.
        */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/apostas" className="text-base font-medium hover:text-cyan-400 transition-colors">Apostas</Link>
          <Link href="/como-jogar" className="text-base font-medium hover:text-cyan-400 transition-colors">Como Jogar</Link>
          <Link href="/premiacao" className="text-base font-medium hover:text-cyan-400 transition-colors">Premiação</Link>
          <Link href="/painel-admin" className="text-base font-medium hover:text-cyan-400 transition-colors">Painel Admin</Link>
        </div>

        {/* Container para o botão de conexão da carteira */}
        <div>
          <ConnectButton />
        </div>
      </nav>
    </header>
  );
};

// Exporta o componente para ser usado em outras partes da aplicação
export default Header;