// Localização: src/app/como-jogar/page.tsx

// Importação opcional para metadados da página
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Como Jogar - Blockchain Bet Brasil',
  description: 'Aprenda o passo a passo para fazer sua aposta e concorrer a prêmios na loteria Web3 mais transparente do Brasil.',
};

// Componente de Estilização para as Seções (reutilizável)
function InfoSection({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <section className=&quot;bg-slate-800/50 p-6 rounded-lg shadow-lg&quot;>
            <h2 className=&quot;text-2xl font-bold text-blue-400 mb-4 border-b-2 border-blue-500 pb-2&quot;>
                {title}
            </h2>
            <div className=&quot;prose prose-invert max-w-none text-slate-300&quot;>
                {children}
            </div>
        </section>
    );
}

export default function HowToPlayPage() {
  return (
    <div className=&quot;w-full max-w-4xl mx-auto flex flex-col gap-8 text-left&quot;>
        <div className=&quot;text-center&quot;>
            <h1 className=&quot;text-4xl font-bold&quot;>Como Apostar na Blockchain Bet Brasil</h1>
            <p className=&quot;mt-2 text-lg text-gray-400&quot;>É simples, rápido e 100% transparente. Siga o guia!</p>
        </div>

        <InfoSection title=&quot;Guia Rápido: 4 Passos Para a Vitória&quot;>
            <ol className=&quot;list-decimal list-inside space-y-4&quot;>
                <li>
                    <strong>Conecte sua Carteira Digital:</strong> Primeiro, clique em &quot;Conectar Carteira&quot; no topo do site. Você precisa de uma carteira como a MetaMask para jogar e receber seus prêmios.
                </li>
                <li>
                    <strong>Monte sua Aposta:</strong> No formulário, preencha os 5 campos com seus prognósticos no formato X/Y (ex: 23/2), onde X e Y são números de 1 a 25. Em seguida, defina o valor da aposta em ETH/MATIC.
                </li>
                <li>
                    <strong>Submeta e Confirme:</strong> Clique em &quot;Submeter Aposta&quot; e aprove a transação que aparecerá na sua carteira. Sua aposta será registrada de forma segura e imutável na blockchain.
                </li>
                <li>
                    <strong>Acompanhe e Reivindique:</strong> Após o sorteio, volte ao site para ver os resultados. Se for um vencedor com 5, 4, 3, 2 ou 1 ponto apenas, um botão &quot;Reivindicar Prêmio&quot; aparecerá para você transferir seus ganhos diretamente para sua carteira.
                </li>
            </ol>
        </InfoSection>

        <InfoSection title=&quot;Entendendo o Jogo: A Magia da Transparência&quot;>
            <h4>O que é um &quot;Token de Aposta&quot;?</h4>
            <p>Cada aposta com 5 prognósticos que você faz é como um bilhete único, um &quot;token&quot; que representa sua participação no sorteio.</p>
            
            <h4>Como os Resultados são Gerados?</h4>
            <p>Utilizamos os 5 milhares sorteados aos sabados, pela Loteria Oficial do Brasil, que são processados pelo nosso Smart Contract em conjunto com a tecnologia <strong>Chainlink VRF (Verifiable Random Function)</strong>. Isso garante que os resultados finais (X/Y) sejam aleatórios, seguros e impossíveis de manipular.</p>

            <h4>Por que na Blockchain?</h4>
            <p><strong>Segurança e Justiça:</strong> Todo o processo é executado por um Smart Contract, sem intervenção humana. As regras são as mesmas para todos e não podem ser alteradas. <strong>Transparência Total:</strong> Qualquer pessoa pode auditar as transações e os resultados no Etherscan. <strong>Pagamentos Instantâneos:</strong> Você tem total controle sobre seus prêmios e os recebe em segundos.</p>
        </InfoSection>
        
        <InfoSection title=&quot;Aumente Suas Chances!&quot;>
             <p>Não há limites! Você pode fazer quantas apostas desejar em cada rodada. Mais &quot;tokens&quot; na disputa significam mais chances de ser um dos nossos grandes vencedores, quer seja com 5, 4, 3, 2 ou 1 ponto apenas. Boa sorte!</p>
        </InfoSection>

    </div>
  );
}