"use client";

import { useState, useEffect, useCallback } from 'react'; // Adicionado useCallback
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSimulateContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useBalance,
  // useChainId, // Comentado pois chain de useAccount é usado
  useSwitchChain,
  useReadContract, // Adicionado
} from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { parseEther, formatEther, Address } from 'viem'; // Adicionado formatEther e Address
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/constants';

const gerarPrognosticosValidos = (): string[] => {
  const validos: string[] = [];
  for (let i = 1; i <= 25; i++) {
    for (let j = 1; j <= 25; j++) {
      validos.push(`${i}/${j}`);
    }
  }
  return validos;
};

const validPrognosticsSet = new Set(gerarPrognosticosValidos());

// Mapeamento de Status da Rodada
const STATUS_RODADA_MAP: { [key: number]: string } = {
    0: "INATIVA",
    1: "ABERTA",
    2: "FECHADA",
    3: "RESULTADO DISPONÍVEL",
    4: "PAGA"
};

interface RodadaInfo {
    id: bigint;
    status: number; // enum é uint8
    ticketPrice: bigint;
    totalArrecadado: bigint;
    premioTotal: bigint;
    numApostas: bigint;
    numeroDeVencedores: bigint;
}
interface RodadaResultados {
    milharesSorteados: readonly bigint[];
    milharesForamInseridos: boolean;
    resultadosX: readonly bigint[];
    resultadosY: readonly bigint[];
}


