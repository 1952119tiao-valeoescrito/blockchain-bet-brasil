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
    // NOVO: Estado para garantir que o código só rode no cliente e evitar erro de hidratação.
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    const [prognosticos, setPrognosticos] = useState<string[]>(Array(5).fill(''));
    const { isConnected } = useAccount();
    const chainId = useChainId();
    const currencySymbol = chainCurrency[chainId] || 'ETH';
    
    // ALTERADO: Capturamos o estado de carregamento do hook.
    const { data: rodadaAtualId, isLoading: isRodadaLoading } = useReadContract({
        address: bettingContractAddress,
        abi: bettingContractABI,
        functionName: 'rodadaAtualId',
    });

    // ALTERADO: Capturamos o estado de carregamento do hook.
    const { data: ticketPrice, isLoading: isPriceLoading } = useReadContract({
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
        const regex = /^\s*\d+\s*\/\s*\d+\s*$/;

        for (const prog of prognosticos) {
            if (!regex.test(prog)) {
                toast.error(`Formato inválido no prognóstico: "${prog}". Use apenas números no formato X/Y.`);
                return;
            }
            const [xStr, yStr] = prog.split('/');
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
    // ALTERADO: Usamos o estado de carregamento para a formatação do preço.
    const formattedPrice = ticketPrice ? formatEther(ticketPrice) : '...';

    // ALTERADO: Lógica do botão agora é mais robusta e explícita.
    const getButtonText = () => {
        if (isPriceLoading || isRodadaLoading) return 'Carregando Dados...';
        if (isConfirming) return 'Confirmando Transação...';
        if (isPending) return 'Aguardando Carteira...';
        if (!ticketPrice) return 'Preço Indisponível';
        return `Submeter Aposta (${formattedPrice} ${currencySymbol})`;
    }

    // ALTERADO: Adicionamos uma verificação `isClient` para evitar a renderização no servidor.
    const displayRodada = isClient && rodadaAtualId !== undefined ? rodadaAtualId.toString() : '...';

    return (
        <div className="w-full max-w-2xl p-8 space-y-8 bg-slate-800/60 border border-slate-700 rounded-2xl shadow-2xl backdrop-blur-sm">
            <h3 className="text-3xl font-bold text-center text-white">
                Faça sua Aposta na <span className="text-amber-400">Rodada #{displayRodada}</span>
            </h3>

            <form onSubmit={handleApostar} className="space-y-6">
                <div className="grid grid-cols-5 gap-3">
                    {prognosticos.map((value, i) => (
                        <input
                            key={i}
                            type="text"
                            placeholder="X/Y"
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
                    disabled={!isConnected || isProcessing || !ticketPrice || isPriceLoading} 
                    className="w-full py-4 px-4 rounded-lg font-bold text-lg text-white transition-all bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                    {/* ALTERADO: A lógica do botão agora funciona mesmo se a renderização for apenas no cliente */}
                    {isClient ? getButtonText() : 'Carregando Preço...'}
                </button>
            </form>

            <div className="flex flex-col items-center gap-2 pt-4 border-t border-slate-700/50">
                <Link href="/tabela-apostas" className="text-sm text-slate-400 hover:text-emerald-400 hover:underline transition-colors">
                    Ver prognósticos válidos.
                </Link>
                <Link href="/simulador-resultados" className="text-sm text-slate-400 hover:text-cyan-400 hover:underline transition-colors">
                    Testar conversão no Simulador de Resultados
                </Link>
            </div>
        </div>
    );
}