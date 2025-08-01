// src/components/AdminRoundControls.tsx

"use client"; // Necessário para usar hooks

// A importação correta, sem ambiguidades, usando o alias @
import AdminWriteButton from '@/components/AdminWriteButton';

export default function AdminRoundControls() {
  // Agora vamos realmente USAR o botão que importamos
  return (
    <div className="bg-slate-700 p-4 rounded-lg space-y-4">
      <h2 className="text-xl font-bold mb-4">Painel de Controle do Admin</h2>

      <AdminWriteButton
        functionName="startNewRound" // Coloque o nome da função do seu contrato
        message="Iniciar Nova Rodada"
        args={[]} // Deixe vazio se a função não precisar de argumentos
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