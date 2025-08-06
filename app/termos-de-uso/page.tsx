// app/termos-de-uso/page.tsx

import React from 'react';

const TermosDeUsoPage = () => {
  return (
    // ======================================================================
    // A MÁGICA ESTÁ AQUI:
    // - min-h-screen: Garante que a página ocupe toda a altura da tela.
    // - flex, items-center, justify-center: O trio de poder do Flexbox para centralizar tudo.
    // - p-4: Um pouco de padding para telas pequenas.
    // ======================================================================
    <main className="min-h-screen flex items-center justify-center p-4">
      
      {/* Este é o card que contém o seu texto */}
      <div className="w-full max-w-4xl bg-gray-800/60 p-8 rounded-lg shadow-2xl border border-gray-700">
        
        <h1 className="text-4xl font-bold text-white text-center mb-6">
          Termos e Condições de Uso
        </h1>

        <div className="space-y-6 text-gray-300">
          <p className="text-sm text-gray-400">
            Data da Última Atualização: 07 de Julho de 2025
          </p>

          <p>
            Bem-vindo(a) à Blockchain Bet Brasil! Estes Termos e Condições de Uso ("Termos") regem o seu acesso e utilização do nosso site. Ao acessar ou utilizar nosso Site, você ("Usuário") declara ter lido, compreendido e concordado em se vincular a estes Termos.
          </p>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">Cláusula 1 – Elegibilidade</h2>
            <p>
              O acesso e uso dos serviços são estritamente limitados a indivíduos com 18 anos de idade ou mais. Ao utilizar o Site, você declara e garante possuir a idade mínima e a capacidade legal para aceitar estes Termos.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">Cláusula 2 – Objeto e Natureza dos Serviços</h2>
            <p>
              A Blockchain Bet Brasil fornece conteúdo informativo e educacional sobre tecnologia blockchain e temas correlatos. IMPORTANTE: O conteúdo NÃO constitui, em nenhuma hipótese, aconselhamento de investimento, financeiro ou jurídico.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">Cláusula 9 – Lei Aplicável e Foro</h2>
            <p>
              Estes Termos serão regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da Comarca da Capital do Estado do Rio de Janeiro, RJ - Brasil, para dirimir quaisquer controvérsias.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">Cláusula 10 – Contato</h2>
            <p>
              Se tiver dúvidas sobre estes Termos, entre em contato conosco pelo e-mail: [SEU E-MAIL DE SUPORTE].
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TermosDeUsoPage;