export default function HomePage() {
  const { address, isConnected, connector, isConnecting, chain } = useAccount();
  const { connect, connectors, error: connectError, isPending: isConnectPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitchingChain, error: switchChainError } = useSwitchChain();

  // Estados da UI e formulários
  const [prognosticos, setPrognosticos] = useState<string[]>(Array(5).fill(""));
  const [numerosXParaEnviar, setNumerosXParaEnviar] = useState<number[]>([]);
  const [numerosYParaEnviar, setNumerosYParaEnviar] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // Genérico para qualquer submit
  const [uiMessage, setUiMessage] = useState<string | null>(null);
  const [uiMessageType, setUiMessageType] = useState<'success' | 'error' | 'info' | null>(null);
  const [isPreparingBet, setIsPreparingBet] = useState(false);
  const [showTestnetWarning, setShowTestnetWarning] = useState(true);

  // Estados para dados do contrato
  const [contractOwner, setContractOwner] = useState<Address | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [rodadaAtualId, setRodadaAtualId] = useState<bigint | null>(null);
  const [rodadaInfo, setRodadaInfo] = useState<RodadaInfo | null>(null);
  const [rodadaResultados, setRodadaResultados] = useState<RodadaResultados | null>(null);
  const [ticketPriceBase, setTicketPriceBase] = useState<bigint | null>(null);
  const [taxaPlataforma, setTaxaPlataforma] = useState<bigint | null>(null);
  const [isContractPaused, setIsContractPaused] = useState<boolean>(false);
  const [taxasAcumuladas, setTaxasAcumuladas] = useState<bigint | null>(null);


  // Estados para formulários de Admin
  const [adminTicketPrice, setAdminTicketPrice] = useState('');
  const [adminRodadaIdFechar, setAdminRodadaIdFechar] = useState('');
  const [adminRodadaIdResultados, setAdminRodadaIdResultados] = useState('');
  const [adminMilhares, setAdminMilhares] = useState<string[]>(Array(5).fill(''));
  const [adminNovoTicketBase, setAdminNovoTicketBase] = useState('');
  const [adminNovaTaxaPlat, setAdminNovaTaxaPlat] = useState('');
  const [adminRetirarTaxasPara, setAdminRetirarTaxasPara] = useState('');


  // Estado para Reivindicar Prêmio
  const [reivindicarRodadaId, setReivindicarRodadaId] = useState('');
  const [premioParaReivindicar, setPremioParaReivindicar] = useState<bigint | null>(null);
  const [jaReivindicou, setJaReivindicou] = useState<boolean>(false);


  // --- Hooks useReadContract ---
  const { data: balanceData, isLoading: isBalanceLoading, error: balanceError, refetch: refetchBalance } = useBalance({
    address: address,
    chainId: sepolia.id, // Especificar chainId é bom
  });

  const { data: ownerReadData, refetch: refetchOwner } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'owner',
    chainId: sepolia.id,
    query: { enabled: isConnected && chain?.id === sepolia.id },
  });

  const { data: rodadaAtualIdReadData, refetch: refetchRodadaAtualId } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'rodadaAtualId',
    chainId: sepolia.id,
    query: { enabled: isConnected && chain?.id === sepolia.id },
  });

  const { data: rodadaInfoReadData, refetch: refetchRodadaInfo, isLoading: isLoadingRodadaInfo } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getRodadaInfoBasica',
    args: rodadaAtualId !== null && rodadaAtualId !== 0n ? [rodadaAtualId] : undefined,
    chainId: sepolia.id,
    query: { enabled: isConnected && chain?.id === sepolia.id && rodadaAtualId !== null && rodadaAtualId !== 0n },
  });

  const { data: rodadaResultadosReadData, refetch: refetchRodadaResultados, isLoading: isLoadingRodadaResultados } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getRodadaResultados',
    args: rodadaAtualId !== null && rodadaAtualId !== 0n ? [rodadaAtualId] : undefined,
    chainId: sepolia.id,
    query: { enabled: isConnected && chain?.id === sepolia.id && rodadaAtualId !== null && rodadaAtualId !== 0n && rodadaInfo?.status !== 0 && rodadaInfo?.status !== 1 }, // Só busca se rodada não for inativa/aberta
  });

  const { data: ticketPriceBaseReadData, refetch: refetchTicketPriceBase } = useReadContract({
    address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: 'ticketPriceBase', chainId: sepolia.id, query: { enabled: isConnected && chain?.id === sepolia.id }
  });
  const { data: taxaPlataformaReadData, refetch: refetchTaxaPlataforma } = useReadContract({
    address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: 'taxaPlataformaPercentual', chainId: sepolia.id, query: { enabled: isConnected && chain?.id === sepolia.id }
  });
  const { data: pausedReadData, refetch: refetchPaused } = useReadContract({
    address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: 'paused', chainId: sepolia.id, query: { enabled: isConnected && chain?.id === sepolia.id }
  });
  const { data: taxasAcumuladasReadData, refetch: refetchTaxasAcumuladas } = useReadContract({
    address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: 'taxasAcumuladas', chainId: sepolia.id, query: { enabled: isConnected && chain?.id === sepolia.id && isOwner }
  });


  // Hooks para Reivindicar Prêmio
  const { data: premioParaReivindicarReadData, refetch: refetchPremioParaReivindicar } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getPremioParaReivindicar',
    args: (reivindicarRodadaId && address) ? [BigInt(reivindicarRodadaId), address] : undefined,
    chainId: sepolia.id,
    query: { enabled: !!(reivindicarRodadaId && address && isConnected && chain?.id === sepolia.id) }
  });
  const { data: jaReivindicouReadData, refetch: refetchJaReivindicou } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'checarSePremioFoiReivindicado',
    args: (reivindicarRodadaId && address) ? [BigInt(reivindicarRodadaId), address] : undefined,
    chainId: sepolia.id,
    query: { enabled: !!(reivindicarRodadaId && address && isConnected && chain?.id === sepolia.id) }
  });


  // --- Função para dar Refresh em todos os dados relevantes ---
  const refreshAllContractData = useCallback(async () => {
    if (isConnected && chain?.id === sepolia.id) {
        console.log("Refreshing all contract data...");
        await refetchOwner();
        const idData = await refetchRodadaAtualId(); // Captura o resultado para usar abaixo
        if (idData && typeof idData.data === 'bigint' && idData.data !== 0n) {
             await refetchRodadaInfo();
             await refetchRodadaResultados(); // Pode condicionar melhor se necessário
        }
        await refetchTicketPriceBase();
        await refetchTaxaPlataforma();
        await refetchPaused();
        if (isOwner) await refetchTaxasAcumuladas(); // Só refetch se for owner
        if (address) await refetchBalance();
        // Para reivindicar prêmio, o refetch é mais específico (quando o ID é digitado)
    }
  }, [isConnected, chain, address, isOwner, refetchOwner, refetchRodadaAtualId, refetchRodadaInfo, refetchRodadaResultados, refetchTicketPriceBase, refetchTaxaPlataforma, refetchPaused, refetchTaxasAcumuladas, refetchBalance, sepolia.id]);


  // --- useEffects para atualizar estados com dados lidos ---
  useEffect(() => {
    if (ownerReadData) setContractOwner(ownerReadData as Address);
  }, [ownerReadData]);

  useEffect(() => {
    if (address && contractOwner) setIsOwner(address.toLowerCase() === contractOwner.toLowerCase());
    else setIsOwner(false);
  }, [address, contractOwner]);

  useEffect(() => {
    if (typeof rodadaAtualIdReadData === 'bigint') setRodadaAtualId(rodadaAtualIdReadData);
  }, [rodadaAtualIdReadData]);

  useEffect(() => {
    if (rodadaInfoReadData) {
        const [id, status, ticketPrice, totalArrecadado, premioTotal, numApostas, numeroDeVencedores] = rodadaInfoReadData as any[];
        setRodadaInfo({ id, status, ticketPrice, totalArrecadado, premioTotal, numApostas, numeroDeVencedores });
    } else if (rodadaAtualId === 0n) {
        setRodadaInfo(null);
    }
  }, [rodadaInfoReadData, rodadaAtualId]);

  useEffect(() => {
    if (rodadaResultadosReadData) {
        const [milharesSorteados, milharesForamInseridos, resultadosX, resultadosY] = rodadaResultadosReadData as any[];
        setRodadaResultados({ milharesSorteados, milharesForamInseridos, resultadosX, resultadosY });
    } else if (rodadaAtualId === 0n || (rodadaInfo && (rodadaInfo.status === 0 || rodadaInfo.status === 1) ) ) {
        setRodadaResultados(null);
    }
  }, [rodadaResultadosReadData, rodadaAtualId, rodadaInfo]);


  useEffect(() => {
    if (typeof ticketPriceBaseReadData === 'bigint') setTicketPriceBase(ticketPriceBaseReadData);
    if (typeof taxaPlataformaReadData === 'bigint') setTaxaPlataforma(taxaPlataformaReadData);
    if (typeof pausedReadData === 'boolean') setIsContractPaused(pausedReadData);
    if (typeof taxasAcumuladasReadData === 'bigint') setTaxasAcumuladas(taxasAcumuladasReadData);
  }, [ticketPriceBaseReadData, taxaPlataformaReadData, pausedReadData, taxasAcumuladasReadData]);

  useEffect(() => {
    if (typeof premioParaReivindicarReadData === 'bigint') setPremioParaReivindicar(premioParaReivindicarReadData);
    if (typeof jaReivindicouReadData === 'boolean') setJaReivindicou(jaReivindicouReadData);
  }, [premioParaReivindicarReadData, jaReivindicouReadData]);

  // --- useEffects para UI Messages e Conexão (seus existentes, com pequenas adaptações) ---
  useEffect(() => {
    if (isConnected && chain && chain.id !== sepolia.id) {
      setUiMessageType('error');
      setUiMessage(`ATENÇÃO: Você está conectado à rede ${chain.name}, mas este DApp opera na rede Sepolia. Por favor, mude sua carteira para a rede Sepolia.`);
    } else if (isConnected && chain && chain.id === sepolia.id) {
        // Só limpa a mensagem de aviso de rede, não outras mensagens
        if (uiMessage?.startsWith("ATENÇÃO: Você está conectado à rede")) {
            setUiMessage(null); // Limpa a mensagem de aviso de rede
            setUiMessageType(null);
        }
        // Atualiza mensagem de conectado com saldo (pode ser movido para um useEffect que depende de balanceData)
        let connectedMessage = `Carteira: ${address?.substring(0, 6)}...${address?.substring(address.length - 4)}`;
        if (isBalanceLoading) connectedMessage += " (Carregando saldo...)";
        else if (balanceError) connectedMessage += ` (Erro saldo: ${(balanceError as any)?.shortMessage || balanceError.message})`;
        else if (balanceData) connectedMessage += ` | Saldo: ${balanceData.formatted} ${balanceData.symbol}`;

        // Mostrar mensagem de conectado apenas se não houver outra mensagem importante
        if (!uiMessage || uiMessageType === null || uiMessageType === 'success') {
             setUiMessageType('success');
             setUiMessage(connectedMessage);
        }
    }
  }, [isConnected, chain, sepolia.id, uiMessage, uiMessageType, address, balanceData, balanceError, isBalanceLoading]);


  useEffect(() => { // Para mensagens de conexão e saldo
    if (isConnecting || isConnectPending) {
      setUiMessageType('info');
      setUiMessage("Conectando carteira...");
    } else if (connectError) {
      setUiMessageType('error');
      setUiMessage(`Erro ao conectar: ${(connectError as any)?.shortMessage || connectError.message}`);
    } else if (isConnected && address && chain?.id === sepolia.id) {
        // Atualiza periodicamente ou quando balanceData muda.
        // A lógica de mensagem de conectado com saldo já está no useEffect acima.
        // Este useEffect pode focar em limpar a mensagem de "conectando"
        if (uiMessage === "Conectando carteira...") {
             // A mensagem de sucesso com saldo será definida pelo useEffect acima.
             // Aqui podemos apenas limpar a mensagem de "Conectando..." se necessário
             // ou deixar o outro useEffect tratar. Para evitar conflito,
             // vamos deixar o outro useEffect lidar com a mensagem de sucesso.
        }
    } else if (!isConnected && uiMessage !== "Conecte sua carteira para apostar.") { // Evita setar msg se já tem uma
       setUiMessageType(null);
       setUiMessage("Conecte sua carteira para apostar.");
    }
  }, [isConnected, address, connectError, isConnecting, isConnectPending, chain, sepolia.id, balanceData, isBalanceLoading, balanceError, uiMessage]);


  useEffect(() => {
    if(isSwitchingChain) { /* ... (seu código) ... */ }
    else if (switchChainError) { /* ... (seu código) ... */ }
  }, [isSwitchingChain, switchChainError]);

  // Chamar refreshAllContractData quando conectar à Sepolia
  useEffect(() => {
    if (isConnected && chain?.id === sepolia.id) {
        refreshAllContractData();
    }
  }, [isConnected, chain, sepolia.id, refreshAllContractData]);


  const handleConnect = () => { /* ... (seu código) ... */ };
  const handleInputChange = (index: number, value: string) => { /* ... (seu código) ... */ };
  const prepararNumerosParaAposta = () => { /* ... (seu código) ... */ };

  // --- Hooks e Handlers para APOSTAR (seu código existente) ---
  const { data: simulateData, error: simulateError, refetch: refetchSimulate, isLoading: isSimulating } = useSimulateContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'apostar',
    args: [numerosXParaEnviar, numerosYParaEnviar],
    value: (rodadaInfo && rodadaInfo.ticketPrice) ? rodadaInfo.ticketPrice : parseEther('0.01'), // Usa ticketPrice da rodada
    query: { enabled: false, retry: false, },
    chainId: sepolia.id
  });
  const { writeContract, data: writeTxHash, isPending: isWritePending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: receiptError } = useWaitForTransactionReceipt({
    hash: writeTxHash,
    query: { enabled: !!writeTxHash, }
  });

  // useEffects para feedback da aposta (seu código existente, mas chame refreshAllContractData no sucesso)
  useEffect(() => {
    if (isSimulating) { /* ... (seu código) ... */ }
    else if (isWritePending) { /* ... (seu código) ... */ }
    else if (isConfirming) { /* ... (seu código) ... */ }
  }, [isSimulating, isWritePending, isConfirming]);

  useEffect(() => {
    if (isConfirmed && writeTxHash) {
      setUiMessageType('success');
      setUiMessage(`Aposta realizada com sucesso! Hash: ${writeTxHash.substring(0,10)}...`);
      setPrognosticos(Array(5).fill(""));
      setNumerosXParaEnviar([]);
      setNumerosYParaEnviar([]);
      setIsSubmitting(false);
      setIsPreparingBet(false);
      // refetchBalance(); // Removido, pois refreshAllContractData já faz
      refreshAllContractData(); // <--- ATUALIZADO
    }
  }, [isConfirmed, writeTxHash, refreshAllContractData]); // Adicionado refreshAllContractData

  useEffect(() => { // Erros da aposta
    let errorToSet: string | null = null;
    let shouldResetSubmitting = false;
    if (simulateError) { /* ... (seu código) ... */ }
    else if (writeError) { /* ... (seu código) ... */ }
    else if (receiptError) { /* ... (seu código) ... */ }
    if (errorToSet) { /* ... (seu código) ... */ }
    if (shouldResetSubmitting) { /* ... (seu código) ... */ }
  }, [simulateError, writeError, receiptError]);

  const handleSubmitBetClick = () => { /* ... (seu código, verifique rodadaInfo.status === 1) ... */
    if (!isConnected || !address) { /* ... */ return; }
    if (chain && chain.id !== sepolia.id) { /* ... */ return; }
    if (!rodadaInfo || rodadaInfo.status !== 1) {
        setUiMessageType('error');
        setUiMessage(rodadaInfo ? `Apostas para esta rodada estão ${STATUS_RODADA_MAP[rodadaInfo.status].toLowerCase()}.` : "Informações da rodada não carregadas.");
        return;
    }
    if (prepararNumerosParaAposta()) { /* ... */ }
    else { /* ... */ }
  };

  useEffect(() => { // executeAposta
    if (!isPreparingBet || numerosXParaEnviar.length !== 5 || numerosYParaEnviar.length !== 5) { /* ... */ return; }
    if (chain && chain.id !== sepolia.id) { /* ... */ return; }
    const executeAposta = async () => { /* ... (seu código) ... */ };
    executeAposta();
  }, [isPreparingBet, numerosXParaEnviar, numerosYParaEnviar, refetchSimulate, writeContract, chain, sepolia.id]);


  // --- NOVAS FUNÇÕES E HOOKS PARA ADMIN E REIVINDICAR ---

  // --- INICIAR NOVA RODADA (Admin) ---
  const { data: simIniciarRodadaData, error: simIniciarRodadaError, refetch: refetchSimIniciarRodada } = useSimulateContract({
    address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: 'iniciarNovaRodada',
    args: [adminTicketPrice ? parseEther(adminTicketPrice) : 0n],
    query: { enabled: false, retry: false }, chainId: sepolia.id,
  });
  const { writeContract: writeIniciarRodada, data: writeIniciarRodadaHash, isPending: isWriteIniciarRodadaPending, error: writeIniciarRodadaError } = useWriteContract();
  const { isLoading: isConfirmingIniciarRodada, isSuccess: isConfirmedIniciarRodada, error: receiptIniciarRodadaError } = useWaitForTransactionReceipt({ hash: writeIniciarRodadaHash, query: { enabled: !!writeIniciarRodadaHash }});

  const handleIniciarNovaRodada = async () => {
    if (!isOwner) { setUiMessageType('error'); setUiMessage("Ação restrita ao proprietário."); return; }
    setIsSubmitting(true); setUiMessageType('info'); setUiMessage("Preparando para iniciar nova rodada...");
    try {
        const simResult = await refetchSimIniciarRodada();
        if (simResult.isError || !simResult.data?.request) {
            throw simResult.error || new Error("Falha na simulação de iniciar rodada.");
        }
        setUiMessage("Aguardando assinatura na carteira...");
        writeIniciarRodada(simResult.data.request);
    } catch (e: any) {
        setUiMessageType('error'); setUiMessage(`Erro ao iniciar rodada: ${(e as any)?.cause?.shortMessage || (e as any)?.shortMessage || e.message}`);
        setIsSubmitting(false);
    }
  };
  useEffect(() => {
    if (isWriteIniciarRodadaPending) { setUiMessage("Aguardando assinatura para iniciar rodada..."); }
    else if (isConfirmingIniciarRodada) { setUiMessage("Processando início de nova rodada..."); }
    else if (isConfirmedIniciarRodada) {
        setUiMessageType('success'); setUiMessage("Nova rodada iniciada com sucesso!");
        setIsSubmitting(false); setAdminTicketPrice(''); refreshAllContractData();
    } else if (simIniciarRodadaError || writeIniciarRodadaError || receiptIniciarRodadaError) {
        const error = simIniciarRodadaError || writeIniciarRodadaError || receiptIniciarRodadaError;
        setUiMessageType('error'); setUiMessage(`Erro ao iniciar rodada: ${(error as any)?.cause?.shortMessage || (error as any)?.shortMessage || error?.message}`);
        setIsSubmitting(false);
    }
  }, [isWriteIniciarRodadaPending, isConfirmingIniciarRodada, isConfirmedIniciarRodada, simIniciarRodadaError, writeIniciarRodadaError, receiptIniciarRodadaError, refreshAllContractData]);


  // --- FECHAR APOSTAS (Admin) ---
  const { data: simFecharApostasData, error: simFecharApostasError, refetch: refetchSimFecharApostas } = useSimulateContract({
    address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: 'fecharApostas',
    args: adminRodadaIdFechar ? [BigInt(adminRodadaIdFechar)] : (rodadaAtualId && rodadaAtualId !== 0n ? [rodadaAtualId] : undefined), // Usa ID atual se não especificado
    query: { enabled: false, retry: false }, chainId: sepolia.id,
  });
  const { writeContract: writeFecharApostas, data: writeFecharApostasHash, isPending: isWriteFecharApostasPending, error: writeFecharApostasError } = useWriteContract();
  const { isLoading: isConfirmingFecharApostas, isSuccess: isConfirmedFecharApostas, error: receiptFecharApostasError } = useWaitForTransactionReceipt({ hash: writeFecharApostasHash, query: { enabled: !!writeFecharApostasHash }});

  const handleFecharApostas = async () => {
    if (!isOwner) { setUiMessageType('error'); setUiMessage("Ação restrita ao proprietário."); return; }
    const idToClose = adminRodadaIdFechar ? BigInt(adminRodadaIdFechar) : rodadaAtualId;
    if (!idToClose || idToClose === 0n) { setUiMessageType('error'); setUiMessage("ID da rodada inválido para fechar."); return; }

    setIsSubmitting(true); setUiMessageType('info'); setUiMessage(`Preparando para fechar apostas da rodada ${idToClose}...`);
    try {
        // Precisamos garantir que `args` no hook `useSimulateContract` seja atualizado antes de refetch.
        // Uma forma é passar os args diretamente para o refetch se a lib permitir, ou reconfigurar o hook.
        // Wagmi v1 `refetch` não aceita novos args. Re-executar com args corretos é mais complexo.
        // Por simplicidade, vamos assumir que o hook já tem o arg correto ou o usuário preencheu o input.
        const simResult = await refetchSimFecharApostas(); // Este refetch usará o args definido no hook.
        if (simResult.isError || !simResult.data?.request) {
            throw simResult.error || new Error("Falha na simulação de fechar apostas.");
        }
        setUiMessage("Aguardando assinatura na carteira...");
        writeFecharApostas(simResult.data.request);
    } catch (e: any) {
        setUiMessageType('error'); setUiMessage(`Erro ao fechar apostas: ${(e as any)?.cause?.shortMessage || (e as any)?.shortMessage || e.message}`);
        setIsSubmitting(false);
    }
  };
   useEffect(() => {
    if (isWriteFecharApostasPending) { setUiMessage("Aguardando assinatura para fechar apostas..."); }
    else if (isConfirmingFecharApostas) { setUiMessage("Processando fechamento de apostas..."); }
    else if (isConfirmedFecharApostas) {
        setUiMessageType('success'); setUiMessage("Apostas fechadas com sucesso!");
        setIsSubmitting(false); setAdminRodadaIdFechar(''); refreshAllContractData();
    } else if (simFecharApostasError || writeFecharApostasError || receiptFecharApostasError) {
        const error = simFecharApostasError || writeFecharApostasError || receiptFecharApostasError;
        setUiMessageType('error'); setUiMessage(`Erro ao fechar apostas: ${(error as any)?.cause?.shortMessage || (error as any)?.shortMessage || error?.message}`);
        setIsSubmitting(false);
    }
  }, [isWriteFecharApostasPending, isConfirmingFecharApostas, isConfirmedFecharApostas, simFecharApostasError, writeFecharApostasError, receiptFecharApostasError, refreshAllContractData]);


  // --- REGISTRAR RESULTADOS (Admin) ---
  // (Estrutura similar a iniciarNovaRodada e fecharApostas)
  // Args: [BigInt(adminRodadaIdResultados), adminMilhares.map(m => BigInt(m))]
  const { data: simRegResultData, error: simRegResultError, refetch: refetchSimRegResult } = useSimulateContract({
    address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: 'registrarResultadosDaFederalEProcessar',
    args: (adminRodadaIdResultados && adminMilhares.every(m => m !== "" && !isNaN(Number(m)))) ?
          [BigInt(adminRodadaIdResultados), adminMilhares.map(m => BigInt(m))] : undefined,
    query: { enabled: false, retry: false }, chainId: sepolia.id,
  });
  const { writeContract: writeRegResult, data: writeRegResultHash, isPending: isWriteRegResultPending, error: writeRegResultError } = useWriteContract();
  const { isLoading: isConfirmingRegResult, isSuccess: isConfirmedRegResult, error: receiptRegResultError } = useWaitForTransactionReceipt({ hash: writeRegResultHash, query: { enabled: !!writeRegResultHash }});

  const handleRegistrarResultados = async () => {
    if (!isOwner) { setUiMessageType('error'); setUiMessage("Ação restrita ao proprietário."); return; }
    if (!adminRodadaIdResultados || adminMilhares.some(m => m === "" || isNaN(Number(m)) || Number(m) < 0 || Number(m) > 9999)) {
        setUiMessageType('error'); setUiMessage("ID da rodada ou milhares inválidos."); return;
    }
    setIsSubmitting(true); setUiMessageType('info'); setUiMessage(`Preparando para registrar resultados da rodada ${adminRodadaIdResultados}...`);
    try {
        const simResult = await refetchSimRegResult();
        if (simResult.isError || !simResult.data?.request) {
            throw simResult.error || new Error("Falha na simulação de registrar resultados.");
        }
        setUiMessage("Aguardando assinatura na carteira...");
        writeRegResult(simResult.data.request);
    } catch (e: any) {
        setUiMessageType('error'); setUiMessage(`Erro ao registrar resultados: ${(e as any)?.cause?.shortMessage || (e as any)?.shortMessage || e.message}`);
        setIsSubmitting(false);
    }
  };
  useEffect(() => {
    if (isWriteRegResultPending) { setUiMessage("Aguardando assinatura para registrar resultados..."); }
    else if (isConfirmingRegResult) { setUiMessage("Processando registro de resultados..."); }
    else if (isConfirmedRegResult) {
        setUiMessageType('success'); setUiMessage("Resultados registrados com sucesso!");
        setIsSubmitting(false); setAdminRodadaIdResultados(''); setAdminMilhares(Array(5).fill('')); refreshAllContractData();
    } else if (simRegResultError || writeRegResultError || receiptRegResultError) {
        const error = simRegResultError || writeRegResultError || receiptRegResultError;
        setUiMessageType('error'); setUiMessage(`Erro ao registrar resultados: ${(error as any)?.cause?.shortMessage || (error as any)?.shortMessage || error?.message}`);
        setIsSubmitting(false);
    }
  }, [isWriteRegResultPending, isConfirmingRegResult, isConfirmedRegResult, simRegResultError, writeRegResultError, receiptRegResultError, refreshAllContractData]);


  // --- REIVINDICAR PRÊMIO (Usuário) ---
  // (Verificar premioParaReivindicarReadData e jaReivindicouReadData antes de simular/escrever)
  const { data: simReivindicarData, error: simReivindicarError, refetch: refetchSimReivindicar } = useSimulateContract({
    address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: 'reivindicarPremio',
    args: reivindicarRodadaId ? [BigInt(reivindicarRodadaId)] : undefined,
    query: { enabled: false, retry: false }, chainId: sepolia.id,
  });
  const { writeContract: writeReivindicar, data: writeReivindicarHash, isPending: isWriteReivindicarPending, error: writeReivindicarError } = useWriteContract();
  const { isLoading: isConfirmingReivindicar, isSuccess: isConfirmedReivindicar, error: receiptReivindicarError } = useWaitForTransactionReceipt({ hash: writeReivindicarHash, query: { enabled: !!writeReivindicarHash }});

  const handleReivindicarPremio = async () => {
    if (!isConnected || !address) { setUiMessageType('error'); setUiMessage("Conecte sua carteira."); return; }
    if (!reivindicarRodadaId) { setUiMessageType('error'); setUiMessage("Informe o ID da rodada."); return; }
    if (jaReivindicou) { setUiMessageType('info'); setUiMessage("Você já reivindicou o prêmio para esta rodada."); return; }
    if (!premioParaReivindicar || premioParaReivindicar === 0n) { setUiMessageType('info'); setUiMessage("Nenhum prêmio para reivindicar nesta rodada."); return; }

    setIsSubmitting(true); setUiMessageType('info'); setUiMessage(`Preparando para reivindicar prêmio da rodada ${reivindicarRodadaId}...`);
    try {
        const simResult = await refetchSimReivindicar();
        if (simResult.isError || !simResult.data?.request) {
            throw simResult.error || new Error("Falha na simulação de reivindicar prêmio.");
        }
        setUiMessage("Aguardando assinatura na carteira...");
        writeReivindicar(simResult.data.request);
    } catch (e: any) {
        setUiMessageType('error'); setUiMessage(`Erro ao reivindicar prêmio: ${(e as any)?.cause?.shortMessage || (e as any)?.shortMessage || e.message}`);
        setIsSubmitting(false);
    }
  };
  useEffect(() => {
    if (isWriteReivindicarPending) { setUiMessage("Aguardando assinatura para reivindicar prêmio..."); }
    else if (isConfirmingReivindicar) { setUiMessage("Processando reivindicação de prêmio..."); }
    else if (isConfirmedReivindicar) {
        setUiMessageType('success'); setUiMessage("Prêmio reivindicado com sucesso!");
        setIsSubmitting(false); setReivindicarRodadaId(''); setPremioParaReivindicar(null); setJaReivindicou(true);
        refreshAllContractData(); // Para atualizar saldos e potencialmente infos da rodada se ela mudar para PAGA
    } else if (simReivindicarError || writeReivindicarError || receiptReivindicarError) {
        const error = simReivindicarError || writeReivindicarError || receiptReivindicarError;
        setUiMessageType('error'); setUiMessage(`Erro ao reivindicar prêmio: ${(error as any)?.cause?.shortMessage || (error as any)?.shortMessage || error?.message}`);
        setIsSubmitting(false);
    }
  }, [isWriteReivindicarPending, isConfirmingReivindicar, isConfirmedReivindicar, simReivindicarError, writeReivindicarError, receiptReivindicarError, refreshAllContractData]);

  // Efeito para buscar dados do prêmio quando o ID da rodada de reivindicação mudar
  useEffect(() => {
    if (reivindicarRodadaId && address && isConnected && chain?.id === sepolia.id) {
        refetchPremioParaReivindicar();
        refetchJaReivindicou();
    } else {
        setPremioParaReivindicar(null);
        setJaReivindicou(false);
    }
  }, [reivindicarRodadaId, address, isConnected, chain, sepolia.id, refetchPremioParaReivindicar, refetchJaReivindicou]);


  // --- Outras Funções de Admin (Pausar, Despausar, Setar Taxas, etc.) ---
  // Implementar seguindo o mesmo padrão:
  // 1. useSimulateContract
  // 2. useWriteContract
  // 3. useWaitForTransactionReceipt
  // 4. Handler function
  // 5. useEffects para feedback

  const { writeContract: writePausar, data: writePausarHash, isPending: isWritePausarPending, error: writePausarError } = useWriteContract(); // etc. para pausar
  const handlePausar = async () => {
    if (!isOwner) { /* ... */ return; }
    // Idealmente simular antes, mas para funções simples sem args:
    setIsSubmitting(true); setUiMessageType('info'); setUiMessage("Pausando contrato...");
    try {
        writePausar({ address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: 'pausar' });
    } catch (e: any) { /* ... */ setIsSubmitting(false); }
  };
  // useEffect para writePausarHash...

  const { writeContract: writeDespausar, data: writeDespausarHash, isPending: isWriteDespausarPending, error: writeDespausarError } = useWriteContract();
  const handleDespausar = async () => {
    if (!isOwner) { /* ... */ return; }
    setIsSubmitting(true); setUiMessageType('info'); setUiMessage("Despausando contrato...");
    try {
        writeDespausar({ address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: 'despausar' });
    } catch (e: any) { /* ... */ setIsSubmitting(false); }
  };
  // useEffect para writeDespausarHash...


 const EmojisJogoDoBicho = () => null;

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', padding: '25px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9', fontFamily: 'Arial, sans-serif' }}>
      {showTestnetWarning && (null /* Seu comentário pode continuar aqui se quiser */ )}
      <h1 style={{ color: '#333', textAlign: 'center' }}>Blockchain Bet Brasil - O BBB da Web3 - Esse Jogo é Animal!</h1>
      <EmojisJogoDoBicho />

      {/* Mensagem UI Centralizada */}
      {uiMessage && (
        <p style={{ /* ... (seu estilo) ... */ }}>
          {uiMessage}
          {isConnected && chain && chain.id !== sepolia.id && switchChain && (
            <button onClick={() => switchChain({ chainId: sepolia.id })} disabled={isSwitchingChain || isSubmitting }
              style={{ /* ... (seu estilo) ... */ }}
            >
              {isSwitchingChain ? "Mudando..." : "Mudar para Rede Sepolia"}
            </button>
          )}
        </p>
      )}

      {/* Conexão Wallet */}
      {!isConnected ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={handleConnect} disabled={isConnecting || isConnectPending || isSubmitting}
            style={{ /* ... (seu estilo) ... */ }}
          >
            {isConnecting || isConnectPending ? 'Conectando...' : 'Conectar Wallet'}
          </button>
        </div>
      ) : (
        <div> {/* Conteúdo Principal Pós-Conexão */}
          <div style={{ textAlign: 'center', marginTop: '10px', marginBottom: '20px', fontSize: '0.9em', wordBreak: 'break-all' }}>
            <span>Owner: {contractOwner || "Carregando..."} {isOwner && "(Você é o Owner!)"}</span><br/>
            <span>Contrato Pausado: {isContractPaused ? "SIM" : "NÃO"}</span><br/>
            <span>Ticket Base: {ticketPriceBase ? formatEther(ticketPriceBase) : "N/A"} ETH</span> |
            <span> Taxa Plataforma: {taxaPlataforma ? taxaPlataforma.toString() : "N/A"}%</span>
          </div>

          <hr/>
          <h2>Informações da Rodada Atual #{rodadaAtualId ? rodadaAtualId.toString() : "N/A"}</h2>
          {(isLoadingRodadaInfo || isLoadingRodadaResultados) && <p>Carregando dados da rodada...</p>}
          {rodadaInfo && chain?.id === sepolia.id ? (
            <div>
              <p>Status: <strong>{STATUS_RODADA_MAP[rodadaInfo.status] || "Desconhecido"}</strong></p>
              <p>Preço do Ticket: {formatEther(rodadaInfo.ticketPrice)} ETH</p>
              <p>Total Arrecadado: {formatEther(rodadaInfo.totalArrecadado)} ETH</p>
              <p>Prêmio Total Estimado: {formatEther(rodadaInfo.premioTotal)} ETH</p>
              <p>Número de Apostas: {rodadaInfo.numApostas.toString()}</p>
              <p>Número de Vencedores: {rodadaInfo.numeroDeVencedores.toString()}</p>
              {rodadaResultados && rodadaResultados.milharesForamInseridos && (
                <div>
                    <h4>Resultados da Rodada:</h4>
                    <p>Milhares Sorteados: {rodadaResultados.milharesSorteados.map(m => m.toString()).join(', ')}</p>
                    <p>Resultados X: {rodadaResultados.resultadosX.map(x => x.toString()).join(', ')}</p>
                    <p>Resultados Y: {rodadaResultados.resultadosY.map(y => y.toString()).join(', ')}</p>
                </div>
              )}
            </div>
          ) : rodadaAtualId === 0n && chain?.id === sepolia.id ? (
            <p>Nenhuma rodada ativa no momento.</p>
          ) : !isConnected ? (
            <p>Conecte sua carteira.</p>
          ) : chain?.id !== sepolia.id ? (
            <p>Mude para a rede Sepolia.</p>
          ) : null}

          {/* Seção de Apostar (seu código com adaptações) */}
          {isConnected && chain?.id === sepolia.id && rodadaInfo && rodadaInfo.status === 1 && !isContractPaused && (
            <>
              <hr />
              <h3 style={{ /* ... */ }}>Ganha com 5, 4, 3, 2 e até com 1 ponto apenas!</h3>
              {/* ... (seu formulário de aposta) ... */}
               <div style={{ textAlign: 'center', marginTop: '25px' }}>
                <button onClick={handleSubmitBetClick}
                  disabled={isSubmitting || isPreparingBet || (rodadaInfo?.status !== 1)} // Adicionado rodadaInfo?.status !== 1
                  style={{ /* ... (seu estilo) ... */ }}
                >
                  {/* ... (sua lógica de texto do botão) ... */}
                  Apostar ({rodadaInfo ? formatEther(rodadaInfo.ticketPrice) : 'N/A'} ETH)
                </button>
              </div>
            </>
          )}
           {isConnected && chain?.id === sepolia.id && rodadaInfo && rodadaInfo.status !== 1 && (
            <p style={{textAlign: 'center', color: 'orange', marginTop: '15px'}}>
                Apostas para a rodada atual estão: {STATUS_RODADA_MAP[rodadaInfo.status]}.
            </p>
           )}
           {isConnected && chain?.id === sepolia.id && isContractPaused && (
            <p style={{textAlign: 'center', color: 'red', fontWeight: 'bold', marginTop: '15px'}}>
                O CONTRATO ESTÁ PAUSADO. NOVAS APOSTAS NÃO SÃO PERMITIDAS.
            </p>
           )}


          {/* Seção Reivindicar Prêmio */}
          {isConnected && chain?.id === sepolia.id && (
            <>
                <hr />
                <h2>Reivindicar Prêmio</h2>
                <div>
                    ID da Rodada: <input type="number" value={reivindicarRodadaId} onChange={(e) => setReivindicarRodadaId(e.target.value)} placeholder="Ex: 1" disabled={isSubmitting} />
                    {premioParaReivindicar !== null && reivindicarRodadaId && (
                        <p>
                            Prêmio a receber nesta rodada: {formatEther(premioParaReivindicar)} ETH.
                            {jaReivindicou && " (Você já reivindicou este prêmio)"}
                        </p>
                    )}
                    <button onClick={handleReivindicarPremio} disabled={isSubmitting || !reivindicarRodadaId || jaReivindicou || !premioParaReivindicar || premioParaReivindicar === 0n}>
                        {isSubmitting ? "Processando..." : "Reivindicar"}
                    </button>
                </div>
            </>
          )}


          {/* Painel de Admin */}
          {isOwner && isConnected && chain?.id === sepolia.id && (
            <>
              <hr style={{marginTop: '30px', marginBottom: '30px', borderTop: '2px dashed #ccc'}}/>
              <h2 style={{color: 'green', textAlign: 'center'}}>Painel do Administrador</h2>
              {isContractPaused && <p style={{color: 'red', textAlign: 'center', fontWeight: 'bold'}}>CONTRATO PAUSADO</p>}

              <div style={{border: '1px solid #eee', padding: '15px', marginBottom: '15px'}}>
                <h3>Controle de Pausa</h3>
                <button onClick={handlePausar} disabled={isSubmitting || isContractPaused}>Pausar Contrato</button>
                <button onClick={handleDespausar} disabled={isSubmitting || !isContractPaused} style={{marginLeft: '10px'}}>Despausar Contrato</button>
              </div>

              <div style={{border: '1px solid #eee', padding: '15px', marginBottom: '15px'}}>
                <h3>Gerenciar Rodada</h3>
                <div>
                  Preço do Ticket para Nova Rodada (ETH, opcional, ex: 0.01):
                  <input type="text" value={adminTicketPrice} onChange={(e) => setAdminTicketPrice(e.target.value)} placeholder="Padrão: Base" disabled={isSubmitting} />
                  <button onClick={handleIniciarNovaRodada} disabled={isSubmitting || isContractPaused}>Iniciar Nova Rodada</button>
                </div>
                <div style={{marginTop: '10px'}}>
                  ID da Rodada para Fechar (padrão: atual):
                  <input type="number" value={adminRodadaIdFechar} onChange={(e) => setAdminRodadaIdFechar(e.target.value)} placeholder={`Atual: ${rodadaAtualId?.toString()}`} disabled={isSubmitting} />
                  <button onClick={handleFecharApostas} disabled={isSubmitting || isContractPaused || !rodadaInfo || rodadaInfo.status !== 1}>Fechar Apostas</button>
                </div>
                <div style={{marginTop: '10px'}}>
                  <h4>Registrar Resultados da Federal</h4>
                  ID da Rodada: <input type="number" value={adminRodadaIdResultados} onChange={e => setAdminRodadaIdResultados(e.target.value)} placeholder="ID da Rodada Fechada" disabled={isSubmitting} />
                  <br/>
                  {Array(5).fill(0).map((_, i) => (
                    <div key={`milhar-adm-${i}`} style={{display: 'inline-block', marginRight: '10px'}}>
                      Milhar {i + 1}: <input type="number" style={{width: '80px'}} value={adminMilhares[i]} onChange={(e) => {
                        const newMilhares = [...adminMilhares]; newMilhares[i] = e.target.value; setAdminMilhares(newMilhares);
                      }} min="0" max="9999" disabled={isSubmitting} />
                    </div>
                  ))}
                  <button onClick={handleRegistrarResultados} disabled={isSubmitting || isContractPaused || !adminRodadaIdResultados || adminMilhares.some(m => m === "")}>Registrar Resultados</button>
                </div>
              </div>

              <div style={{border: '1px solid #eee', padding: '15px', marginBottom: '15px'}}>
                <h3>Configurações Globais</h3>
                <div>
                    Novo Preço Base do Ticket (ETH):
                    <input type="text" value={adminNovoTicketBase} onChange={e => setAdminNovoTicketBase(e.target.value)} placeholder={`Atual: ${ticketPriceBase ? formatEther(ticketPriceBase) : 'N/A'}`} disabled={isSubmitting}/>
                    {/* Implementar handleSetTicketPriceBase similar às outras funções de escrita */}
                    <button onClick={() => alert("TODO: handleSetTicketPriceBase")} disabled={isSubmitting || isContractPaused}>Atualizar Preço Base</button>
                </div>
                <div style={{marginTop: '10px'}}>
                    Nova Taxa da Plataforma (%):
                    <input type="number" value={adminNovaTaxaPlat} onChange={e => setAdminNovaTaxaPlat(e.target.value)} placeholder={`Atual: ${taxaPlataforma ? taxaPlataforma.toString() : 'N/A'}`} disabled={isSubmitting}/>
                    {/* Implementar handleSetTaxaPlataforma similar */}
                    <button onClick={() => alert("TODO: handleSetTaxaPlataforma")} disabled={isSubmitting || isContractPaused}>Atualizar Taxa</button>
                </div>
              </div>
              <div style={{border: '1px solid #eee', padding: '15px', marginBottom: '15px'}}>
                <h3>Finanças</h3>
                <p>Taxas Acumuladas: {taxasAcumuladas ? formatEther(taxasAcumuladas) : "0.00"} ETH</p>
                Endereço para Retirar Taxas:
                <input type="text" value={adminRetirarTaxasPara} onChange={e => setAdminRetirarTaxasPara(e.target.value)} placeholder={address || "Seu endereço"} style={{width: '300px'}} disabled={isSubmitting}/>
                {/* Implementar handleRetirarTaxas similar */}
                <button onClick={() => alert("TODO: handleRetirarTaxas")} disabled={isSubmitting || !taxasAcumuladas || taxasAcumuladas === 0n}>Retirar Taxas</button>
              </div>
            </>
          )}

          {/* Botão de Desconectar */}
          {isConnected && (
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button onClick={() => disconnect()} style={{ /* ... (seu estilo) ... */ }} disabled={isSubmitting}>
                Desconectar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}