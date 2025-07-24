// src/components/AdminPanel.tsx
'use client';

// MUDANÇA 1: Importar useEffect e useState
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useSimulateContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { contractAddress, contractAbi } from '@/lib/contract';
import { handleAdminAction } from '@/app/admin/utils';

// ... (o resto dos seus componentes de UI, se houver)

const AdminPanel = () => {
    const { address } = useAccount();
    const [uiMessage, setUiMessage] = useState({ text: '', type: 'info' as 'info' | 'error' | 'success' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { writeContractAsync, data: hash, error: writeError } = useWriteContract();

    // MUDANÇA 2: A gente remove onSuccess e onError daqui de dentro
    const { isSuccess, isError, error: receiptError } = useWaitForTransactionReceipt({
      hash,
    });

    // MUDANÇA 3: A gente reage às mudanças de status AQUI FORA!
    useEffect(() => {
        if (isSuccess) {
            setUiMessage({ text: "Ação concluída com sucesso!", type: 'success' });
            setIsSubmitting(false);
            // Aqui você pode adicionar lógica para recarregar dados do contrato
        }
        if (isError || writeError) {
            const error = receiptError || writeError;
            const errorMessage = (error as any)?.shortMessage || "Ocorreu um erro na transação.";
            setUiMessage({ text: `Falha: ${errorMessage}`, type: 'error' });
            setIsSubmitting(false);
        }
    }, [isSuccess, isError, receiptError, writeError]);

    // O resto da sua lógica de simulação e chamada de função permanece aqui...
    // Exemplo:
    const { data: requestCloseRound } = useSimulateContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'closeCurrentRound',
        // args: [...], // se precisar de argumentos
    });

    const handleCloseRound = () => {
        handleAdminAction(
            "Fechar Rodada",
            requestCloseRound?.request, // A gente passa o request simulado
            writeContractAsync,
            setUiMessage,
            setIsSubmitting
        );
    };


    return (
        <div>
            {/* Seu JSX aqui */}
            <h2>Painel do Administrador</h2>
            <button onClick={handleCloseRound} disabled={isSubmitting || !requestCloseRound}>
                {isSubmitting ? 'Processando...' : 'Fechar Rodada Atual'}
            </button>
            {uiMessage.text && (
                <p style={{ color: uiMessage.type === 'error' ? 'red' : 'green' }}>
                    {uiMessage.text}
                </p>
            )}
        </div>
    );
};

export default AdminPanel;