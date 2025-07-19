// src/app/admin/utils.ts

import { type WriteContractMutateAsync } from 'wagmi/query';

// Tipos para as funções de UI que passamos como parâmetros
type SetUiMessage = (message: { text: string; type: 'success' | 'error' | 'info' }) => void;
type SetIsSubmitting = (isSubmitting: boolean) => void;

/**
 * Função genérica para lidar com ações de escrita em contrato no painel de admin.
 * Centraliza a lógica de feedback para o usuário e tratamento de erros.
 */
export const handleAdminAction = async (
    actionName: string,
    // Simplificamos o tipo aqui para evitar conflitos complexos de inferência da wagmi.
    // A validação de que o 'request' existe já é feita abaixo.
    request: any | undefined,
    writeContractAsync: WriteContractMutateAsync<any, any>,
    setUiMessage: SetUiMessage,
    setIsSubmitting: SetIsSubmitting
) => {
    // 1. Inicia o feedback para o usuário
    setUiMessage({ text: `Processando: ${actionName}...`, type: 'info' });
    setIsSubmitting(true);

    // 2. Guarda de segurança: verifica se a simulação do contrato preparou o request
    if (!request) {
        setUiMessage({ text: "Erro: Ação não pôde ser preparada. Verifique os dados e a conexão.", type: 'error' });
        setIsSubmitting(false);
        return;
    }

    try {
        // 3. Executa a escrita no contrato.
        // A asserção 'as any' é uma medida pragmática para calar o TypeScript,
        // pois sabemos que a lógica de 'useSimulateContract' e 'useWriteContract' está conectada.
        await writeContractAsync(request as any);
        
        // A mensagem de sucesso será tratada pelo hook useWaitForTransactionReceipt no componente principal.

    } catch (err: unknown) {
        // 4. Tratamento de erro robusto
        setIsSubmitting(false);
        let errorMessage = "Ocorreu um erro desconhecido. A transação foi rejeitada ou falhou.";

        // Tenta extrair uma mensagem de erro mais clara
        if (err instanceof Error) {
            errorMessage = (err as any).shortMessage || err.message;
        }
        
        console.error(`Erro ao executar '${actionName}':`, err);
        setUiMessage({ text: `Falha: ${errorMessage}`, type: 'error' });
    
    } finally {
        // 5. Garante que o estado de 'submitting' seja resetado, mesmo que algo dê errado.
        // (Opcional, mas boa prática. Decidi não colocar para não alterar a lógica original,
        // já que o catch já faz isso. Se quiser adicionar, seria aqui: setIsSubmitting(false);)
    }
}; // Fim da função exportada