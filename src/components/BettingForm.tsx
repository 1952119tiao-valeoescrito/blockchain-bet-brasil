// ARQUIVO: /src/components/BettingForm.tsx - VERSÃO COM LINK ESTRATÉGICO

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'; // IMPORTANTE: Precisamos do Link para a navegação
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { BaseError, formatEther } from 'viem';
import { bettingContractAddress, bettingContractABI } from '@/contracts';

const chainCurrency: { [id: number]: string } = { /* ... seu código ... */ };

export default function BettingForm() {
    const [prognosticos, setPrognosticos] = useState<string[]>(Array(5).fill(''));
    // ...toda a sua lógica de estados e hooks que já está perfeita...
    const { address: userAddress } = useAccount();
    const chainId = useChainId();
    const currencySymbol = chainCurrency[chainId] || 'ETH';
    const { data: rodadaAtualId } = useReadContract({ /* ... */ });
    const { data: ticketPrice } = useReadContract({ /* ... */ });
    const { data: hash, writeContract, isPending, error: writeError } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

    useEffect(() => { /* ... */ }, [isConfirmed]);
    useEffect(() => { /* ... */ }, [writeError]);

    const handleApostar = (e: React.FormEvent) => { /* ... sua função de aposta perfeita ... */ };
    
    const isProcessing = isPending || isConfirming;
    const formattedPrice = ticketPrice ? formatEther(ticketPrice) : '...';

    return (
        <div className="w-full max-w-lg p-8 space-y-8 bg-slate-800/60 border border-slate-700 rounded-2xl shadow-2xl backdrop-blur-sm">
            <h3 className="text-3xl font-bold text-center text-white">
                Faça sua Aposta na <span className="text-amber-400">Rodada #{rodadaAtualId?.toString() || '...'}</span>
            </h3>

            <form onSubmit={handleApostar} className="space-y-6">
                <div className="grid grid-cols-5 gap-3">
                    {prognosticos.map((value, i) => (
                        <input
                            key={i}
                            type="text"
                            placeholder="X,Y"
                            value={value}
                            onChange={(e) => {
                                const newProgs = [...prognosticos];
                                newProgs[i] = e.target.value;
                                setPrognosticos(newProgs);
                            }}
                            className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-center text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                        />
                    ))}
                </div>
                
                {/* ... sua lógica de uiMessage ... */}
                
                <button 
                    type="submit" 
                    disabled={isProcessing} 
                    className="w-full py-4 px-4 rounded-lg font-bold text-lg text-white transition-all ..."
                >
                    {isPending ? 'Aguardando Carteira...' : isConfirming ? 'Processando Transação...' : `Submeter Aposta (${formattedPrice} ${currencySymbol})`}
                </button>
            </form>

            {/*
            // ==================================================================
            // AQUI ESTÁ A ADIÇÃO ESTRATÉGICA
            // ==================================================================
            */}
            <div className="text-center pt-4 border-t border-slate-700/50">
                <Link href="/tabela-apostas" className="text-sm text-slate-400 hover:text-emerald-400 hover:underline transition-colors">
                    Ver prognósticos válidos e tabela de premiação
                </Link>
            </div>
        </div>
    );
}