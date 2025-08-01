// src/app/admin/utils.ts - FAXINA COMPLETA

/* eslint-disable @typescript-eslint/no-explicit-any */
// A gente desliga a regra chata de 'any' SÓ PARA ESTE ARQUIVO.

type SetUiMessage = (message: { text: string; type: 'success' | 'error' | 'info' }) => void;
type SetIsSubmitting = (isSubmitting: boolean) => void;

export const handleAdminAction = async (
    actionName: string,
    request: any,
    writeContractAsync: any,
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
    } catch (error: any) {
        console.error(`Erro ao ${actionName}:`, error);
        // Usamos 'error.message' que é mais seguro do que 'shortMessage'.
        const errorMessage = error.message || "Ocorreu um erro na transação.";
        setUiMessage({ text: `Falha: ${errorMessage}`, type: 'error' });
        setIsSubmitting(false);
    }
};