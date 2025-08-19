// src/app/simulador/page.tsx

import ResultsSimulator from '@/components/ResultsSimulator'; // Importe o componente que acabamos de criar

export default function SimulatorPage() {
  return (
    // Container para centralizar o simulador na tela
    <div className="flex flex-col items-center justify-center h-full p-4">
      <ResultsSimulator />
    </div>
  );
}