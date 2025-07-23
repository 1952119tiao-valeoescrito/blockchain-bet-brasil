// Localização: src/app/como-jogar/page.tsx

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Como Jogar - Blockchain Bet Brasil',
  description: 'Aprenda o passo a passo para fazer sua aposta e concorrer a prêmios na loteria Web3 mais transparente do Brasil.',
};

function InfoSection({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <section className="bg-slate-800/50 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-blue-400 mb-4 border-b-2 border-blue-500 pb-2">
                {title}
            </h2>
            <div className="prose prose-invert max-w-none text-slate-300">
                {children}
            </div>
        </section>
    );
}

export default function HowToPlayPage() {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 text-left">
        <div className="text-center">
            <h1 className="text-4xl font-bold">Como Apostar na Blockchain Bet Brasil</h1>
            <p className="mt-2 text-lg text-gray-400">É simples, rápido e 100% transparente. Siga o guia!</p>
        </div>
        <InfoSection title="Guia Rápido: 4 Passos Para a Vitória">
            <ol className="list-decimal list-inside space-y-4">
                <li>
                    <strong>Conecte sua Carteira Digital:</strong> Primeiro, clique em "Conectar Carteira" no topo do site. Você precisa de uma carteira como a MetaMask para jogar e receber seus prêmios.
                </li>
                <li>
                    <strong>Monte sua Aposta:</strong> No formulário, preencha os 5 campos com seus prognósticos no formato X/Y (ex: 23/2), onde X e Y são números de 1 a 25. Em seguida, defina o valor da aposta em ETH/MATIC.
                </li>
                <li>
                    <strong>Submeta e Confirme:</strong> Clique em "Submeter Aposta" e aprove a transação que aparecerá na sua carteira. Sua aposta será registrada de forma segura e imutável na blockchain.
                </li>
                <li>
                    <strong>Acompanhe e Reivindique:</strong> Após o sorteio, volte ao site para ver os resultados. Se for um vencedor com 5, 4, 3, 2 ou 1 ponto apenas, um botão "Reivindicar Prêmio" aparecerá para você transferir seus ganhos diretamente para sua carteira.
                </li>
            </ol>
        </InfoSection>
        <InfoSection title="Entendendo o Jogo: A Magia da Transparência">
            <h4>O que é um "Token de Aposta"?</h4>
            <p>Cada aposta com 5 prognósticos que você faz é como um bilhete único, um "token" que representa sua participação no sorteio.</p>
            <h4>Como os Resultados são Gerados?</h4>
            <p>Utilizamos os 5 milhares sorteados aos sabados, pela Loteria Oficial do Brasil, que são processados pelo nosso Smart Contract em conjunto com a tecnologia <strong>Chainlink VRF (Verifiable Random Function)</strong>. Isso garante que os resultados finais (X/Y) sejam aleatórios, seguros e impossíveis de manipular.</p>
            <h4>Por que na Blockchain?</h4>
            <p><strong>Segurança e Justiça:</strong> Todo o processo é executado por um Smart Contract, sem intervenção humana. As regras são as mesmas para todos e não podem ser alteradas. <strong>Transparência Total:</strong> Qualquer pessoa pode auditar as transações e os resultados no Etherscan. <strong>Pagamentos Instantâneos:</strong> Você tem total controle sobre seus prêmios e os recebe em segundos.</p>
        </InfoSection>
        <InfoSection title="Aumente Suas Chances!">
             <p>Não há limites! Você pode fazer quantas apostas desejar em cada rodada. Mais "tokens" na disputa significam mais chances de ser um dos nossos grandes vencedores, quer seja com 5, 4, 3, 2 ou 1 ponto apenas. Boa sorte!</p>
        </InfoSection>
    </div>
  );
}