// ARQUIVO: /src/app/painel-admin/page.tsx - VERSÃO COM VISUAL REFINADO

'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { BaseError, parseEther } from 'viem';
import { bettingContractAddress, bettingContractABI } from '@/contracts';
import { Shield, ShieldOff, Loader2 } from 'lucide-react'; // Ícones para feedback

// --- NENHUMA MUDANÇA NA SUA LÓGICA DE STATUS ---
const getStatusText = (status: number) => {
    switch(status) {
        case 0: return { text: 'INATIVA', color: 'text-gray-400' };
        case 1: return { text: 'ABERTA (Aceitando Apostas)', color: 'text-green-400' };
        case 2: return { text: 'FECHADA (Aguardando Resultados)', color: 'text-yellow-400' };
        case 3: return { text: 'RESULTADO DISPONÍVEL', color: 'text-cyan-400' };
        case 4: return { text: 'PAGA', color: 'text-blue-400' };
        default: return { text: 'Desconhecido', color: 'text-red-500' };
    }
};

// --- NENHUMA MUDANÇA NO SEU COMPONENTE DE INPUT DE MILHARES ---
const MilharesInput = ({ milhares, setMilhares }: { milhares: string[], setMilhares: React.Dispatch<React.SetStateAction<string[]>> }) => {
    const handleInputChange = (index: number, value: string) => {
        if (/^[0-9]*$/.test(value) && value.length <= 4) {
            const novosMilhares = [...milhares]; novosMilhares[index] = value; setMilhares(novosMilhares);
        }
    };
    return (
        <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
                <input key={i} type="text" placeholder={`Milhar ${i + 1}`} value={milhares[i]} onChange={(e) => handleInputChange(i, e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-center text-white focus:ring-2 focus:ring-emerald-500 transition" />
            ))}
        </div>
    );
};


