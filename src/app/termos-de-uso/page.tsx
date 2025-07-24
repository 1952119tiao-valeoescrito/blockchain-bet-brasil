// src/app/termos-de-uso/page.tsx - VERSÃO FINAL E PROFISSIONAL

import type { Metadata } from 'next';

// Componente auxiliar para padronizar cada cláusula. Deixa o código principal muito mais limpo.
function ClauseSection({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <section> {/* Usamos <section> para melhor semântica HTML */}
            <h2 className="text-2xl font-semibold mb-2 text-white">{title}</h2>
            <div className="text-slate-300 space-y-4">
                {children}
            </div>
        </section>
    );
}

// Metadata para SEO. Perfeito como você fez.
export const metadata: Metadata = {
    title: 'Termos de Uso | Blockchain Bet Brasil',
    description: 'Leia os nossos Termos e Condições de Uso.'
};

export default function TermosDeUsoPage() {
    return (
        <div className="bg-slate-800/50 p-8 rounded-lg shadow-lg max-w-4xl w-full">
            <h1 className="text-3xl font-bold mb-6 text-center text-white">Termos e Condições de Uso</h1>

            <div className="space-y-8"> {/* Aumentamos o espaço entre as cláusulas para melhor leitura */}
                <div className="text-center text-slate-400">
                    <p><strong>Data da Última Atualização:</strong> 07 de Julho de 2025</p>
                </div>

                <p className="text-slate-300">
                    Bem-vindo(a) à <strong>Blockchain Bet Brasil</strong>! Estes Termos e Condições de Uso ('Termos') regem o seu acesso e utilização do nosso site. Ao acessar ou utilizar nosso Site, você ('Usuário') declara ter lido, compreendido e concordado em se vincular a estes Termos.
                </p>

                <ClauseSection title="Cláusula 1 – Elegibilidade">
                    <p>O acesso e uso dos serviços são estritamente limitados a indivíduos com 18 anos de idade ou mais. Ao utilizar o Site, você declara e garante possuir a idade mínima e a capacidade legal para aceitar estes Termos.</p>
                </ClauseSection>

                <ClauseSection title="Cláusula 2 – Objeto e Natureza dos Serviços">
                    <p>A Blockchain Bet Brasil fornece conteúdo informativo e educacional sobre tecnologia blockchain e temas correlatos. <strong>IMPORTANTE:</strong> O conteúdo NÃO constitui, em nenhuma hipótese, aconselhamento de investimento, financeiro ou jurídico.</p>
                </ClauseSection>

                <ClauseSection title="Cláusula 9 – Lei Aplicável e Foro">
                    <p>Estes Termos serão regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da Comarca da Capital do Estado do Rio de Janeiro, RJ - Brasil, para dirimir quaisquer controvérsias.</p>
                </ClauseSection>

                <ClauseSection title="Cláusula 10 – Contato">
                    <p>
                        Se tiver dúvidas sobre estes Termos, entre em contato conosco pelo e-mail: {' '}
                        {/* Melhoria de UX: O e-mail agora é um link clicável */}
                        <a href="mailto:suporte@valeoescrito.com.br" className="font-semibold text-cyan-400 hover:underline">
                            suporte@valeoescrito.com.br
                        </a>.
                    </p>
                </ClauseSection>

                {/* Adicione as outras cláusulas aqui seguindo o mesmo padrão, fica muito mais organizado! */}
            </div>
        </div>
    );
}