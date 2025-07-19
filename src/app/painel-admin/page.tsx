// src/app/painel-admin/page.tsx - VERSÃO CORRIGIDA E MELHORADA

'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
// 1. FONTE ÚNICA DA VERDADE: Corrigido para buscar do local padrão do projeto.
import { BlockchainBetBrasilAddress, BlockchainBetBrasilABI } from '@/contracts';
import { Skeleton } from "@/components/ui/skeleton";

// --- FUNÇÕES AUXILIARES ---

// 2. LÓGICA DE STATUS OTIMIZADA: Função movida para fora do componente para não ser recriada a cada renderização.
const getStatusText = (status: number) => {
    switch(status) {
        case 0: return { text: 'INATIVA', color: 'text-gray-400' };
        case 1: return { text: 'ABERTA (Aceitando Apostas)', color: 'text-green-400' };
        case 2: return { text: 'FECHADA (Aguardando Resultados)', color: 'text-yellow-400' };
        case 3: return { text: 'PAGA (Aguardando Saques)', color: 'text-cyan-400' };
        default: return { text: 'Desconhecido', color: 'text-red-500' };
    }
};

// --- SUB-COMPONENTES ---

// 3. TIPAGEM FORTE E LIMPEZA: Props do componente agora são bem definidas, sem 'any' ou 'Function'.
type ResultadosInputProps = {
  resultados: { x: string[], y: string[] };
  setResultados: React.Dispatch<React.SetStateAction<{ x: string[], y: string[] }>>;
};

const ResultadosInput = ({ resultados, setResultados }: ResultadosInputProps) => {
    const handleInputChange = (index: number, axis: 'x' | 'y', value: string) => {
        // Permite apenas números no input
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
                    {/* 4. MODERNIZAÇÃO (TAILWIND): Estilos aplicados diretamente via classes. */}
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
    
    // 5. EXPERIÊNCIA DO USUÁRIO (UX): State para mensagens de feedback, muito melhor que 'alert()'.
    const [uiMessage, setUiMessage] = useState<{ text: string, type: 'success' | 'error' | 'info' } | null>(null);

    const contractConfig = { address: BlockchainBetBrasilAddress, abi: BlockchainBetBrasilAbi };

    const { data: owner, isLoading: isLoadingOwner } = useReadContract({ ...contractConfig, functionName: 'owner' });
    const { data: rodadaAtualId, refetch: refetchRodadaId } = useReadContract({ ...contractConfig, functionName: 'rodadaAtualId' });
    
    const { data: rodada, isLoading: isLoadingRodada, refetch: refetchRodada } = useReadContract({
        ...contractConfig,
        functionName: 'rodadas',
        args: [rodadaAtualId!], // O '!' é seguro por causa do 'enabled'
        query: { enabled: typeof rodadaAtualId === 'bigint' }
    });

    const { data: hash, writeContract, isPending, error: writeError } = useWriteContract();
    
    const { isLoading: isConfirming } = useWaitForTransactionReceipt({
      hash,
      onSuccess: (receipt) => {
        setUiMessage({ text: 'Ação executada com sucesso na blockchain!', type: 'success' });
        refetchRodadaId();
        refetchRodada();
      },
    });

    // Limpa a mensagem de feedback após alguns segundos
    useEffect(() => {
        if (uiMessage) {
            const timer = setTimeout(() => setUiMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [uiMessage]);
    
    // Mostra erro da transação de forma reativa
    useEffect(() => {
        if (writeError) {
            setUiMessage({ text: writeError.shortMessage || 'Falha na execução.', type: 'error' });
        }
    }, [writeError]);


    const isAdmin = isConnected && !isLoadingOwner && owner === account;
    const statusInfo = getStatusText(rodada ? Number(rodada[1]) : 0);
    const statusRodada = rodada ? Number(rodada[1]) : -1; // -1 para estado de carregamento

    const handleAction = (functionName: string, args: any[] = []) => {
        setUiMessage({ text: 'Enviando transação para a carteira...', type: 'info' });
        writeContract({ ...contractConfig, functionName, args });
    };

    const handleIniciarRodada = () => handleAction('iniciarNovaRodada');
    const handleFecharApostas = () => {
        if (typeof rodadaAtualId !== 'bigint') return;
        handleAction('fecharApostas', [rodadaAtualId]);
    }
    const handleRegistrarResultados = (e: React.FormEvent) => {
        e.preventDefault();
        if (typeof rodadaAtualId !== 'bigint') {
            setUiMessage({ text: "ID da rodada não encontrado.", type: 'error' });
            return;
        }
        const x = resultados.x.map(Number);
        const y = resultados.y.map(Number);

        if(x.some(isNaN) || y.some(isNaN) || x.some(v => v === 0) || y.some(v => v === 0)) {
            setUiMessage({ text: "Todos os campos de resultado devem ser preenchidos.", type: 'error' });
            return;
        }
        handleAction('registrarResultadosDaFederalEProcessar', [rodadaAtualId, x, y]);
    };
    
    const isLoading = isLoadingOwner || isLoadingRodada;
    const isProcessing = isPending || isConfirming;

    if (!isConnected) return <p className="text-center text-yellow-400 text-lg mt-10">Conecte sua carteira para gerenciar.</p>;
    if (!isAdmin && !isLoadingOwner) return <p className="text-center text-red-500 text-lg mt-10">Acesso negado. Apenas o administrador pode ver esta página.</p>;

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
                        
                        {/* Area de Feedback */}
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
            {/* 4. MODERNIZAÇÃO (TAILWIND): A tag <style jsx> foi removida. */}
        </main>
    );
}