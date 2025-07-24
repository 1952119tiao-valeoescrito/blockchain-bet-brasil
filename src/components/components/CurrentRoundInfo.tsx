// src/components/CurrentRoundInfo.tsx
'use client';

// No futuro, você usará o useContractRead aqui para buscar os dados da rodada.
// Por enquanto, vamos simular um erro para replicar a imagem.
export function CurrentRoundInfo() {
  const hasError = true; // Mude para 'false' para ver o outro estado

  return (
    <div className="w-full p-4 bg-slate-800 rounded-md border border-slate-700">
      <h3 className="font-semibold mb-2 text-slate-100">Informações da Rodada Atual #N/A</h3>
      {hasError ? (
        <p className="text-sm text-red-400">
          Não foi possível carregar informações da rodada. Tente atualizar a página ou verifique sua conexão.
        </p>
      ) : (
        <p className="text-sm text-slate-300">Dados da rodada apareceriam aqui.</p>
      )}
    </div>
  );
}