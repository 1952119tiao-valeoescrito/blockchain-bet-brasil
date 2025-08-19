'use client';

import { formatEther } from "viem";

interface ContractDetailsProps {
  isLoading: boolean;
  owner?: `0x${string}`;
  isPaused?: boolean;
  ticketBase?: bigint;
  taxaPlataforma?: number;
  rodadaId?: bigint;
  rodadaStatus?: string;
}

export function ContractDetails({ isLoading, owner, isPaused, ticketBase, taxaPlataforma, rodadaId, rodadaStatus }: ContractDetailsProps) {
  
  if (isLoading) {
    return (
      <div className="bg-[#1e2a47] p-6 rounded-xl shadow-lg text-white">
        <h3 className="text-xl font-bold mb-4">Detalhes do Contrato</h3>
        <p>Carregando dados...</p>
      </div>
    );
  }

  const formatAddress = (addr?: string) => addr ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}` : 'N/A';

  return (
    <div className="bg-[#1e2a47] p-6 rounded-xl shadow-lg text-white space-y-2">
      <h3 className="text-xl font-bold mb-4">Informações Gerais</h3>
      <p><strong>Status da Rodada:</strong> {rodadaStatus}</p>
      <p><strong>Dono do Contrato:</strong> {formatAddress(owner)}</p>
      <p><strong>Contrato Pausado:</strong> {isPaused === undefined ? 'N/A' : (isPaused ? 'Sim' : 'Não')}</p>
      <p><strong>Preço Base (Admin):</strong> {ticketBase ? `${formatEther(ticketBase)} MATIC` : 'N/A'}</p>
      <p><strong>Taxa da Plataforma:</strong> {taxaPlataforma !== undefined ? `${taxaPlataforma}%` : 'N/A'}</p>
    </div>
  );
}