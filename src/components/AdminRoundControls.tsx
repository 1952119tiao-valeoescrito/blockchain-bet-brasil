// src/components/AdminRoundControls.tsx

"use client"; // Importante para os hooks do wagmi

import AdminWriteButton from '@/components/AdminWriteButton'; // A importação correta que você descobriu!

export default function AdminRoundControls() {
  return (
    <div className="bg-slate-700 p-4 rounded-lg space-y-4">
      <h2 className="text-xl font-bold mb-4">Painel de Controle do Admin</h2>

      {/* Exemplo de como usar o seu botão para iniciar uma rodada */}
      <AdminWriteButton
        functionName="startNewRound" // O nome da função no seu contrato
        message="Iniciar Nova Rodada"
        args={[]} // Argumentos da função, se houver. Deixe vazio se não tiver.
        onSuccess={() => alert('Nova rodada iniciada com sucesso!')} // O que fazer depois do sucesso
        className="bg-green-500 hover:bg-green-600"
      />

      {/* Exemplo de outro botão, para pagar os vencedores */}
      <AdminWriteButton
        functionName="payoutWinners"
        message="Pagar Vencedores da Última Rodada"
        args={[]}
        onSuccess={() => alert('Vencedores pagos!')}
        className="bg-blue-500 hover:bg-blue-600"
      />

      {/* Adicione quantos botões precisar para as funções do seu contrato */}
    </div>
  );
}