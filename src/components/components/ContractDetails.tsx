// src/components/ContractDetails.tsx
'use client';

import { formatEther, type Address } from 'viem';

interface ContractDetailsProps {
  isLoading: boolean; // <-- A NOVA PROP!
  owner?: Address;
  isPaused?: boolean;
  ticketBase?: bigint;
  taxaPlataforma?: number;
  rodadaId?: bigint;
  rodadaStatus?: string;
}

const DetailRow = ({ label, value, isLoading }: { label: string; value?: string | number | boolean; isLoading: boolean }) => (
  <div className="flex justify-between text-sm">
    <span className="text-slate-400">{label}:</span>
    <span className="font-mono text-slate-200">
      {isLoading ? 'Carregando...' : (value !== undefined ? String(value) : 'N/A')}
    </span>
  </div>
);

export function ContractDetails({
  isLoading, owner, isPaused, ticketBase, taxaPlataforma, rodadaId, rodadaStatus
}: ContractDetailsProps) {
  
  const formatAddress = (addr?: Address) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : undefined;
  const formatTicketPrice = (price?: bigint) => price !== undefined ? `${formatEther(price)} ETH` : undefined;

  return (
    <div className="w-full p-4 bg-slate-800 rounded-md border border-slate-700 space-y-2">
      <DetailRow label="Owner" value={formatAddress(owner)} isLoading={isLoading} />
      <DetailRow label="Contrato Pausado" value={isPaused === undefined ? undefined : (isPaused ? 'Sim' : 'Não')} isLoading={isLoading} />
      <DetailRow label="Ticket Base" value={formatTicketPrice(ticketBase)} isLoading={isLoading} />
      <DetailRow label="Taxa Plataforma" value={taxaPlataforma !== undefined ? `${taxaPlataforma}%` : undefined} isLoading={isLoading} />
      <hr className="border-slate-600 my-2" />
      <DetailRow label="Rodada Atual" value={rodadaId !== undefined ? `#${rodadaId.toString()}` : 'N/A'} isLoading={isLoading} />
      <DetailRow label="Status da Rodada" value={rodadaStatus} isLoading={isLoading && rodadaId === undefined} />
    </div>
  );
}