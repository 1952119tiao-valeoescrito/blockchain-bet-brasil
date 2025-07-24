// CÓDIGO FINAL E CORRIGIDO para: src/app/termos-de-uso/page.tsx

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termos de Uso | Blockchain Bet Brasil',
  description: 'Leia os nossos Termos e Condições de Uso.',
};

export default function TermosDeUsoPage() {
  return (
    <div className="bg-slate-800 p-8 rounded-lg shadow-lg max-w-4xl w-full">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Termos e Condições de Uso</h1>
      <div className="space-y-6 text-slate-300">
        <p><strong>Data da Última Atualização:</strong> 07 de Julho de 2025</p>
        <p>Bem-vindo(a) à <strong>Blockchain Bet Brasil</strong>! Estes Termos e Condições de Uso ("Termos") regem o seu acesso e utilização do nosso site. Ao acessar ou utilizar nosso Site, você ("Usuário") declara ter lido, compreendido e concordado em se vincular a estes Termos.</p>
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-white">Cláusula 1 – Elegibilidade</h2>
          <p>O acesso e uso dos serviços são estritamente limitados a indivíduos com 18 anos de idade ou mais. Ao utilizar o Site, você declara e garante possuir a idade mínima e a capacidade legal para aceitar estes Termos.</p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-white">Cláusula 2 – Objeto e Natureza dos Serviços</h2>
          <p>A Blockchain Bet Brasil fornece conteúdo informativo e educacional sobre tecnologia blockchain e temas correlatos. <strong>IMPORTANTE:</strong> O conteúdo NÃO constitui, em nenhuma hipótese, aconselhamento de investimento, financeiro ou jurídico.</p>
        </div>
        <div>
            <h2 className="text-2xl font-semibold mb-2 text-white">Cláusula 9 – Lei Aplicável e Foro</h2>
            <p>Estes Termos serão regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da Comarca da Capital do Estado do Rio de Janeiro, RJ - Brasil, para dirimir quaisquer controvérsias.</p>
        </div>
        <div>
            <h2 className="text-2xl font-semibold mb-2 text-white">Cláusula 10 – Contato</h2>
            <p>Se tiver dúvidas sobre estes Termos, entre em contato conosco pelo e-mail: <strong>suporte@valeoescrito.com.br</strong>.</p>
        </div>
        {/* Adicione as outras cláusulas aqui seguindo o mesmo padrão */}
      </div>
    </div>
  );
}