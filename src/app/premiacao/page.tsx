// src/app/premiacao/page.tsx

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Como Jogar e Premiação | Blockchain Bet Brasil',
  description: 'Entenda as regras, a distribuição de prêmios e como funciona a Blockchain Bet Brasil.',
};

export default function ComoJogarPage() {
  return (
    <div className="bg-slate-800 p-6 md:p-10 rounded-lg shadow-lg max-w-4xl w-full text-slate-300">
      <h1 className="text-4xl font-bold mb-6 text-center text-white">
        Como Funciona a Blockchain Bet Brasil
      </h1>
      <p className="text-center text-lg mb-10">
        Nosso compromisso é com a transparência e a justiça, utilizando a tecnologia blockchain para garantir um jogo seguro e auditável.
      </p>

      <div className="space-y-8">
        
        {/* Seção de Premiação */}
        <section>
          <h2 className="text-3xl font-semibold mb-4 pb-2 border-b border-slate-600 text-white">
            Distribuição do Prêmio
          </h2>
          <p className="mb-4">
            O montante total destinado à premiação dos jogadores corresponde a <strong>95% de toda a arrecadação bruta</strong> de cada concurso. Os 5% restantes são utilizados para cobrir os custos operacionais da plataforma e o reinvestimento na comunidade.
          </p>
          <div className="bg-slate-900/50 p-6 rounded-md space-y-3">
            <p><strong><span className="text-green-400">●</span> 5 Acertos (Quina):</strong> 50% do prêmio</p>
            <p><strong><span className="text-blue-400">●</span> 4 Acertos (Quadra):</strong> 20% do prêmio</p>
            <p><strong><span className="text-purple-400">●</span> 3 Acertos (Terno):</strong> 15% do prêmio</p>
            <p><strong><span className="text-yellow-400">●</span> 2 Acertos (Duque):</strong> 10% do prêmio</p>
            <p><strong><span className="text-orange-400">●</span> 1 Acerto (Ponto):</strong> 5% do prêmio</p>
          </div>
          <p className="text-sm mt-4 text-slate-400">
            * Todos os acertos são baseados nos resultados do 1º ao 5º prêmio da extração oficial da Loteria Federal do Brasil.
          </p>
        </section>

        {/* Seção de Regra de Acumulação */}
        <section>
          <h2 className="text-3xl font-semibold mb-4 pb-2 border-b border-slate-600 text-white">
            Regra de Acumulação
          </h2>
          <p>
            E se não houver ganhadores em uma faixa? O prêmio <strong>não acumula para o próximo concurso</strong>, ele desce para a faixa de premiação inferior! Por exemplo, se ninguém fizer 5 pontos, o prêmio dessa faixa é somado ao prêmio de 4 pontos, beneficiando diretamente os jogadores da rodada atual.
          </p>
        </section>

        {/* Seção de Perguntas Frequentes */}
        <section>
          <h2 className="text-3xl font-semibold mb-4 pb-2 border-b border-slate-600 text-white">
            Perguntas Frequentes (FAQ)
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-slate-100">Qual o prazo para receber o prêmio?</h3>
              <p>Recomendamos que o resgate (claim) do prêmio seja feito em até <strong>90 dias</strong>. A tecnologia blockchain permite que você reivindique seus ganhos a qualquer momento diretamente pela sua carteira conectada ao site.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">Quando e onde são realizados os sorteios?</h3>
              <p>Nossos resultados são 100% baseados nas extrações oficiais da <strong>Loteria Federal do Brasil</strong>. Os concursos são periódicos e alinhados com o calendário da Loteria Federal.</p>
            </div>
          </div>
        </section>

        {/* Seção de Aviso Importante */}
        <section className="mt-12 p-6 border-2 border-yellow-500/50 bg-yellow-900/20 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-yellow-300 mb-3">AVISO IMPORTANTE</h3>
            <p className="text-yellow-100">
                Sua aposta é um registro imutável na blockchain, vinculado à sua carteira. A posse da sua carteira é a <strong>única garantia para o resgate do prêmio</strong>. Guarde suas chaves privadas e sua seed phrase com segurança máxima.
            </p>
        </section>

      </div>
    </div>
  );
}