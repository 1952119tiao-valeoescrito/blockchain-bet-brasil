// src/components/admin/utils.ts

import { WriteContractMutateAsync } from 'wagmi/query';
import { UseSimulateContractReturnType } from 'wagmi'; 

type SetUiMessage = (message: { text: string; type: 'success' | 'error' | 'info' }) => void;
type SetIsSubmitting = (isSubmitting: boolean) => void;

export const handleAdminAction = async (
    actionName: string,
    request: useSimulateContractReturnType['request'] | undefined,
    writeContractAsync: WriteContractMutateAsync<any, any>,
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
   } catch (err: unknown) { // 1. Use 'unknown' em vez de 'any'
    setIsSubmitting(false);
    let errorMessage = "Ocorreu um erro desconhecido.";

    // 2. Verifica se o erro é de fato um objeto de Erro
    if (err instanceof Error) {
        // As propriedades de erro do wagmi/viem não são padrão do tipo Error,
        // então um 'as any' aqui é um mal menor e localizado.
        errorMessage = (err as any).shortMessage || err.message;
    }
    
    console.error(`Erro ao ${actionName}:`, err);
    setUiMessage({ text: `Falha: ${errorMessage}`, type: 'error' });
}