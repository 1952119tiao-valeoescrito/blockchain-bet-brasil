'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { BlockchainBetBrasilAddress, BlockchainBetBrasilABI } from '@/constants/contractConfig';

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

    const contractConfig = { address: BlockchainBetBrasilAddress, abi: BlockchainBetBrasilABI };
    const { data: rodadaAtualId } = useReadContract({ ...contractConfig, functionName: 'rodadaAtualId' });
    const { data: ticketPrice } = useReadContract({ ...contractConfig, functionName: 'ticketPriceBase' });
    const { writeContract, isPending } = useWriteContract();

    useEffect(() => {
        if (account) {
            const historicoSalvo = localStorage.getItem(`historico_apostas_${account}`);
            if (historicoSalvo) setHistoricoLocal(JSON.parse(historicoSalvo));
        }
    }, [account]);

    const formatarValor = (valor: bigint | undefined): string => {
        if (typeof valor === 'undefined') {
            return 'Carregando...';
        }
        return formatEther(valor);
    };

    const salvarApostaNoHistorico = () => {
        const novaAposta: SavedBet = {
            id: Date.now().toString(),
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
        if (/^[\d\/]*$/.test(value) && value.length <= 5) {
            const novosPrognosticos = [...prognosticos];
            novosPrognosticos[index] = value;
            setPrognosticos(novosPrognosticos);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (prognosticos.some(p => !/^\d{1,2}\/\d{1,2}$/.test(p))) {
            alert("Formato inválido. Use o formato número/número (ex: 15/18) em todos os campos.");
            return;
        }

        const x = prognosticos.map(p => Number(p.split('/')));
        const y = prognosticos.map(p => Number(p.split('/')));

        writeContract({
            ...contractConfig,
            functionName: 'apostar',
            args: [x, y],
            value: ticketPrice,
        }, {
            onSuccess: () => {
                alert('Aposta registrada com sucesso!');
                salvarApostaNoHistorico();
                setPrognosticos(Array(5).fill(''));
            },
            onError: (err) => alert(`Erro ao apostar: ${err.message || "Ocorreu um erro."}`)
        });
    };

    return (
        <div className="w-full max-w-2xl" id="bet-form">
            <form onSubmit={handleSubmit} className="bg-slate-800/50 p-6 rounded-lg space-y-4">
                 <div className="text-center">
                    <h3 className="text-2xl font-bold text-white">Faça sua Aposta</h3>
                    <p className="text-gray-400 mt-1">Preencha os 5 campos com seus prognósticos no formato x/y.</p>
                </div>
                
                <div className="grid grid-cols-5 gap-3">
                    {prognosticos.map((p, index) => (
                        <div key={index} className="text-center">
                            <label className="text-sm text-gray-300">{index + 1}º Prêmio</label>
                            <input
                                type="text"
                                value={p}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                placeholder="ex: 15/18"
                                className="w-full mt-1 bg-slate-900 border border-slate-600 rounded-md py-2 px-1 text-white text-center font-mono focus:ring-2 focus:ring-cyan-500"
                                disabled={isPending}
                            />
                        </div>
                    ))}
                </div>

                <div>
                    <label className="text-sm text-gray-300">Valor da Aposta (em MATIC)</label>
                    <input type="text" readOnly value={formatarValor(ticketPrice)} className="w-full mt-1 bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white font-mono" />
                </div>
                <button type="submit" disabled={!isConnected || isPending || !ticketPrice} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-lg disabled:bg-slate-500 disabled:cursor-not-allowed">
                    {isPending ? 'Enviando...' : (isConnected ? 'Submeter Aposta' : 'Conecte a Carteira')}
                </button>
            </form>

            {historicoLocal.length > 0 && (
                 <div className="mt-8 bg-slate-800/50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-white text-center mb-4">Seu Histórico Local de Apostas</h3>
                    <div className="space-y-2">
                        {historicoLocal.slice().reverse().map(bet => (
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