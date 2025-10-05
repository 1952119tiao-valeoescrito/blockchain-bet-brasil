'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Web3 from 'web3';
// Importe o provedor de WalletConnect se for us├í-lo, mas para este exemplo, vamos focar no MetaMask/injected provider.
// import WalletConnectProvider from '@walletconnect/web3-provider';

interface Window {
  ethereum?: any;
}
declare const window: Window;

const WalletConnector: React.FC = () => {
    const [account, setAccount] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [chainId, setChainId] = useState<bigint | null>(null);
    const [showWalletMenu, setShowWalletMenu] = useState<boolean>(false);
    const web3Ref = useRef<Web3 | null>(null);
    const walletMenuRef = useRef<HTMLDivElement>(null);
    const connectBtnRef = useRef<HTMLButtonElement>(null);

    const showNotification = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info') => {
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-semibold transform translate-x-full transition-transform duration-300 ${
            type === 'success' ? 'bg-emerald-500' :
            type === 'error' ? 'bg-red-500' :
            type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
        }`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX-full';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }, []);

   const updateNetworkInfo = useCallback(async () => {
    if (web3Ref.current) {
        const id = await web3Ref.current.eth.getChainId();
        setChainId(id);
        if (id !== 11155111n) { // 🔽 CORREÇÃO AQUI - use 'n' para BigInt
            showNotification('Conecte-se à rede Sepolia para testes', 'warning');
        }
    }
}, [showNotification]);

    const setupEventListeners = useCallback(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts: string[]) => {
                if (accounts.length === 0) {
                    disconnect();
                } else {
                    setAccount(accounts[0]);
                    showNotification('Conta alterada', 'info');
                }
            });

            window.ethereum.on('chainChanged', (newChainId: string) => {
                setChainId(parseInt(newChainId, 16));
                showNotification('Rede alterada', 'info');
            });
        }
    }, [showNotification]);

    const connect = useCallback(async () => {
        try {
            if (typeof window.ethereum !== 'undefined') {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    web3Ref.current = new Web3(window.ethereum);
                    setIsConnected(true);
                    await updateNetworkInfo();
                    setupEventListeners();
                    showNotification('Carteira conectada com sucesso!', 'success');
                }
            } else {
                showNotification('MetaMask n├úo encontrado! Instale a extens├úo.', 'error');
            }
        } catch (error) {
            console.error('Erro ao conectar carteira:', error);
            showNotification('Erro ao conectar carteira', 'error');
        }
    }, [updateNetworkInfo, setupEventListeners, showNotification]);

    const disconnect = useCallback(() => {
        setIsConnected(false);
        setAccount(null);
        web3Ref.current = null;
        setChainId(null);
        setShowWalletMenu(false);
        showNotification('Carteira desconectada', 'info');
    }, [showNotification]);

    const checkExistingConnection = useCallback(async () => {
        if (typeof window.ethereum !== 'undefined') {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                setAccount(accounts[0]);
                web3Ref.current = new Web3(window.ethereum);
                setIsConnected(true);
                await updateNetworkInfo();
                setupEventListeners();
            }
        }
    }, [updateNetworkInfo, setupEventListeners]);

    useEffect(() => {
        checkExistingConnection();
    }, [checkExistingConnection]);

    const toggleConnection = async () => {
        if (isConnected) {
            setShowWalletMenu(!showWalletMenu);
        } else {
            await connect();
        }
    };

    const viewOnBlockExplorer = () => {
        if (account) {
            const explorerUrl = `https://sepolia.etherscan.io/address/${account}`;
            window.open(explorerUrl, '_blank');
        }
    };

    const handleMainAction = () => {
        if (!isConnected) {
            connect();
        } else {
            investNow();
        }
    };

    const investNow = () => {
        if (isConnected) {
            showNotification('Redirecionando para o painel de investimentos...', 'success');
            // window.location.href = '/investimentos';
        }
    };

    // Fechar menu ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                walletMenuRef.current &&
                !walletMenuRef.current.contains(event.target as Node) &&
                connectBtnRef.current &&
                !connectBtnRef.current.contains(event.target as Node)
            ) {
                setShowWalletMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const formattedAddress = account ? `${account.substring(0, 6)}...${account.substring(38)}` : '';

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100">
            {/* Cabe├ºalho */}
            <header className="w-full bg-slate-800 shadow-md sticky top-0 z-50 border-b border-emerald-500/30">
                <div className="container mx-auto flex justify-between items-center p-4">
                    <a href="#" className="flex items-center gap-4 group">
                        <img alt="Blockchain Bet Brasil Logo" loading="lazy" width="48" height="48" className="rounded-full group-hover:scale-110 transition-transform duration-300 border-2 border-emerald-400 p-0.5" src="https://placehold.co/48x48/0d2c20/ffffff?text=B" />
                        <div className="hidden sm:flex items-baseline gap-2">
                            <span className="text-2xl font-extrabold text-white uppercase tracking-wider">
                                Blockchain Bet Brasil
                            </span>
                            <span className="text-sm text-emerald-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                *DOSSI├è*
                            </span>
                        </div>
                    </a>
                    <nav className="hidden lg:flex items-center gap-8 font-semibold text-lg">
                        <a className="text-slate-300 hover:text-emerald-400 transition-colors duration-200" href="#">
                            Apostas
                        </a>
                        <a className="text-slate-300 hover:text-emerald-400 transition-colors duration-200" href="#">
                            Como Jogar
                        </a>
                        <a className="text-slate-300 hover:text-emerald-400 transition-colors duration-200" href="#">
                            Premia├º├úo
                        </a>
                        <a className="text-slate-300 hover:text-emerald-400 transition-colors duration-200" href="#">
                            Painel Admin
                        </a>
                    </nav>
                    <div className="flex items-center gap-4">
                        <div id="walletConnectContainer" className="flex items-center gap-3 relative">
                            <div id="connectionStatus" className={`flex items-center gap-2 text-sm ${isConnected ? 'block' : 'hidden'}`}>
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                <span id="walletAddress" className="font-mono text-emerald-300">{formattedAddress}</span>
                            </div>

                            <button
                                id="connectWalletBtn"
                                ref={connectBtnRef}
                                onClick={toggleConnection}
                                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-400 transition-all duration-300 transform hover:scale-105 shadow-lg ${isConnected ? 'wallet-connected' : ''}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="wallet-icon">
                                    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                                    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                                    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
                                </svg>
                                <span id="connectText">{isConnected ? 'Conectado' : 'Conectar Carteira'}</span>
                            </button>

                            {isConnected && showWalletMenu && (
                                <div id="walletMenu" ref={walletMenuRef} className="absolute top-16 right-0 bg-slate-800 border border-emerald-500/30 rounded-lg shadow-xl p-4 min-w-48 z-50">
                                    <div className="text-xs text-slate-400 mb-2">Carteira Conectada</div>
                                    <div id="menuWalletAddress" className="font-mono text-sm text-emerald-300 mb-3 truncate">{formattedAddress}</div>
                                    <button id="disconnectBtn" onClick={disconnect} className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded transition-colors">
                                        ­ƒÜ¬ Desconectar
                                    </button>
                                    <button id="viewOnExplorer" onClick={viewOnBlockExplorer} className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded transition-colors mt-1">
                                        ­ƒöì Ver no Explorer
                                    </button>
                                </div>
                            )}
                        </div>

                        <button className="lg:hidden text-white hover:text-emerald-400 transition-colors" aria-label="Abrir menu">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* CONTE├ÜDO PRINCIPAL */}
            <main className="flex-grow w-full">
                <div className="container mx-auto p-4 md:p-6 mt-8 mb-8 flex justify-center">
                    <div className="w-full flex flex-col items-center justify-center gap-12">
                        {/* ALERTA DE TESTES */}
                        <div className="w-full max-w-5xl mx-auto bg-amber-400/90 border-b-4 border-amber-500 p-5 rounded-lg shadow-xl animate-pulse-slow">
                            <div className="flex items-center gap-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-900 flex-shrink-0" aria-hidden="true"><path d="m21.73 18.67-8.94-15.01a2 2 0 0 0-3.56 0L2.27 18.67a2 2 0 0 0 1.79 3.33h17.89a2 2 0 0 0 1.78-3.33Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                                <div className="text-amber-900">
                                    <p className="font-extrabold text-xl md:text-2xl">PLATAFORMA DE INVESTIMENTO E ENTRETENIMENTO GAMIFICADO.</p>
                                    <p className="font-semibold text-lg md:text-xl">AINDA ESTAMOS EM FASE DE TESTES, N├âO UTILIZE FUNDOS REAIS.<br />N├âO SE TRATA DE JOGO DE AZAR: Na Blockchain Bet Brasil, a grande diferen├ºa est├í no sistema de premia├º├úo, que ACABA com a ideia de "perdedor absoluto".</p>
                                </div>
                            </div>
                        </div>

                        {/* T├ìTULOS E DESCRI├ç├âO PRINCIPAL */}
                        <section className="w-full max-w-5xl flex flex-col items-center justify-center text-center gap-6">
                            <h3 className="text-4xl md:text-6xl font-extrabold text-white leading-tight animate-fade-in-down">Bem-vindo...<br /><span className="text-emerald-400">BBB & Invest-Bet!</span></h3>
                            <div className="my-4">
                                <h2 className="text-3xl md:text-5xl font-bold text-slate-100">
                                    Blockchain Bet Brasil - O BBB da Web3.<span className="text-emerald-400"><br />Investimento e divers├úo sem pared├úo.</span>
                                </h2>
                                <p className="mt-4 text-2xl md:text-3xl font-bold text-amber-300 animate-pulse-fast">Ganha com 5, 4, 3, 2 e at├® com 1 ponto apenas!</p>
                            </div>
                            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl">
                                Prepare-se para uma experi├¬ncia de apostas descentralizada como nunca visto antes.
                                Com tecnologia blockchain e um sistema de premia├º├úo inovador, com b├┤nus para zero ponto,
                                sua sorte e estrat├®gia se unem para transformar o jogo.
                            </p>

                            {/* CARDS DE PROMO├ç├âO CENTRALIZADOS E AJUSTADOS */}
                            <div className="mt-8 w-full flex flex-col md:flex-row justify-center items-stretch gap-8 px-4">
                                {/* Card da promo├º├úo de R$5,00 */}
                                <div className="bg-blue-600 text-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center flex-1 transition-transform transform hover:scale-105">
                                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                                        Ganhe at├® R$50.000,00
                                    </h1>
                                    <p className="text-2xl font-semibold mb-6">
                                        Acertando apenas <span className="text-yellow-300">1 ponto</span>
                                    </p>
                                    <p className="text-5xl md:text-6xl font-black mb-2 drop-shadow-lg">
                                        <span className="text-yellow-300">R$5,00</span>
                                    </p>
                                    <p className="text-lg font-medium">por aposta</p>
                                </div>

                                {/* Card da promo├º├úo de R$1.000,00 */}
                                <div className="bg-purple-700 text-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center flex-1 transition-transform transform hover:scale-105">
                                    <h1 className="text-4xl md:text-4xl font-extrabold mb-4">
                                        Ganhe at├® R$10.000.000,00
                                    </h1>
                                    <p className="text-2xl font-semibold mb-6">
                                        Acertando apenas <span className="text-yellow-300">1 ponto</span>
                                    </p>
                                    <p className="text-5xl md:text-6xl font-black mb-2 drop-shadow-lg">
                                        <span className="text-yellow-300">R$1.000,00</span>
                                    </p>
                                    <p className="text-lg font-medium">por aposta</p>
                                </div>
                            </div>
                        </section>

                        {/* SE├ç├âO "INVEST-BET" */}
                        <section className="w-full max-w-6xl mt-16 p-8 bg-slate-800/70 rounded-3xl shadow-2xl border-2 border-emerald-600">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-center text-emerald-300 mb-12 drop-shadow-lg animate-fade-in">
                                INVEST-BET: Aqui, N├úo Tem Segredo!
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                <div className="flex flex-col items-center text-center p-6 bg-slate-700/80 rounded-2xl shadow-lg border border-emerald-500 hover:shadow-emerald-500/40 transition-shadow duration-300 transform hover:-translate-y-2 animate-fade-in delay-100">
                                    <div className="mb-6">
                                        <img src="https://placehold.co/160x160/0f172a/63e2b2?text=Invest" alt="Pilar Investimento" width="160" height="160" className="rounded-full border-4 border-emerald-400 p-2 bg-slate-900" />
                                    </div>
                                    <h4 className="text-3xl font-bold text-amber-300 mb-4">INVESTIMENTO</h4>
                                    <p className="text-lg text-slate-200 leading-relaxed mb-4">
                                        Mais do que apostas, um ecossistema de valor. Seus R$5,00 ou R$1.000,00 por aposta se tornam parte de um pr├¬mio robusto, com taxas transparentes e a chance de ver seu capital crescer. A cada rodada, voc├¬ n├úo apenas participa, mas investe na possibilidade de um retorno significativo, impulsionado pela seguran├ºa e transpar├¬ncia da blockchain.
                                    </p>
                                    <div className="bg-slate-600/50 p-3 rounded-lg w-full mt-auto">
                                        <p className="text-lg font-bold text-emerald-300">R$5,00 por aposta</p>
                                        <p className="text-sm text-slate-300 mt-1">B├┤nus de R$0,625 por aposta com zero ponto (8x)= uma aposta gr├ítis.</p>
                                    </div>
                                    <div className="bg-slate-600/50 p-3 rounded-lg w-full mt-4">
                                        <p className="text-lg font-bold text-emerald-300">R$1.000,00 por aposta</p>
                                        <p className="text-sm text-slate-300 mt-1">B├┤nus de R$125,00 por aposta com zero ponto (8x)= uma aposta gr├ítis.</p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center text-center p-6 bg-slate-700/80 rounded-2xl shadow-lg border border-emerald-500 hover:shadow-emerald-500/40 transition-shadow duration-300 transform hover:-translate-y-2 animate-fade-in delay-200">
                                    <div className="mb-6">
                                        <img src="https://placehold.co/160x160/0f172a/63e2b2?text=Fun" alt="Pilar Divers├úo" width="160" height="160" className="rounded-full border-4 border-emerald-400 p-2 bg-slate-900" />
                                    </div>
                                    <h4 className="text-3xl font-bold text-amber-300 mb-4">DIVERS├âO</h4>
                                    <p className="text-lg text-slate-200 leading-relaxed mb-4">
                                        A emo├º├úo do jogo elevada ao m├íximo! Nosso sistema de premia├º├úo ├║nico recompensa de 5 a 1 ponto, garantindo mais chances de ganhar e manter a adrenalina l├í em cima. A cada semana, a expectativa de sorteio com Chainlink VRF e o b├┤nus de aposta gr├ítis para quem faz zero pontos,(8x) transformam cada rodada em uma nova aventura.
                                    </p>
                                    <div className="bg-slate-600/50 p-3 rounded-lg w-full mt-auto">
                                        <p className="text-lg font-bold text-emerald-300">Persist├¬ncia:</p>
                                        <p className="text-sm text-slate-300 mt-1">Ganha com 5, 4, 3, 2 e at├® com 1 ponto apenas. ├ë emocionante!</p>
                                    </div>
                                    <div className="bg-slate-600/50 p-3 rounded-lg w-full mt-4">
                                        <p className="text-lg font-bold text-emerald-300">Sua hora vai chegar.</p>
                                        <p className="text-sm text-slate-300 mt-1">Garantimos isso e oferecemos b├┤nus como um pacto com voc├¬.</p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center text-center p-6 bg-slate-700/80 rounded-2xl shadow-lg border border-emerald-500 hover:shadow-emerald-500/40 transition-shadow duration-300 transform hover:-translate-y-2 animate-fade-in delay-300">
                                    <div className="mb-6">
                                        <img src="https://placehold.co/160x160/0f172a/63e2b2?text=Enterprise" alt="Pilar Empreendimento" width="160" height="160" className="rounded-full border-4 border-emerald-400 p-2 bg-slate-900" />
                                    </div>
                                    <h4 className="text-3xl font-bold text-amber-300 mb-4">EMPREENDIMENTO</h4>
                                    <p className="text-lg text-slate-200 leading-relaxed mb-4">
                                        Voc├¬ faz parte de algo maior. Nosso sistema est├í limitado a capta├º├úo de apenas 10.000 apostas por rodada, com isso garantimos um ambiente competitivo e justo. A cada aposta, voc├¬ contribui para um futuro onde a participa├º├úo ativa e o potencial de ganho se unem, criando uma comunidade pr├│spera e engajada no universo da Web3.
                                    </p>
                                    <div className="bg-slate-600/50 p-3 rounded-lg w-full mt-auto">
                                        <p className="text-lg font-bold text-emerald-300">Rodadas</p>
                                        <p className="text-sm text-slate-300 mt-1">A cada rodada sem ganhadores a emo├º├úo aumenta cada vez mais.</p>
                                    </div>
                                    <div className="bg-slate-600/50 p-3 rounded-lg w-full mt-4">
                                        <p className="text-lg font-bold text-emerald-300">Rateio</p>
                                        <p className="text-sm text-slate-300 mt-1">Se s├│ voc├¬ fizer 1 ponto, a bolada da rodada ativa ├® toda sua. Bora! </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-16 text-center">
                                <h4 className="text-4xl font-bold text-white mb-6 animate-fade-in delay-400">
                                    Pronto para virar o jogo?
                                </h4>
                                <button
                                    id="mainActionBtn"
                                    onClick={handleMainAction}
                                    className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-xl font-extrabold rounded-full shadow-lg text-slate-900 bg-emerald-400 hover:bg-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105 animate-bounce-slow"
                                >
                                    {isConnected ? 'Investir Agora!' : 'Conectar para Investir!'}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-7 h-7 ml-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                </button>
                            </div>
                        </section>
                        <p className="mt-8 text-sm text-slate-500">(Idioma detectado: pt)</p>
                    </div>
                </div>
            </main>

            {/* RODAP├ë */}
            <footer className="w-full bg-slate-800 mt-auto border-t border-emerald-500/30">
                <div className="container mx-auto text-center p-6 text-slate-400 text-sm">
                    <p className="mb-2">┬® 2025 Blockchain Bet Brasil. Todos os direitos reservados.</p>
                    <div className="flex justify-center gap-4">
                        <a className="hover:text-emerald-400 transition-colors duration-200" href="#">
                            Termos de Uso
                        </a>
                        <span>|</span>
                        <a className="hover:text-emerald-400 transition-colors duration-200" href="#">
                            Pol├¡tica de Privacidade
                        </a>
                    </div>
                    <p className="mt-4 text-xs text-slate-600">Desenvolvido por sfchagasfilho, com <span className="text-red-500">ÔÖÑ</span> em Web3.</p>
                </div>
            </footer>
        </div>
    );
};

export default WalletConnector;


