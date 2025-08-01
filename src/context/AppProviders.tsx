// src/context/AppProviders.tsx

'use client'; // <-- 1. A MÁGICA! Isso transforma o arquivo em um Componente de Cliente.

import dynamic from 'next/dynamic';
import { Toaster } from 'react-hot-toast';

// Agora sim, aqui dentro podemos fazer o import dinâmico com segurança.
const Web3Provider = dynamic(
  () => import('./Web3Provider').then((mod) => mod.Web3Provider),
  { ssr: false }
);

// Este componente vai "abraçar" os nossos filhos e prover o contexto do Web3.
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Web3Provider>
      <Toaster position="bottom-right" />
      {children}
    </Web3Provider>
  );
}