"use client";

import React, { useState, useEffect, useCallback } from 'react';
// Importações específicas da Ethers v6
import { BrowserProvider, Contract, formatEther as ethersFormatEther, JsonRpcSigner } from 'ethers';
import BlockChainBetBrasilABI from './BlockChainBetBrasil.json';

const CONTRACT_ADDRESS = "0xd9145CCE52D386f254917e481eB44e9943F39138";

const StatusRodada = {
    INATIVA: 0,
    ABERTA: 1,
    FECHADA: 2,
    RESULTADO_DISPONIVEL: 3,
    PAGA: 4
};

function ApostasPage() {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [provider, setProvider] = useState<BrowserProvider | null>(null);
    const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
    const [contract, setContract] = useState<Contract | null>(null);
    const [networkError, setNetworkError] = useState('');

    const [currentRoundId, setCurrentRoundId] = useState<number | null>(null);
    const [roundData, setRoundData] = useState<{
        id: number;
        status: number;
        ticketPrice: bigint;
        totalArrecadado: bigint;
        numApostas: number;
    } | null>(null);

    const [prognosticosX, setPrognosticosX] = useState(Array(5).fill(''));
    const [prognosticosY, setPrognosticosY] = useState(Array(5).fill(''));

    const [isLoading, setIsLoading] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState({ type: '', text: '' });

    const formatDisplayEther = (weiValue: bigint | undefined) => {
        if (typeof weiValue === 'undefined') return '0';
        try {
            return ethersFormatEther(weiValue);
        } catch { return 'N/A'; }
    };

    const connectWallet = useCallback(async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                setNetworkError('');
                // CORREÇÃO APLICADA AQUI: Usando BrowserProvider diretamente
                const ethProvider = new BrowserProvider(window.ethereum);
                setProvider(ethProvider);

                const accounts = await ethProvider.send("eth_requestAccounts", []);
                if (accounts.length > 0) {
                    const accSigner = await ethProvider.getSigner();
                    setSigner(accSigner);
                    setWalletAddress(accounts[0]);
                    setIsConnected(true);

                    const bettingContract = new Contract(CONTRACT_ADDRESS, BlockChainBetBrasilABI.abi, accSigner);
                    setContract(bettingContract);
                } else {
                    setIsConnected(false);
                    setFeedbackMessage({ type: 'error', text: 'Nenhuma conta selecionada.' });
                }
            } catch (error: any) {
                console.error("Erro ao conectar carteira:", error);
                setNetworkError('Erro ao conectar. Verifique se a MetaMask está instalada/desbloqueada.');
                if (error.code === 4001) {
                    setFeedbackMessage({ type: 'error', text: 'Conexão da carteira rejeitada.' });
                } else {
                    setFeedbackMessage({ type: 'error', text: `Erro ao conectar: ${error.message?.substring(0,100)}` });
                }
                setIsConnected(false);
            }
        } else {
            setNetworkError("MetaMask (ou outra carteira Ethereum) não detectada.");
            setIsConnected(false);
        }
    }, []);

    const fetchRoundData = useCallback(async () => {
        let activeContract: Contract | null = contract;
        let tempProviderInstance: BrowserProvider | null = null;

        if (!activeContract && provider) {
            activeContract = new Contract(CONTRACT_ADDRESS, BlockChainBetBrasilABI.abi, provider);
        } else if (!activeContract && typeof window.ethereum !== 'undefined') {
            try {
                tempProviderInstance = new BrowserProvider(window.ethereum);
                activeContract = new Contract(CONTRACT_ADDRESS, BlockChainBetBrasilABI.abi, tempProviderInstance);
            } catch (e) {
                console.error("Não foi possível criar provider para leitura de dados da rodada", e);
                setNetworkError("Não foi possível ler dados da blockchain.");
                return;
            }
        }

        if (!activeContract) {
            if (!networkError) setNetworkError("Conecte sua carteira para ver os dados da rodada.");
            return;
        }

        setIsLoading(true);
        setFeedbackMessage({ type: '', text: '' });
        try {
            const roundIdBigInt = await activeContract.rodadaAtualId();
            const roundId = Number(roundIdBigInt);
            setCurrentRoundId(roundId);

            if (roundId > 0) {
                const info = await activeContract.getRodadaInfoBasica(roundId);
                setRoundData({
                    id: Number(info.id),
                    status: info.status,
                    ticketPrice: info.ticketPrice,
                    totalArrecadado: info.totalArrecadado,
                    numApostas: Number(info.numApostas),
                });
            } else {
                setRoundData(null);
            }
        } catch (error: any) {
            console.error("Erro ao buscar dados da rodada:", error);
            setFeedbackMessage({ type: 'error', text: `Erro ao carregar dados da rodada: ${error.message?.substring(0,100)}` });
        } finally {
            setIsLoading(false);
        }
    }, [contract, provider, networkError]);

    useEffect(() => {
        if (!isConnected) {
            fetchRoundData();
        }
    }, [isConnected, fetchRoundData]);

    useEffect(() => {
        if (contract) {
            fetchRoundData();
        }
    }, [contract, fetchRoundData]);

    useEffect(() => {
        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length === 0) {
                setIsConnected(false);
                setWalletAddress(null);
                setSigner(null);
                setContract(null);
                setFeedbackMessage({ type: 'info', text: 'Carteira desconectada.' });
            } else {
                connectWallet();
            }
        };
        const handleChainChanged = () => window.location.reload();

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);
        }
        return () => {
            if (window.ethereum?.removeListener) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            }
        };
    }, [connectWallet]);

    const handlePrognosticoChange = (index: number, value: string, type: 'X' | 'Y') => {
        const newPrognosticos = type === 'X' ? [...prognosticosX] : [...prognosticosY];
        if (value === '') {
            newPrognosticos[index] = '';
        } else {
            const numValue = parseInt(value);
            if (!isNaN(numValue) && numValue >= 1 && numValue <= 25) {
                newPrognosticos[index] = numValue.toString();
            } else if (!isNaN(numValue) && numValue < 1) {
                newPrognosticos[index] = '1';
            } else if (!isNaN(numValue) && numValue > 25) {
                newPrognosticos[index] = '25';
            }
        }
        if (type === 'X') setPrognosticosX(newPrognosticos);
        else setPrognosticosY(newPrognosticos);
    };

    const handleBet = async () => {
        if (!contract || !signer || !roundData || roundData.status !== StatusRodada.ABERTA) {
            setFeedbackMessage({ type: 'error', text: 'Não é possível apostar. Verifique conexão/status da rodada.' });
            return;
        }

        const pX = prognosticosX.map(p => parseInt(p)).filter(p => !isNaN(p) && p >= 1 && p <= 25);
        const pY = prognosticosY.map(p => parseInt(p)).filter(p => !isNaN(p) && p >= 1 && p <= 25);

        if (pX.length !== 5 || pY.length !== 5) {
            setFeedbackMessage({ type: 'error', text: 'Preencha 5 prognósticos válidos (1-25) para X e 5 para Y.' });
            return;
        }

        setIsLoading(true);
        setFeedbackMessage({ type: '', text: '' });
        try {
            const tx = await contract.apostar(pX, pY, { value: roundData.ticketPrice });
            setFeedbackMessage({ type: 'info', text: `Aposta enviada (Tx: ${tx.hash.substring(0,10)}...). Aguardando confirmação...` });
            await tx.wait();
            setFeedbackMessage({ type: 'success', text: 'Aposta realizada com sucesso!' });
            setPrognosticosX(Array(5).fill(''));
            setPrognosticosY(Array(5).fill(''));
            fetchRoundData();
        } catch (error: any) {
            console.error("Erro ao apostar:", error);
            let userMessage = "Erro ao realizar aposta.";
            if (error.reason) userMessage = `Falha na aposta: ${error.reason}`;
            else if (error.code === 4001) userMessage = "Transação de aposta rejeitada.";
            else if (error.data?.message) userMessage = `Erro: ${error.data.message.substring(0,100)}`;
            else if (error.message) userMessage = `Erro: ${error.message.substring(0,100)}`;
            setFeedbackMessage({ type: 'error', text: userMessage });
        } finally {
            setIsLoading(false);
        }
    };

    const renderBettingInterface = () => {
        if (isLoading && !roundData) return <p>Carregando dados da rodada...</p>;
        if (!currentRoundId || currentRoundId === 0 || !roundData) {
            return <p>Nenhuma rodada ativa no momento. Volte em breve!</p>;
        }

        switch (roundData.status) {
            case StatusRodada.ABERTA:
                return (
                    <div>
                        <h3>Rodada #{roundData.id} Aberta para Apostas!</h3>
                        <p><strong>Preço do Bilhete:</strong> {formatDisplayEther(roundData.ticketPrice)} ETH</p>
                        <p><strong>Pote Atual:</strong> {formatDisplayEther(roundData.totalArrecadado)} ETH</p>
                        <p><strong>Apostas Realizadas:</strong> {roundData.numApostas}</p>

                        {!isConnected ? (
                            <p style={{color: "orange"}}>Conecte sua carteira para poder apostar.</p>
                        ) : (
                            <>
                                <h4>Seus Prognósticos:</h4>
                                <div>
                                    <label>Grupo X (1-25):</label><br />
                                    {prognosticosX.map((p, index) => (
                                        <input key={`x-${index}`} type="number" value={p}
                                            onChange={(e) => handlePrognosticoChange(index, e.target.value, 'X')}
                                            style={{ width: '50px', margin: '2px' }} disabled={isLoading} />
                                    ))}
                                </div>
                                <div>
                                    <label>Grupo Y (1-25):</label><br />
                                    {prognosticosY.map((p, index) => (
                                        <input key={`y-${index}`} type="number" value={p}
                                            onChange={(e) => handlePrognosticoChange(index, e.target.value, 'Y')}
                                            style={{ width: '50px', margin: '2px' }} disabled={isLoading} />
                                    ))}
                                </div>
                                <button onClick={handleBet} disabled={isLoading || !isConnected}>
                                    {isLoading ? 'Aguarde...' : `Apostar (${formatDisplayEther(roundData.ticketPrice)} ETH)`}
                                </button>
                            </>
                        )}
                    </div>
                );
            case StatusRodada.FECHADA:
                return (
                    <div>
                        <h3>Rodada #{roundData.id} - Apostas Encerradas</h3>
                        <p>Pote Final: {formatDisplayEther(roundData.totalArrecadado)} ETH. Aguardando resultados.</p>
                    </div>
                );
            default:
                return (
                    <div>
                        <h3>Rodada #{roundData.id}</h3>
                        <p>Status: {Object.keys(StatusRodada).find(key => StatusRodada[key as keyof typeof StatusRodada] === roundData.status) || 'Desconhecido'}</p>
                        <p>Esta rodada não está aberta para apostas. Confira os <a href="/resultados">Resultados</a>.</p>
                    </div>
                );
        }
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <h2>Página de Apostas</h2>
            <p><em>A listagem de eventos e opções de apostas será exibida aqui.</em></p>
            <hr />

            {networkError && <p style={{ color: 'red', fontWeight: 'bold' }}>{networkError}</p>}

            {!isConnected ? (
                <button onClick={connectWallet} disabled={isLoading}>
                    {isLoading ? 'Conectando...' : 'Conectar Carteira'}
                </button>
            ) : (
                <div>
                    <p>Carteira Conectada: <strong title={walletAddress || ''}>{`${walletAddress?.substring(0, 6)}...${walletAddress?.substring(walletAddress.length - 4)}`}</strong></p>
                </div>
            )}

            {feedbackMessage.text && (
                <p style={{
                    color: feedbackMessage.type === 'error' ? 'red' : (feedbackMessage.type === 'success' ? 'green' : 'blue'),
                    padding: '10px', border: '1px solid #ccc', marginTop: '10px'
                }}>
                    {feedbackMessage.text}
                </p>
            )}

            {renderBettingInterface()}

            <hr style={{marginTop: '30px'}}/>
            <p style={{fontSize: '0.8em', color: '#777'}}>
                Esta página está no grupo de rotas (main) e deve usar o layout específico desse grupo.
            </p>
        </div>
    );
}

export default ApostasPage;