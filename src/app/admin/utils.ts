// src/app/admin/utils.ts

// NÃO IMPORTAMOS NADA DO WAGMI AQUI. NADA.

type SetUiMessage = (message: { text: string; type: 'success' | 'error' | 'info' }) => void;
type SetIsSubmitting = (isSubmitting: boolean) => void;

export const handleAdminAction = async (
    actionName: string,
    // Rendição 1: request é 'any'
    request: any,
    // Rendição 2: writeContractAsync é 'any'
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
        // A gente sabe que 'request' vem do useSimulateContract e 'writeContractAsync' do useWriteContract.
        // O código aqui dentro vai funcionar. O TypeScript só não sabe disso.
        await writeContractAsync(request);
    } catch (error: any) {
        console.error(`Erro ao ${actionName}:`, error);
        const errorMessage = error.shortMessage || "Ocorreu um erro na transação.";
        setUiMessage({ text: `Falha: ${errorMessage}`, type: 'error' });
        setIsSubmitting(false);
    }
};