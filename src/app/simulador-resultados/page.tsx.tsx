// /src/app/simulador-resultados/page.tsx

// 1. Importamos o componente que você já tem pronto
import ResultSimulator from '@/components/ResultSimulator';
import type { Metadata } from 'next';

// 2. Definimos um título e descrição para a aba do navegador (bom para SEO)
export const metadata: Metadata = {
  title: 'Simulador de Resultados - Blockchain Bet Brasil',
  description: 'Teste a conversão de qualquer milhar da Loteria Federal para o formato de prognóstico X/Y do nosso jogo.',
};

// 3. Este é o componente da PÁGINA, que simplesmente renderiza o seu componente SIMULADOR
export default function SimuladorPage() {
  return (
    <ResultSimulator />
  );
}