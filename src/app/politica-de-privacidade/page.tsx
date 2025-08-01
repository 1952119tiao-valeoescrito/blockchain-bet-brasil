// src/app/politica-de-privacidade/page.tsx

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade | Blockchain Bet Brasil',
  description: 'Entenda como tratamos os seus dados pessoais.',
};

export default function PoliticaDePrivacidadePage() {
  return (
    <div className="bg-slate-800 p-8 rounded-lg shadow-lg max-w-4xl w-full">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Política de Privacidade</h1>
      <div className="space-y-6 text-slate-300">
        <p><strong>Data da Última Atualização:</strong> 07 de Julho de 2025</p>

        <div>
          <h2 className="text-2xl font-semibold mb-2 text-white">Cláusula 1 – Introdução e Compromisso</h2>
          <p>A <strong>Blockchain Bet Brasil</strong> está comprometida com a proteção da sua privacidade e a segurança dos seus dados, em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD).</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2 text-white">Cláusula 2 – Dados Pessoais Coletados</h2>
          <p>Coletamos dados fornecidos por você (nome, e-mail, etc.) e dados coletados automaticamente (cookies, dados de navegação) para fornecer e aprimorar nossos serviços.</p>
        </div>
        
        {/* Adicione as outras cláusulas da Política de Privacidade aqui */}

        <div>
            <h2 className="text-2xl font-semibold mb-2 text-white">Cláusula 10 – Contato</h2>
            <p>Se tiver dúvidas sobre esta Política, entre em contato conosco pelo e-mail: <strong>suporte@valeoescrito.com.br</strong>.</p>
        </div>

      </div>
    </div>
  );
}