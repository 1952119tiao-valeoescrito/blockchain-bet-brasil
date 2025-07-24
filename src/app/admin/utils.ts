// src/app/admin/utils.ts

import { WriteContractMutateAsync } from 'wagmi/query';

// A GENTE APAGOU A IMPORTAÇÃO DO TIPO PROBLEMÁTICO

type SetUiMessage = (message: { text: string; type: 'success' | 'error' | 'info' }) => void;
type SetIsSubmitting = (isSubmitting: boolean) => void;

export const handleAdminAction = async (
    actionName: string,
    // AQUI ESTÁ A MARRETA NUCLEAR. USAMOS 'any'.
    request: any,
    writeContractAsync: WriteContractMutateAsync<string, string>,
    setUiMessage: SetUiMessage,
    setIsSubmitting: SetIsSubmitting
) => {
    setUiMessage({ text: `Processando: ${actionName}...`, type: 'info' });
    setIsSubmitting(true);

    if (!request) {
        setUiMessage({ text: "Erro: Ação não pôde ser preparada. Verifique os dados.", type: 'error' });
        setIsSubmitting(false);
        return;
    }

    try {
        await writeContractAsync(request);
        // O hook useWaitForTransactionReceipt cuidará da mensagem de sucesso
    } catch (error: any) {
        console.error(`Erro ao ${actionName}:`, error);
        const errorMessage = error.shortMessage || "Ocorreu um erro na transação.";
        setUiMessage({ text: `Falha: ${errorMessage}`, type: 'error' });
        setIsSubmitting(false);
    }
};