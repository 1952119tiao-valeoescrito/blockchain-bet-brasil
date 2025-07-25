// src/components/BettingForm.tsx - FAXINA COMPLETA
'use client';

import { useState, useEffect, FormEvent, useCallback } from 'react'; // Importamos o useCallback
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
    const { address: account, isConnected } = useAccount();
    
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
            setUiMessage({ text: writeError.message || 'Erro ao enviar aposta.', type: 'error' });
        }
    }, [writeError]);

    // A gente envolve a função em 'useCallback' para que ela não seja recriada a cada renderização.
    // Isso resolve o problema de dependência do useEffect de forma otimizada.
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
    }, [account, hash, historicoLocal, prognosticos, rodadaAtualId, ticketPrice]); // Declaramos todas as dependências da função

    useEffect(() => {
        if (isSuccess) {
            setUiMessage({ text: 'Aposta registrada com sucesso!', type: 'success' });
            salvarApostaNoHistorico();
            setPrognosticos(Array(5).fill(''));
        }
    }, [isSuccess, salvarApostaNoHistorico]); // Agora a dependência está correta!

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

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setUiMessage(null);

        if (prognosticos.some(p => !/^\d{1,2}\/\d{1,2}$/.test(p))) {
            setUiMessage({ text: "Formato inválido. Use número/número (ex: 7/21).", type: 'error' });
            return;
        }

        try {
            const x = prognosticos.map(p => BigInt(p.split('/')[0]));
            const y = prognosticos.map(p => BigInt(p.split('/')[1]));

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
        // O JSX continua o mesmo, lindo como você fez.
        <div className="w-full max-w-2xl" id="bet-form">
            {/* ... seu JSX aqui ... */}
        </div>
    );
}