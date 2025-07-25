// src/components/BettingForm.tsx - VERSÃO COM A CURA FINAL
'use client';

import { useState, useEffect, FormEvent, useCallback } from 'react';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther } from 'viem';
import { BlockchainBetBrasilAddress, BlockchainBetBrasilABI } from '@/contracts';

interface SavedBet {
  id: string;
  rodadaId: number;
  prognosticos: string[];
  valor: string;
}

export default function BettingForm() {
    const { address: account } = useAccount();
    
    const [prognosticos, setPrognosticos] = useState(Array(5).fill(''));
    const [historicoLocal, setHistoricoLocal] = useState<SavedBet[]>([]);
    const [uiMessage, setUiMessage] = useState<{ text: string, type: 'success' | 'error' | 'info' } | null>(null);

    const contractConfig = { address: BlockchainBetBrasilAddress, abi: BlockchainBetBrasilABI };
    
    const { data: rodadaAtualId } = useReadContract({ ...contractConfig, functionName: 'rodadaAtualId' });
    const { data: ticketPrice } = useReadContract({ ...contractConfig, functionName: 'ticketPriceBase' });
    
    const { data: hash, writeContract, isPending, error: writeError } = useWriteContract();
    
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    useEffect(() => {
        if (uiMessage) {
            const timer = setTimeout(() => setUiMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [uiMessage]);
    
    useEffect(() => {
        if (writeError) {
            setUiMessage({ text: writeError.message, type: 'error' });
        }
    }, [writeError]);

    const salvarApostaNoHistorico = useCallback(() => {
        if (typeof rodadaAtualId !== 'bigint' || typeof ticketPrice !== 'bigint' || !account) return;
        const novaAposta: SavedBet = {
            id: hash || Date.now().toString(),
            rodadaId: Number(rodadaAtualId),
            prognosticos: prognosticos,
            valor: formatarValor(ticketPrice)
        };
        const novoHistorico = [novaAposta, ...historicoLocal];
        setHistoricoLocal(novoHistorico);
        localStorage.setItem(`historico_apostas_${account}`, JSON.stringify(novoHistorico));
    }, [account, hash, historicoLocal, prognosticos, rodadaAtualId, ticketPrice]);

    useEffect(() => {
        if (isSuccess) {
            setUiMessage({ text: 'Aposta registrada com sucesso!', type: 'success' });
            salvarApostaNoHistorico();
            setPrognosticos(Array(5).fill(''));
        }
    }, [isSuccess, salvarApostaNoHistorico]);

    useEffect(() => {
        if (account) {
            const historicoSalvo = localStorage.getItem(`historico_apostas_${account}`);
            if (historicoSalvo) setHistoricoLocal(JSON.parse(historicoSalvo));
        } else {
            setHistoricoLocal([]);
        }
    }, [account]);

    const formatarValor = (valor: bigint | undefined): string => {
        return typeof valor === 'bigint' ? formatEther(valor) : '...';
    };

    const handleInputChange = (index: number, value: string) => {
        if (/^[\d\/]{0,5}$/.test(value)) {
            const novosPrognosticos = [...prognosticos];
            novosPrognosticos[index] = value;
            setPrognosticos(novosPrognosticos);
        }
    };

    // FUNÇÃO COM A CURA
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setUiMessage(null);

        // A gente verifica se a caixa 'ticketPrice' já foi aberta e contém um bigint.
        if (typeof ticketPrice !== 'bigint') {
            setUiMessage({ text: "O valor da aposta ainda não foi carregado. Tente novamente em alguns segundos.", type: 'error' });
            return;
        }

        if (prognosticos.some(p => !/^\d{1,2}\/\d{1,2}$/.test(p))) {
            setUiMessage({ text: "Formato inválido. Use número/número (ex: 7/21).", type: 'error' });
            return;
        }

        try {
            const x = prognosticos.map(p => BigInt(p.split('/')[0]));
            const y = prognosticos.map(p => BigInt(p.split('/')[1]));

            setUiMessage({ text: 'Confirme a transação na sua carteira...', type: 'info' });
            
            // Agora o TypeScript sabe que ticketPrice é um 'bigint'. Pode passar.
            writeContract({
                ...contractConfig,
                functionName: 'apostar',
                args: [x, y],
                value: ticketPrice,
            });
        } catch (error) {
            setUiMessage({ text: "Erro ao processar os números da aposta.", type: 'error' });
            console.error(error);
        }
    };
    
    // O JSX que você me mandou no backup anterior, para garantir que está completo.
    const isProcessing = isPending || isConfirming;
    return (
        <div className="w-full max-w-2xl" id="bet-form">
            <form onSubmit={handleSubmit} className="bg-slate-800/50 p-6 rounded-lg space-y-4">
                 <div className="text-center">
                    <h3 className="text-2xl font-bold text-white">Faça sua Aposta</h3>
                    <p className="text-gray-400 mt-1">Preencha os 5 campos com seus prognósticos no formato X/Y.</p>
                </div>
                
                <div className="grid grid-cols-5 gap-3">
                    {prognosticos.map((p, index) => (
                        <div key={index} className="text-center">
                            <label className="text-sm text-gray-300">{index + 1}º Prêmio</label>
                            <input
                                type="text"
                                value={p}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                placeholder="ex: 7/21"
                                className="w-full mt-1 bg-slate-900 border border-slate-600 rounded-md py-2 px-1 text-white text-center font-mono focus:ring-2 focus:ring-cyan-500"
                                disabled={isProcessing}
                            />
                        </div>
                    ))}
                </div>

                <div>
                    <label className="text-sm text-gray-300">Valor da Aposta (em MATIC)</label>
                    <input type="text" readOnly value={formatarValor(ticketPrice)} className="w-full mt-1 bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white font-mono" />
                </div>

                {uiMessage && (
                    <div className={`p-3 rounded-md text-center font-semibold ${uiMessage.type === 'success' ? 'bg-green-500/20 text-green-300' : uiMessage.type === 'error' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'}`}>
                        {uiMessage.text}
                    </div>
                )}
                
                <button type="submit" disabled={isProcessing} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-lg disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors">
                    {isPending ? 'Aguardando na carteira...' : isConfirming ? 'Registrando aposta...' : 'Submeter Aposta'}
                </button>
            </form>
        </div>
    );
}