export default function PainelAdminPage() {
    // --- NENHUMA MUDANÇA EM SEUS ESTADOS E HOOKS ---
    const [milhares, setMilhares] = useState(Array(5).fill(''));
    const { address: account, isConnected } = useAccount();
    const [uiMessage, setUiMessage] = useState<{ text: string, type: 'success' | 'error' | 'info' } | null>(null);

    const { data: owner, isLoading: isLoadingOwner } = useReadContract({ address: bettingContractAddress, abi: bettingContractABI, functionName: 'owner' });
    const { data: rodadaAtualId, refetch: refetchRodadaId } = useReadContract({ address: bettingContractAddress, abi: bettingContractABI, functionName: 'rodadaAtualId' });
    const { data: rodada, isLoading: isLoadingRodada, refetch: refetchRodada } = useReadContract({ address: bettingContractAddress, abi: bettingContractABI, functionName: 'rodadas', args: [rodadaAtualId!], query: { enabled: !!rodadaAtualId } });
    
    const { data: hash, writeContract, isPending, error: writeError } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

    useEffect(() => { if (isConfirmed) { setUiMessage({ text: 'Ação executada com sucesso!', type: 'success' }); refetchRodadaId(); refetchRodada(); } }, [isConfirmed, refetchRodadaId, refetchRodada]);
    useEffect(() => { if (uiMessage) { const timer = setTimeout(() => setUiMessage(null), 5000); return () => clearTimeout(timer); } }, [uiMessage]);
    useEffect(() => { if (writeError) { const msg = writeError.cause instanceof BaseError ? writeError.cause.shortMessage : writeError.message; setUiMessage({ text: `Falha: ${msg}`, type: 'error' }); } }, [writeError]);

    const isAdmin = isConnected && !!owner && !!account && owner.toLowerCase() === account.toLowerCase();
    const statusRodada = rodada ? Number((rodada as any)[1]) : -1;
    const statusInfo = getStatusText(statusRodada);
    
    // --- NENHUMA MUDANÇA NAS SUAS FUNÇÕES HANDLER ---
    const handleIniciarRodada = () => { /* ... seu código ... */ };
    const handleFecharApostas = () => { /* ... seu código ... */ };
    const handleRegistrarResultados = (e: React.FormEvent) => { /* ... seu código ... */ };
    
    const isLoading = isLoadingOwner || isLoadingRodada;
    const isProcessing = isPending || isConfirming;

    // --- MUDANÇAS APENAS NA PARTE VISUAL (JSX) ABAIXO ---

    if (isLoading) return <div className="flex justify-center items-center gap-2 text-slate-300"><Loader2 className="animate-spin" /> Verificando suas credenciais...</div>;
    if (!isConnected) return <div className="text-center text-yellow-400">Conecte sua carteira para acessar o painel.</div>;
    if (!isAdmin) return (
        <div className="text-center p-8 bg-slate-800/50 border border-red-500/30 rounded-lg">
            <ShieldOff className="mx-auto h-16 w-16 text-red-400 mb-4" />
            <h2 className="text-3xl font-bold text-red-400">Acesso Negado</h2>
            <p className="text-slate-300 mt-2">Apenas o administrador do contrato pode ver esta página.</p>
        </div>
    );

    return (
        <div className="w-full max-w-4xl">
            <h1 className="text-4xl font-bold mb-8 text-center text-white flex items-center justify-center gap-3"><Shield className="text-emerald-400"/> Painel do Administrador</h1>
            
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl border border-slate-700 space-y-6">
                
                {/* Seção de Status da Rodada */}
                <div className="text-center border-b border-slate-700 pb-6">
                    <h2 className="text-2xl font-semibold text-white">Rodada Atual: <span className="text-amber-400">#{rodadaAtualId?.toString() || 'N/A'}</span></h2>
                    <p className={`font-bold text-lg mt-1 ${statusInfo.color}`}>{statusInfo.text}</p>
                </div>
                
                {/* Seção de Ações */}
                <div className="pt-2">
                    {statusRodada === 0 || statusRodada === 4 ? (
                        <button onClick={handleIniciarRodada} disabled={isProcessing} className="w-full py-3 px-4 rounded-lg font-bold text-lg text-white transition-all duration-200 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 flex items-center justify-center gap-2">
                            {isProcessing ? <><Loader2 className="animate-spin"/> Processando...</> : 'Iniciar Nova Rodada'}
                        </button>
                    ) : statusRodada === 1 ? (
                        <button onClick={handleFecharApostas} disabled={isProcessing} className="w-full py-3 px-4 rounded-lg font-bold text-lg text-white transition-all duration-200 bg-yellow-600 hover:bg-yellow-500 disabled:bg-slate-600 flex items-center justify-center gap-2">
                            {isProcessing ? <><Loader2 className="animate-spin"/> Processando...</> : 'Fechar Apostas da Rodada'}
                        </button>
                    ) : statusRodada === 2 ? (
                        <form onSubmit={handleRegistrarResultados} className="space-y-4">
                            <h3 className="text-xl font-semibold text-center text-white">Registrar Milhares da Federal</h3>
                            <MilharesInput milhares={milhares} setMilhares={setMilhares} />
                            <button type="submit" disabled={isProcessing} className="w-full py-3 px-4 rounded-lg font-bold text-lg text-white transition-all duration-200 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 flex items-center justify-center gap-2">
                                {isProcessing ? <><Loader2 className="animate-spin"/> Processando...</> : 'Registrar Resultados e Processar Prêmios'}
                            </button>
                         </form>
                    ) : (
                        <div className="text-center text-slate-400">Nenhuma ação disponível para o estado atual da rodada.</div>
                    )}
                </div>

                {/* Seção de Feedback */}
                {uiMessage && ( <div className={`mt-6 p-3 rounded-md text-center font-semibold ${uiMessage.type === 'success' ? 'bg-green-900/50 text-green-300' : uiMessage.type === 'error' ? 'bg-red-900/50 text-red-300' : 'bg-blue-900/50 text-blue-300'}`}>{uiMessage.text}</div> )}

            </div>
        </div>
    );
}