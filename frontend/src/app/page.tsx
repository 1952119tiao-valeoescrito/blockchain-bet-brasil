// Caminho: /src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import PainelDeAposta from "@/components/PainelDeAposta";
import PainelDeResultados from "@/components/PainelDeResultados";
import PainelInformativo from '@/components/PainelInformativo';
import SeletorDeRodada from '@/components/SeletorDeRodada';
import CountdownTimer from '@/components/CountdownTimer'; // O relógio que criamos
import { useLotteryInfo } from '@/hooks/useLotteryInfo';

export default function ApostasPage() {
  // O estado da rodada selecionada vive aqui, na página principal.
  const [rodadaSelecionada, setRodadaSelecionada] = useState(0);
  const { rodadaAtualId, isLoading } = useLotteryInfo();

  // Efeito para selecionar automaticamente a rodada mais recente quando a página carregar.
  useEffect(() => {
    if (rodadaAtualId > 0 && rodadaSelecionada === 0) {
      setRodadaSelecionada(rodadaAtualId);
    }
  }, [rodadaAtualId, rodadaSelecionada]);

  // Enquanto carrega o ID da rodada atual, mostramos uma mensagem
  if (isLoading && rodadaSelecionada === 0) {
    return <div className="text-center p-10">Carregando informações da loteria...</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">

      <div className="mb-8 max-w-lg mx-auto">
        <CountdownTimer />
      </div>

      <PainelInformativo />

      <hr className="my-8 border-gray-700" />

      <SeletorDeRodada 
        rodadaSelecionada={rodadaSelecionada}
        onRodadaChange={setRodadaSelecionada} // Passamos a função para atualizar o estado
      />

      {/* Renderiza os painéis apenas se uma rodada válida for selecionada */}
      {rodadaSelecionada > 0 ? (
        <div className="panels-container mt-8 grid md:grid-cols-2 gap-8">
          <section>
            <PainelDeAposta rodadaId={rodadaSelecionada} />
          </section>

          <section>
            <PainelDeResultados rodadaId={rodadaSelecionada} />
          </section>
        </div>
      ) : (
        <div className="text-center p-10">Selecione uma rodada para ver os detalhes.</div>
      )}
    </div>
  );
}