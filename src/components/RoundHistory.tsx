// src/components/RoundHistory.tsx - A VERSÃO COM A CHUTEIRA REGULAMENTAR

"use client";

import { useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { bettingContractAddress, bettingContractABI } from '@/contracts';
import { Skeleton } from "@/components/ui/skeleton";

type RodadaInfo = readonly [bigint, number, bigint, bigint, bigint, bigint, bigint];

const getStatusText = (status: number) => {
    switch(status) {
        case 0: return { text: 'Inativa', color: 'text-gray-400' };
        case 1: return { text: 'Aberta', color: 'text-green-400' };
        case 2: return { text: 'Fechada', color: 'text-yellow-400' };
        // Os status 3 e 4 podem ser iguais ou diferentes, ajuste conforme sua lógica
        case 3: return { text: 'Paga', color: 'text-cyan-400' };
        case 4: return { text: 'Finalizada', color: 'text-blue-400' };
        default: return { text: 'Desconhecido', color: 'text-red-500' };
    }
};

function RoundCard({ roundId }: { roundId: bigint }) {
    const { data: roundInfo, isLoading } = useReadContract({
        address: bettingContractAddress,
        abi: bettingContractABI,
        functionName: 'getRodadaInfoBasica',
        args: [roundId],
    });

    if (isLoading) {
        return <Skeleton className="h-24 w-full bg-slate-700 rounded-lg" />;
    }

    if (!roundInfo) {
        return null;
    }

    const typedInfo = roundInfo as RodadaInfo;
    const status = getStatusText(Number(typedInfo[1]));

    return (
        <div className="bg-slate-700/80 p-4 rounded-lg border border-slate-600">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-lg text-white">Rodada #{typedInfo[0].toString()}</h4>
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${status.color.replace('text-', 'bg-').replace('-400', '/20')} ${status.color}`}>
                    {status.text}
                </span>
            </div>
            <div className="text-sm space-y-1 text-slate-300">
                <div className="flex justify-between">
                    <span>Prêmio Total:</span>
                    <span className="font-mono text-green-400">{formatEther(typedInfo[4])} ETH</span>
                </div>
                <div className="flex justify-between">
                    <span>Nº de Apostas:</span>
                    <span className="font-mono text-white">{typedInfo[5].toString()}</span>
                </div>
                <div className="flex justify-between">
                    <span>Nº de Vencedores:</span>
                    <span className="font-mono text-white">{typedInfo[6].toString()}</span>
                </div>
            </div>
        </div>
    );
}

export function RoundHistory() {
    const { data: rodadaAtualId } = useReadContract({
        address: bettingContractAddress,
        abi: bettingContractABI,
        functionName: 'rodadaAtualId',
    });

    const historyIds = [];
    // ✅ CORREÇÃO: Usando a função BigInt() para ser compatível.
    if (typeof rodadaAtualId === 'bigint' && rodadaAtualId > BigInt(0)) {
        for (let i = BigInt(0); i < BigInt(5); i++) {
            const id = rodadaAtualId - i;
            if (id > BigInt(0)) {
                historyIds.push(id);
            } else {
                break;
            }
        }
    }

    if (historyIds.length === 0) {
        return <p className="text-center text-slate-500 mt-8">Nenhuma rodada para exibir no histórico.</p>;
    }

    return (
        <div className="w-full max-w-4xl mx-auto mt-12">
            <h3 className="text-2xl font-bold text-center mb-4 text-white">Histórico de Rodadas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {historyIds.map(id => <RoundCard key={id.toString()} roundId={id} />)}
            </div>
        </div>
    );
}