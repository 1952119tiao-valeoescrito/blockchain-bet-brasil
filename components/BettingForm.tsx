// components/BettingForm.tsx (A VERSÃO FINAL. PROMETO.)

'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther, BaseError } from 'viem';
import { contractAddress, contractABI } from '@/constants';
import { UiMessageCard } from './UiMessageCard';

interface SavedBet {
  id: string;
  rodadaId: number;
  prognosticos: string[];
  valor: string;
}

export default function BettingForm() {
    const { address: account, isConnected } = useAccount();
    
    const [prognosticos, setPrognosticos] = useState(Array(5).fill(''));
    const [historicoLocal, setHistoricoLocal] = useState<SavedBet[]>([]);
    const [uiMessage, setUiMessage] = useState<{ text: string, type: 'success' | 'error' | 'info' } | null>(null);

    const contractConfig = { address: contractAddress, abi: contractABI };
    
    const { data: rodadaAtualId } = useReadContract({ ...contractConfig, functionName: 'rodadaAtualId' });
    const { data: ticketPrice } = useReadContract({ ...contractConfig, functionName: 'ticketPriceBase' });
    
    const { data: hash, writeContract, isPending, error: writeError } = useWriteContract();
    
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
      hash,
    });

    useEffect(() => {
        if (isSuccess) {
            setUiMessage({ text: 'Aposta registrada com sucesso!', type: 'success' });
            salvarApostaNoHistorico();
            setPrognosticos(Array(5).fill(''));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess]);

    useEffect(() => {
        if (writeError) {
            if (writeError instanceof BaseError) {
                const rootCause = writeError.walk();
                setUiMessage({ text: rootCause.message, type: 'error' });
            } else {
                setUiMessage({ text: 'Ocorreu um erro inesperado.', type: 'error' });
            }
        }
    }, [writeError]);

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

    const salvarApostaNoHistorico = () => {
        if (typeof rodadaAtualId !== 'bigint' || typeof ticketPrice !== 'bigint') return;
        const novaAposta: SavedBet = {
            id: hash || Date.now().toString(),
            rodadaId: Number(rodadaAtualId),
            prognosticos: prognosticos,
            valor: formatarValor(ticketPrice)
        };
        const novoHistorico = [novaAposta, ...historicoLocal];
        setHistoricoLocal(novoHistorico);
        if (account) {
            localStorage.setItem(`historico_apostas_${account}`, JSON.stringify(novoHistorico));
        }
    };

    const handleInputChange = (index: number, value: string) => {
        if (/^[\d\/]{0,5}$/.test(value)) {
            const novosPrognosticos = [...prognosticos];
            novosPrognosticos[index] = value;
            setPrognosticos(novosPrognosticos);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setUiMessage(null);

        if (prognosticos.some(p => !/^\d{1,2}\/\d{1,2}$/.test(p))) {
            setUiMessage({ text: "Formato inválido. Use número/número (ex: 7/21).", type: 'error' });
            return;
        }

        try {
            const x = prognosticos.map(p => BigInt(p.split('/')[0])) as [bigint, bigint, bigint, bigint, bigint];
            const y = prognosticos.map(p => BigInt(p.split('/')[1])) as [bigint, bigint, bigint, bigint, bigint];

            setUiMessage({ text: 'Confirme a transação na sua carteira...', type: 'info' });
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
                
                <UiMessageCard message={uiMessage?.text ?? null} type={uiMessage?.type ?? null} />
                
                <button type="submit" disabled={!isConnected || isProcessing || !ticketPrice} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-lg disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors">
                    {isPending ? 'Aguardando na carteira...' : isConfirming ? 'Registrando aposta...' : (isConnected ? 'Submeter Aposta' : 'Conecte a Carteira')}
                </button>
            </form>

            {historicoLocal.length > 0 && (
                 <div className="mt-8 bg-slate-800/50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-white text-center mb-4">Seu Histórico Recente (Local)</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {historicoLocal.map(bet => (
                            <div key={bet.id} className="bg-slate-900 p-2 rounded-md text-sm text-center">
                                <span className="font-mono text-cyan-400">
                                    {`Rodada ${bet.rodadaId} - Prognósticos: ${bet.prognosticos.join('; ')}`}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}