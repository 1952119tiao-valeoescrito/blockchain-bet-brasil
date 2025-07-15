// src/components/layout/ConnectButton.tsx

'use client';

// Este componente é o responsável por exibir o botão de conectar ou o estado conectado.
export function ConnectButton() {
  // O <w3m-button /> do Web3Modal já é inteligente e faz todo esse trabalho.
  // Ele mostra "Connect Wallet" e, quando conectado, exibe o avatar, endereço e o status da rede.
  // É a forma mais simples e otimizada de lidar com a conexão.
  return <w3m-button />;
}