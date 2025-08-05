// app/admin/page.tsx

'use client'; // Obrigatório para usar hooks como useState

import React, { useState } from 'react';
import { AdminPanel } from '@/components/AdminPanel'; // Note as chaves {}
import { AdminPanelProps } from '@/components/AdminPanel'; // Precisamos do tipo das props

const AdminPage = () => {
  // --- CRIANDO OS "ESTADOS" (O CÉREBRO DA PÁGINA) ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uiMessage, setUiMessage] = useState('');
  const [uiMessageType, setUiMessageType] = useState<'success' | 'error' | 'info'>('info');
  
  // Adicione quaisquer outros estados que o AdminPanelProps precise.
  // Por exemplo, se ele precisar controlar os resultados e a rodada:
  const [results, setResults] = useState('');
  const [roundId, setRoundId] = useState('');


  return (
    <main className="container mx-auto py-8">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-white text-center">
          Painel de Administração - Blockchain BetBrasil
        </h1>
        
        {/* --- CONECTANDO OS "FIOS" (PASSANDO AS PROPS) --- */}
        <AdminPanel
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          uiMessage={uiMessage}
          setUiMessage={setUiMessage}
          uiMessageType={uiMessageType}
          setUiMessageType={setUiMessageType}
          // Passe as outras props aqui
          results={results}
          setResults={setResults}
          roundId={roundId}
          setRoundId={setRoundId}
        />

      </div>
    </main>
  );
};

export default AdminPage;