// src/app/painel-admin/page.tsx - VERSÃO FINAL CORRIGIDA

'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
// FONTE ÚNICA DA VERDADE: Buscando do local padrão do projeto.
import { BlockchainBetBrasilAddress, BlockchainBetBrasilABI } from '@/contracts';
import { Skeleton } from "@/components/ui/skeleton";

// --- FUNÇÃO AUXILIAR DE STATUS ---
// Movida para fora para não ser recriada a cada renderização.
const getStatusText = (status: number) => {
    switch(status) {
        case 0: return { text: 'INATIVA', color: 'text-gray-400' };
        case 1: return { text: 'ABERTA (Aceitando Apostas)', color: 'text-green-400' };
        case 2: return { text: 'FECHADA (Aguardando Resultados)', color: 'text-yellow-400' };
        case 3: return { text: 'PAGA (Aguardando Saques)', color: 'text-cyan-400' };
        default: return { text: 'Desconhecido', color: 'text-red-500' };
    }
};

// --- SUB-COMPONENTE PARA INPUTS ---
// Tipagem forte e lógica de input isolada.
type ResultadosInputProps = {
  resultados: { x: string[], y: string[] };
  setResultados: React.Dispatch<React.SetStateAction<{ x: string[], y: string[] }>>;
};

const ResultadosInput = ({ resultados, setResultados }: ResultadosInputProps) => {
    const handleInputChange = (index: number, axis: 'x' | 'y', value: string) => {
        if (/^[0-9]*$/.test(value)) {
            const newResultados = { ...resultados };
            newResultados[axis][index] = value;
            setResultados(newResultados);
        }
    };

    return (
        <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <input type="text" placeholder={`X${i + 1}`} value={resultados.x[i]} onChange={(e) => handleInputChange(i, 'x', e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-center text-white" maxLength={2} />
                    <input type="text" placeholder={`Y${i + 1}`} value={resultados.y[i]} onChange={(e) => handleInputChange(i, 'y', e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-center text-white" maxLength={2} />
                </div>
            ))}
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
export default function PainelAdminPage() {
    const { address: account, isConnected } = useAccount();
    const [resultados, setResultados] = useState({ x: Array(5).fill(''), y: Array(5).fill('') });
    const [uiMessage, setUiMessage] = useState<{ text: string, type: 'success' | 'error' | 'info' } | null>(null);

    // --- LEITURA DE CONTRATO ---
    // ✅ CORREÇÃO APLICADA: Parâmetros passados diretamente para cada hook, sem o objeto intermediário 'contractConfig'.
    const { data: owner, isLoading: isLoadingOwner } = useReadContract({
        address: BlockchainBetBrasilAddress,
        abi: BlockchainBetBrasilABI,
        functionName: 'owner'
    });

    const { data: rodadaAtualId, refetch: refetchRodadaId } = useReadContract({
        address: BlockchainBetBrasilAddress,
        abi: BlockchainBetBrasilABI,
        functionName: 'rodadaAtualId'
    });
    
    const { data: rodada, isLoading: isLoadingRodada, refetch: refetchRodada } = useReadContract({
        address: BlockchainBetBrasilAddress,
        abi: BlockchainBetBrasilABI,
        functionName: 'rodadas',
        args: [rodadaAtualId!], // O '!' é seguro por causa da checagem 'enabled' abaixo
        query: { enabled: typeof rodadaAtualId === 'bigint' } // Hook só roda se rodadaAtualId for um bigint válido
    });

    // --- ESCRITA NO CONTRATO E FEEDBACK ---
    const { data: hash, writeContract, isPending, error: writeError } = useWriteContract();
    
    const { isLoading: isConfirming } = useWaitForTransactionReceipt({
      hash,
      onSuccess: () => {
        setUiMessage({ text: 'Ação executada com sucesso na blockchain!', type: 'success' });
        refetchRodadaId();
        refetchRodada();
      },
    });

    // Efeitos para limpar mensagens e mostrar erros
    useEffect(() => {
        if (uiMessage) {
            const timer = setTimeout(() => setUiMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [uiMessage]);
    
    useEffect(() => {
        if (writeError) {
            setUiMessage({ text: writeError.shortMessage || 'Falha na execução da transação.', type: 'error' });
        }
    }, [writeError]);

    // --- LÓGICA DE NEGÓCIO E AÇÕES ---
    const isAdmin = isConnected && !isLoadingOwner && owner === account;
    const statusInfo = getStatusText(rodada ? Number(rodada[1]) : 0);
    const statusRodada = rodada ? Number(rodada[1]) : -1;

    // ✅ CORREÇÃO APLICADA: 'handleAction' também passa os parâmetros diretamente, sem 'contractConfig'.
    const handleAction = (functionName: string, args: any[] = []) => {
        setUiMessage({ text: 'Abra sua carteira para assinar a transação...', type: 'info' });
        writeContract({
            address: BlockchainBetBrasilAddress,
            abi: BlockchainBetBrasilABI,
            functionName,
            args
        });
    };

    const handleIniciarRodada = () => handleAction('iniciarNovaRodada');

    const handleFecharApostas = () => {
        if (typeof rodadaAtualId !== 'bigint') return;
        handleAction('fecharApostas', [rodadaAtualId]);
    };

    const handleRegistrarResultados = (e: React.FormEvent) => {
        e.preventDefault();
        if (typeof rodadaAtualId !== 'bigint') {
            setUiMessage({ text: "ID da rodada atual não foi carregado.", type: 'error' });
            return;
        }
        const x = resultados.x.map(v => parseInt(v, 10));
        const y = resultados.y.map(v => parseInt(v, 10));

        if(x.some(isNaN) || y.some(isNaN) || x.length < 5 || y.length < 5) {
            setUiMessage({ text: "Todos os 10 campos de resultado devem ser preenchidos com números.", type: 'error' });
            return;
        }
        handleAction('registrarResultadosDaFederalEProcessar', [rodadaAtualId, x, y]);
    };
    
    // --- RENDERIZAÇÃO ---
    const isLoading = isLoadingOwner || isLoadingRodada;
    const isProcessing = isPending || isConfirming;

    if (!isConnected) return <p className="text-center text-yellow-400 text-lg mt-10">Conecte sua carteira para acessar o painel.</p>;
    if (!isAdmin && !isLoadingOwner) return <p className="text-center text-red-500 text-lg mt-10">Acesso negado. Esta página é restrita ao administrador.</p>;

    return (
        <main className="flex flex-col items-center justify-center w-full px-4 py-8" style={{ minHeight: 'calc(100vh - 160px)' }}>
            <div className="w-full max-w-3xl">
                <h1 className="text-4xl font-bold mb-8 text-center text-white">Painel do Administrador</h1>
                
                {isLoading ? <Skeleton className="h-60 w-full bg-slate-700 rounded-2xl"/> :
                (
                    <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-slate-700 space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold text-white">Rodada Atual: #{rodadaAtualId?.toString() || 'N/A'}</h2>
                            <p className={`font-bold text-lg ${statusInfo.color}`}>{statusInfo.text}</p>
                        </div>
                        
                        {uiMessage && (
                           <div className={`p-3 rounded-md text-center font-semibold ${uiMessage.type === 'success' ? 'bg-green-500/20 text-green-300' : uiMessage.type === 'error' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'}`}>
                               {uiMessage.text}
                           </div>
                        )}

                        <div className="border-t border-slate-700 pt-6">
                            {(statusRodada === 0 || statusRodada === 3) && (
                                <button onClick={handleIniciarRodada} disabled={isProcessing} className="w-full py-3 px-4 rounded-lg font-bold text-white transition-all duration-200 bg-green-600 hover:bg-green-500 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-60">
                                    {isProcessing ? 'Processando...' : 'Iniciar Nova Rodada'}
                                </button>
                            )}

                            {statusRodada === 1 && (
                                <button onClick={handleFecharApostas} disabled={isProcessing} className="w-full py-3 px-4 rounded-lg font-bold text-white transition-all duration-200 bg-yellow-600 hover:bg-yellow-500 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-60">
                                    {isProcessing ? 'Processando...' : 'Fechar Apostas da Rodada'}
                                </button>
                            )}

                            {statusRodada === 2 && (
                                <form onSubmit={handleRegistrarResultados} className="space-y-4">
                                    <h3 className="text-xl font-semibold text-center">Registrar Resultados Finais</h3>
                                    <ResultadosInput resultados={resultados} setResultados={setResultados} />
                                    <button type="submit" disabled={isProcessing} className="w-full py-3 px-4 rounded-lg font-bold text-white transition-all duration-200 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-60">
                                        {isProcessing ? 'Processando...' : 'Registrar Resultados e Liberar Prêmios'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}