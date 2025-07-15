// src/app/painel-admin/page.tsx
'use client';

import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { BlockchainBetBrasilAddress, BlockchainBetBrasilABI } from '@/constants/contractConfig';
import { Skeleton } from "@/components/ui/skeleton";

// Função para encurtar o endereço
const shortAddress = (address?: string) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Componente para os inputs de resultado para não poluir o código principal
const ResultadosInput = ({ resultados, setResultados }: { resultados: any, setResultados: Function }) => {
    const handleInputChange = (index: number, axis: 'x' | 'y', value: string) => {
        const newResultados = { ...resultados };
        newResultados[axis][index] = value;
        setResultados(newResultados);
    };

    return (
        <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <input type="number" placeholder={`X${i + 1}`} value={resultados.x[i]} onChange={(e) => handleInputChange(i, 'x', e.target.value)} className="input-resultado" />
                    <input type="number" placeholder={`Y${i + 1}`} value={resultados.y[i]} onChange={(e) => handleInputChange(i, 'y', e.target.value)} className="input-resultado" />
                </div>
            ))}
        </div>
    );
};


export default function PainelAdminPage() {
    const { address: account, isConnected } = useAccount();
    const [resultados, setResultados] = useState({ x: Array(5).fill(''), y: Array(5).fill('') });

    const contractConfig = { address: BlockchainBetBrasilAddress, abi: BlockchainBetBrasilABI };

    const { data: owner, isLoading: isLoadingOwner } = useReadContract({ ...contractConfig, functionName: 'owner' });
    const { data: rodadaAtualId } = useReadContract({ ...contractConfig, functionName: 'rodadaAtualId' });
    const { data: rodada, refetch: refetchRodada } = useReadContract({
        ...contractConfig,
        functionName: 'rodadas',
        args: [rodadaAtualId],
        enabled: !!rodadaAtualId
    });

    const { writeContract, isPending } = useWriteContract({
        onSuccess: () => {
            refetchRodada();
            alert('Ação executada com sucesso!');
        },
        onError: (error) => alert(`Falha na execução: ${error.message}`)
    });

    const isAdmin = isConnected && !isLoadingOwner && owner === account;
    const statusRodada = rodada ? Number(rodada[1]) : 0;

    const handleIniciarRodada = () => writeContract({ ...contractConfig, functionName: 'iniciarNovaRodada' });
    const handleFecharApostas = () => writeContract({ ...contractConfig, functionName: 'fecharApostasDaRodadaAtual' });
    const handleRegistrarResultados = (e: React.FormEvent) => {
        e.preventDefault();
        const x = resultados.x.map(Number);
        const y = resultados.y.map(Number);
        writeContract({ ...contractConfig, functionName: 'registrarResultados', args: [rodadaAtualId, x, y] });
    };

    const getStatusText = () => {
        switch(statusRodada) {
            case 1: return 'ABERTA (Aceitando Apostas)';
            case 2: return 'FECHADA (Aguardando Resultados)';
            case 3: return 'PAGA (Aguardando Saques)';
            default: return 'INATIVA';
        }
    };

    return (
        <main className="flex flex-col items-center justify-center w-full px-4 py-8" style={{ minHeight: 'calc(100vh - 160px)' }}>
            <div className="w-full max-w-3xl">
                <h1 className="text-4xl font-bold mb-8 text-center text-white">Painel do Administrador</h1>
                
                {!isConnected ? <p className="text-center text-yellow-400">Conecte sua carteira para gerenciar.</p> :
                 !isAdmin ? <p className="text-center text-red-500">Acesso negado. Apenas o administrador pode ver esta página.</p> : 
                 isLoadingOwner ? <Skeleton className="h-40 w-full bg-slate-700"/> :
                (
                    <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-slate-700 space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold text-white">Rodada Atual: #{rodadaAtualId?.toString() || '0'}</h2>
                            <p className="text-cyan-400 font-bold text-lg">{getStatusText()}</p>
                        </div>

                        <div className="border-t border-slate-700 pt-6">
                            {(statusRodada === 0 || statusRodada === 3) && (
                                <button onClick={handleIniciarRodada} disabled={isPending} className="w-full btn-admin bg-green-600 hover:bg-green-500">
                                    {isPending ? 'Iniciando...' : 'Iniciar Nova Rodada'}
                                </button>
                            )}

                            {statusRodada === 1 && (
                                <button onClick={handleFecharApostas} disabled={isPending} className="w-full btn-admin bg-yellow-600 hover:bg-yellow-500">
                                    {isPending ? 'Fechando...' : 'Fechar Apostas da Rodada'}
                                </button>
                            )}

                            {statusRodada === 2 && (
                                <form onSubmit={handleRegistrarResultados} className="space-y-4">
                                    <h3 className="text-xl font-semibold text-center">Registrar Resultados Finais</h3>
                                    <ResultadosInput resultados={resultados} setResultados={setResultados} />
                                    <button type="submit" disabled={isPending} className="w-full btn-admin bg-blue-600 hover:bg-blue-500">
                                        {isPending ? 'Registrando...' : 'Registrar Resultados e Liberar Prêmios'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <style jsx>{`
                .btn-admin { padding: 12px; border-radius: 8px; font-weight: bold; color: white; transition: all 0.2s; }
                .btn-admin:disabled { background-color: #475569; cursor: not-allowed; opacity: 0.6; }
                .input-resultado { width: 100%; background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; padding: 8px; text-align: center; color: white; }
            `}</style>
        </main>
    );
}