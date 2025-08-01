// src/components/AdminRoundControls.tsx

"use client"; // Necessário para usar componentes interativos

// AQUI ESTÁ A LINHA! Estamos na "caixa de ferramentas" (AdminRoundControls)
// e estamos PEGANDO a "ferramenta" (AdminWriteButton).
import AdminWriteButton from '@/components/AdminWriteButton';

export default function AdminRoundControls() {
  return (
    <div className="bg-slate-700 p-4 rounded-lg space-y-4">
      <h2 className="text-xl font-bold text-yellow-300">Painel de Controle Final</h2>

      {/* Agora usamos a ferramenta que pegamos */}
      <AdminWriteButton
        functionName="startNewRound"
        message="Iniciar Nova Rodada"
        args={[]}
        onSuccess={() => alert('Rodada iniciada!')}
        className="bg-green-500 hover:bg-green-600"
      />

      <AdminWriteButton
        functionName="payoutWinners"
        message="Pagar Vencedores"
        args={[]}
        onSuccess={() => alert('Vencedores pagos!')}
        className="bg-blue-500 hover:bg-blue-600"
      />
    </div>
  );
}