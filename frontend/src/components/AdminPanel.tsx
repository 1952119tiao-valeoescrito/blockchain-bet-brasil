// src/components/AdminPanel.tsx

'use client';

import React from 'react';

// --- A "PLANTA BAIXA" (PROPS) ---
// Estamos definindo o formato dos "fios" que este componente precisa
// E estamos exportando para que outras páginas possam saber qual é o formato.
export type AdminPanelProps = {
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  uiMessage: string;
  setUiMessage: React.Dispatch<React.SetStateAction<string>>;
  uiMessageType: 'success' | 'error' | 'info';
  setUiMessageType: React.Dispatch<React.SetStateAction<'success' | 'error' | 'info'>>;
  results: string;
  setResults: React.Dispatch<React.SetStateAction<string>>;
  roundId: string;
  setRoundId: React.Dispatch<React.SetStateAction<string>>;
};

// --- O COMPONENTE EM SI ---
// Note que agora ele usa a AdminPanelProps que acabamos de criar.
export const AdminPanel = ({
  isSubmitting,
  setIsSubmitting,
  uiMessage,
  setUiMessage,
  // ... outras props que você possa usar aqui
}: AdminPanelProps) => {

  // O seu código do painel de admin vai aqui.
  // Por exemplo, um formulário:
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUiMessage('Enviando dados...');
    // Lógica de envio...
    console.log("Formulário do Admin enviado!");
    setTimeout(() => {
      setIsSubmitting(false);
      setUiMessage('Operação concluída!');
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <p className="text-white">Bem-vindo ao painel de controle.</p>
      {/* Exemplo de uso das props */}
      <form onSubmit={handleSubmit}>
        {/* Seus campos de formulário aqui */}
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:bg-gray-500"
        >
          {isSubmitting ? 'Enviando...' : 'Executar Ação'}
        </button>
      </form>
      {uiMessage && <p className="text-white mt-4">{uiMessage}</p>}
    </div>
  );
};