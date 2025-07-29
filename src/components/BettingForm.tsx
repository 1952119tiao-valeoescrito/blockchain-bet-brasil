// /src/components/BettingForm.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { BaseError, formatEther } from 'viem';
import { bettingContractAddress, bettingContractABI } from '@/contracts';
import toast from 'react-hot-toast';

const chainCurrency: { [id: number]: string } = {};

export default function BettingForm() {
    const [prognosticos, setPrognosticos] = useState<string[]>(Array(5).fill(''));
    const { isConnected } = useAccount();
    const chainId = useChainId();
    const currencySymbol = chainCurrency[chainId] || 'ETH';
    
    const { data: rodadaAtualId } = useReadContract({
        address: bettingContractAddress,
        abi: bettingContractABI,
        functionName: 'rodadaAtualId',
    });

    const { data: ticketPrice } = useReadContract({
        address: bettingContractAddress,
        abi: bettingContractABI,
        functionName: 'ticketPriceBase',
    });

    const { data: hash, writeContract, isPending, error: writeError } = useWriteContract();
    
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

    useEffect(() => {
        if (isConfirmed) {
            toast.success('Aposta submetida com sucesso!');
            setPrognosticos(Array(5).fill(''));
        }
        if (writeError) {
            toast.error((writeError as BaseError)?.shortMessage || writeError.message);
        }
    }, [isConfirmed, writeError]);

    const handleApostar = (e: React.FormEvent) => {
        e.preventDefault();
        if (!ticketPrice) return;

        const prognosticosX: bigint[] = [];
        const prognosticosY: bigint[] = [];
        const regex = /^\s*\d+\s*,\s*\d+\s*$/;

        for (const prog of prognosticos) {
            if (!regex.test(prog)) {
                toast.error(`Formato inválido no prognóstico: "${prog}". Use apenas números no formato X,Y.`);
                return;
            }
            const [xStr, yStr] = prog.split(',');
            prognosticosX.push(BigInt(xStr.trim()));
            prognosticosY.push(BigInt(yStr.trim()));
        }

        if (prognosticosX.length !== 5) {
            return;
        }
        
        writeContract({
            address: bettingContractAddress,
            abi: bettingContractABI,
            functionName: 'apostar',
            args: [
                prognosticosX as unknown as readonly [bigint, bigint, bigint, bigint, bigint],
                prognosticosY as unknown as readonly [bigint, bigint, bigint, bigint, bigint]
            ],
            value: ticketPrice,
        });
    };
    
    const isProcessing = isPending || isConfirming;
    const formattedPrice = ticketPrice ? formatEther(ticketPrice) : '...';

    return (
        <div className="w-full max-w-2xl p-8 space-y-8 bg-slate-800/60 border border-slate-700 rounded-2xl shadow-2xl backdrop-blur-sm">
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
                            required
                        />
                    ))}
                </div>
                
                <button 
                    type="submit" 
                    disabled={!isConnected || isProcessing || !ticketPrice} 
                    className="w-full py-4 px-4 rounded-lg font-bold text-lg text-white transition-all bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                    {isPending ? 'Aguardando Carteira...' : isConfirming ? 'Processando Transação...' : `Submeter Aposta (${formattedPrice} ${currencySymbol})`}
                </button>
            </form>

            <div className="text-center pt-4 border-t border-slate-700/50">
                <Link href="/tabela-apostas" className="text-sm text-slate-400 hover:text-emerald-400 hover:underline transition-colors">
                    Ver prognósticos válidos e tabela de premiação
                </Link>
            </div>
        </div>
    );
}