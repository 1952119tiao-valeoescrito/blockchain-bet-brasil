// ApostasPage.jsx (Exemplo usando React e ethers.js)

import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
// Importe o ABI do seu contrato.
// Certifique-se que o caminho para o arquivo JSON está correto.
import BlockChainBetBrasilABI from './BlockChainBetBrasil.json'; // Ou o caminho correto para seu ABI

// ENDEREÇO DO SEU CONTRATO DEPLOYADO
const CONTRACT_ADDRESS = "0xd9145CCE52D386f254917e481eB44e9943F39138";

// Enum StatusRodada (para facilitar a leitura do código)
const StatusRodada = {
    INATIVA: 0,
    ABERTA: 1,
    FECHADA: 2,
    RESULTADO_DISPONIVEL: 3,
    PAGA: 4
};

function ApostasPage() {
    // Estado da Conexão e Wallet
    const [walletAddress, setWalletAddress] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [networkError, setNetworkError] = useState('');

    // Estado dos Dados da Rodada
    const [currentRoundId, setCurrentRoundId] = useState(null);
    const [roundData, setRoundData] = useState(null); // { id, status, ticketPrice, totalArrecadado, numApostas }

    // Estado da Aposta do Usuário
    const [prognosticosX, setPrognosticosX] = useState(Array(5).fill(''));
    const [prognosticosY, setPrognosticosY] = useState(Array(5).fill(''));

    // Estado de UI/Feedback
    const [isLoading, setIsLoading] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState({ type: '', text: '' }); // type: 'success' ou 'error'

    // 1. CONECTAR CARTEIRA
    const connectWallet = useCallback(async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                setNetworkError('');
                const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
                setProvider(ethProvider);

                const accounts = await ethProvider.send("eth_requestAccounts", []);
                if (accounts.length > 0) {
                    const accSigner = ethProvider.getSigner();
                    setSigner(accSigner);
                    setWalletAddress(accounts[0]);
                    setIsConnected(true);

                    const bettingContract = new ethers.Contract(CONTRACT_ADDRESS, BlockChainBetBrasilABI.abi, accSigner);
                    setContract(bettingContract);
                } else {
                    setIsConnected(false);
                    setFeedbackMessage({ type: 'error', text: 'Nenhuma conta selecionada.' });
                }
            } catch (error) {
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
            setNetworkError("MetaMask (ou outra carteira Ethereum) não detectada. Por favor, instale-a ou use o navegador da sua carteira mobile.");
            setIsConnected(false);
        }
    }, []);

    // 2. BUSCAR DADOS DA RODADA (Pode ser chamada com ou sem signer)
    const fetchRoundData = useCallback(async () => {
        let activeContract = contract; // Contrato com signer, se conectado
        if (!activeContract && provider) { // Se não conectado mas provider existe (leitura pública)
            activeContract = new ethers.Contract(CONTRACT_ADDRESS, BlockChainBetBrasilABI.abi, provider);
        } else if (!activeContract && typeof window.ethereum !== 'undefined') { // Tenta criar provider para leitura
            try {
                const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
                activeContract = new ethers.Contract(CONTRACT_ADDRESS, BlockChainBetBrasilABI.abi, tempProvider);
            } catch (e) {
                console.error("Não foi possível criar provider para leitura de dados da rodada", e);
                setNetworkError("Não foi possível ler dados da blockchain. Verifique sua conexão ou provedor Ethereum.");
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
            const roundIdBigNum = await activeContract.rodadaAtualId();
            const roundId = roundIdBigNum.toNumber();
            setCurrentRoundId(roundId);

            if (roundId > 0) {
                const info = await activeContract.getRodadaInfoBasica(roundId);
                // const timestamps = await activeContract.getRodadaTimestamps(roundId); // Opcional
                setRoundData({
                    id: info.id.toNumber(),
                    status: info.status,
                    ticketPrice: info.ticketPrice,
                    totalArrecadado: info.totalArrecadado,
                    numApostas: info.numApostas.toNumber(),
                    // timestampAbertura: timestamps.timestampAbertura.toNumber(), // Opcional
                });
            } else {
                setRoundData(null); // Nenhuma rodada ativa
            }
        } catch (error) {
            console.error("Erro ao buscar dados da rodada:", error);
            setFeedbackMessage({ type: 'error', text: `Erro ao carregar dados da rodada: ${error.message?.substring(0,100)}` });
        } finally {
            setIsLoading(false);
        }
    }, [contract, provider, networkError]); // Adicionado networkError para reavaliar

    // EFEITOS (Lógica que roda em certos momentos do ciclo de vida do componente)
    useEffect(() => {
        // Tenta buscar dados da rodada ao carregar, mesmo sem carteira conectada (leitura pública)
        if (!isConnected) {
            fetchRoundData();
        }
    }, [isConnected, fetchRoundData]); // Rodar quando isConnected mudar ou fetchRoundData for recriado

    useEffect(() => {
        // Se o contrato for instanciado (após conectar), busca os dados
        if (contract) {
            fetchRoundData();
        }
    }, [contract, fetchRoundData]); // Rodar quando 'contract' mudar

    useEffect(() => {
        const handleAccountsChanged = (accounts) => {
            if (accounts.length === 0) {
                setIsConnected(false);
                setWalletAddress(null);
                setSigner(null);
                setContract(null); // Pode optar por manter para leitura ou anular
                setFeedbackMessage({ type: 'info', text: 'Carteira desconectada.' });
            } else {
                connectWallet(); // Reconecta com a nova conta
            }
        };
        const handleChainChanged = () => window.location.reload();

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);
        }
        return () => { // Cleanup
            if (window.ethereum?.removeListener) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            }
        };
    }, [connectWallet]);

    // 3. HANDLER PARA MUDANÇA NOS INPUTS DE PROGNÓSTICO
    const handlePrognosticoChange = (index, value, type) => {
        const newPrognosticos = type === 'X' ? [...prognosticosX] : [...prognosticosY];
        // Permite limpar o campo, mas valida o número se não estiver vazio
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
            // Se não for um número válido, não atualiza ou mantém o valor anterior (depende da UX desejada)
        }

        if (type === 'X') setPrognosticosX(newPrognosticos);
        else setPrognosticosY(newPrognosticos);
    };

    // 4. FUNÇÃO PARA REALIZAR APOSTA
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
            await tx.wait(); // Espera a transação ser minerada
            setFeedbackMessage({ type: 'success', text: 'Aposta realizada com sucesso!' });
            setPrognosticosX(Array(5).fill(''));
            setPrognosticosY(Array(5).fill(''));
            fetchRoundData(); // Atualiza informações da rodada
        } catch (error) {
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

    // Funções auxiliares de formatação
    const formatEther = (weiValue) => {
        if (!weiValue) return '0';
        try {
            return ethers.utils.formatEther(weiValue);
        } catch { return 'N/A'; }
    };

    // RENDERIZAÇÃO CONDICIONAL DA INTERFACE DE APOSTAS
    const renderBettingInterface = () => {
        if (isLoading && !roundData) return <p>Carregando dados da rodada...</p>; // Se carregando dados iniciais
        if (!currentRoundId || currentRoundId === 0 || !roundData) {
            return <p>Nenhuma rodada ativa no momento. Volte em breve!</p>;
        }

        switch (roundData.status) {
            case StatusRodada.ABERTA:
                return (
                    <div>
                        <h3>Rodada #{roundData.id} Aberta para Apostas!</h3>
                        <p><strong>Preço do Bilhete:</strong> {formatEther(roundData.ticketPrice)} ETH</p>
                        <p><strong>Pote Atual:</strong> {formatEther(roundData.totalArrecadado)} ETH</p>
                        <p><strong>Apostas Realizadas:</strong> {roundData.numApostas}</p>
                        {/* <p>Aberta em: {new Date(roundData.timestampAbertura * 1000).toLocaleString()}</p> */}

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
                                    {isLoading ? 'Aguarde...' : `Apostar (${formatEther(roundData.ticketPrice)} ETH)`}
                                </button>
                            </>
                        )}
                    </div>
                );
            case StatusRodada.FECHADA:
                return (
                    <div>
                        <h3>Rodada #{roundData.id} - Apostas Encerradas</h3>
                        <p>Pote Final: {formatEther(roundData.totalArrecadado)} ETH. Aguardando resultados.</p>
                    </div>
                );
            default: // RESULTADO_DISPONIVEL, PAGA, INATIVA
                return (
                    <div>
                        <h3>Rodada #{roundData.id}</h3>
                        <p>Status: {Object.keys(StatusRodada).find(key => StatusRodada[key] === roundData.status) || 'Desconhecido'}</p>
                        <p>Esta rodada não está aberta para apostas. Confira os <a href="/resultados">Resultados</a>.</p>
                    </div>
                );
        }
    };

    // JSX PRINCIPAL DO COMPONENTE
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
                    <p>Carteira Conectada: <strong title={walletAddress}>{`${walletAddress?.substring(0, 6)}...${walletAddress?.substring(walletAddress.length - 4)}`}</strong></p>
                    {/* Botão de Desconectar seria útil aqui, mas para simplificar, não adicionei o estado de "desconexão intencional" */}
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
}