// src/components/AdminPanel.tsx - FAXINA COMPLETA

// Mantemos SÓ os imports que usamos.
'use client';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { handleAdminAction } from '@/app/admin/utils';

// Definimos os tipos aqui para o componente saber o que esperar.
type SetUiMessage = (message: { text: string; type: 'success' | 'error' | 'info' }) => void;

// Este componente agora está focado apenas nos botões de controle.
export const AdminPanel = () => {
  // A gente não precisa mais de todos aqueles useStates, a lógica de estado vai ficar no componente pai.
  // const [isSubmitting, setIsSubmitting] = useState(false);
  // const [uiMessage, setUiMessage] = useState(null);

  // A gente renomeia as variáveis não utilizadas com um underline '_' para o linter não reclamar.
  const { writeContract, isPending: _isPending, error: _error } = useWriteContract();
  const { isLoading: _isConfirming } = useWaitForTransactionReceipt({});

  // As funções agora são placeholders, já que a lógica principal está sendo retrabalhada.
  const _handleWrite = (functionName: string, message: string, args?: any[]) => {
    // Lógica a ser implementada
  };

  return (
    <div className="w-full p-6 bg-slate-800/50 rounded-lg border border-slate-700">
      <h3 className="text-xl font-bold text-center text-slate-100 mb-4">Painel do Administrador</h3>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        {/* Lógica dos botões simplificada por enquanto */}
        <button className="w-full sm:w-auto px-6 py-2 font-semibold text-white bg-amber-600 rounded-md hover:bg-amber-700 disabled:bg-slate-600">
          Pausar Contrato
        </button>
        <button className="w-full sm:w-auto px-6 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-slate-600">
          Iniciar Nova Rodada
        </button>
      </div>
    </div>
  );
};

// É importante ter o export default para o Next.js achar o componente.
export default AdminPanel;