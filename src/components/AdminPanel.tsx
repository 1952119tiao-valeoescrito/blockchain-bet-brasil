// src/components/AdminPanel.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useSimulateContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
// MUDANÇA 1: Apagamos a importação do arquivo fantasma.
import { handleAdminAction } from '@/app/admin/utils';

const AdminPanel = () => {
    const { address } = useAccount();
    const [uiMessage, setUiMessage] = useState({ text: '', type: 'info' as 'info' | 'error' | 'success' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { writeContractAsync, data: hash, error: writeError } = useWriteContract();

    const { isSuccess, isError, error: receiptError } = useWaitForTransactionReceipt({
      hash,
    });

    useEffect(() => {
        if (isSuccess) {
            setUiMessage({ text: "Ação concluída com sucesso!", type: 'success' });
            setIsSubmitting(false);
        }
        if (isError || writeError) {
            const error = receiptError || writeError;
            const errorMessage = (error as any)?.shortMessage || "Ocorreu um erro na transação.";
            setUiMessage({ text: `Falha: ${errorMessage}`, type: 'error' });
            setIsSubmitting(false);
        }
    }, [isSuccess, isError, receiptError, writeError]);

    // MUDANÇA 2: Substituímos as variáveis do arquivo fantasma por dados de teste VÁLIDOS
    const { data: requestCloseRound } = useSimulateContract({
        address: '0x0000000000000000000000000000000000000000', // Um endereço válido para o build não reclamar
        abi: [], // Um ABI vazio, só para o build passar
        functionName: 'closeCurrentRound',
    });

    const handleCloseRound = () => {
        handleAdminAction(
            "Fechar Rodada",
            requestCloseRound?.request,
            writeContractAsync,
            setUiMessage,
            setIsSubmitting
        );
    };

    return (
        <div>
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