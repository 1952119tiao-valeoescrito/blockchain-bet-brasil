// src/app/simulador-resultados/page.tsx  <- ESTE É O ARQUIVO A SER ALTERADO

"use client"; // Essencial, pois vamos renderizar um Componente de Cliente.

// 1. Importamos o seu componente "inteligente" da pasta de componentes.
import ResultSimulator from '@/components/ResultSimulator';

// 2. Damos um nome claro para a função da PÁGINA.
export default function SimuladorResultadosPage() {
  
  // A página em si pode ser bem simples. Ela só precisa criar um "palco"
  // para o seu componente brilhar. Este `div` ajuda a centralizar.
  return (
    <div className="flex w-full justify-center items-start pt-8 pb-8">
      
      {/* 3. Aqui está a mágica! Colocamos o componente para ser exibido. */}
      <ResultSimulator />

    </div>
  );
}