"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSimulateContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useBalance,
  useSwitchChain,
  useReadContract,
} from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { parseEther, formatEther, Address } from 'viem';
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

const STATUS_RODADA_MAP: { [key: number]: string } = {
    0: "INATIVA",
    1: "ABERTA",
    2: "FECHADA",
    3: "RESULTADO DISPONÍVEL",
    4: "PAGA"
};

interface RodadaInfo {
    id: bigint;
    status: number;
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

  const [prognosticos, setPrognosticos] = useState<string[]>(Array(5).fill(""));
  const [numerosXParaEnviar, setNumerosXParaEnviar] = useState<number[]>([]);
  const [numerosYParaEnviar, setNumerosYParaEnviar] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uiMessage, setUiMessage] = useState<string | null>(null);
  const [uiMessageType, setUiMessageType] = useState<'success' | 'error' | 'info' | null>(null);
  const [isPreparingBet, setIsPreparingBet] = useState(false);
  const [showTestnetWarning, setShowTestnetWarning] = useState(true); // Mantenha true se quiser o aviso

  const [contractOwner, setContractOwner] = useState<Address | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [rodadaAtualId, setRodadaAtualId] = useState<bigint | null>(null);
  const [rodadaInfo, setRodadaInfo] = useState<RodadaInfo | null>(null);
  const [rodadaResultados, setRodadaResultados] = useState<RodadaResultados | null>(null);
  const [ticketPriceBase, setTicketPriceBase] = useState<bigint | null>(null);
  const [taxaPlataforma, setTaxaPlataforma] = useState<bigint | null>(null);
  const [isContractPaused, setIsContractPaused] = useState<boolean>(false);
  const [taxasAcumuladas, setTaxasAcumuladas] = useState<bigint | null>(null);

  const [adminTicketPrice, setAdminTicketPrice] = useState('');
  const [adminRodadaIdFechar, setAdminRodadaIdFechar] = useState('');
  const [adminRodadaIdResultados, setAdminRodadaIdResultados] = useState('');
  const [adminMilhares, setAdminMilhares] = useState<string[]>(Array(5).fill(''));
  const [adminNovoTicketBase, setAdminNovoTicketBase] = useState('');
  const [adminNovaTaxaPlat, setAdminNovaTaxaPlat] = useState('');
  const [adminRetirarTaxasPara, setAdminRetirarTaxasPara] = useState('');

  const [reivindicarRodadaId, setReivindicarRodadaId] = useState('');
  const [premioParaReivindicar, setPremioParaReivindicar] = useState<bigint | null>(null);
  const [jaReivindicou, setJaReivindicou] = useState<boolean>(false);

  // --- Hooks useReadContract ---
  const { data: balanceData, isLoading: isBalanceLoading, error: balanceError, refetch: refetchBalance } = useBalance({
    address: address,
    chainId: sepolia.id,
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
    query: { enabled: isConnected && chain?.id === sepolia.id && rodadaAtualId !== null && rodadaAtualId !== 0n && rodadaInfo?.status !== 0 && rodadaInfo?.status !== 1 },
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

  const refreshAllContractData = useCallback(async () => {
    if (isConnected && chain?.id === sepolia.id) {
        console.log("Refreshing all contract data...");
        await refetchOwner();
        const idData = await refetchRodadaAtualId();
        if (idData && typeof idData.data === 'bigint' && idData.data !== 0n) {
             await refetchRodadaInfo();
             await refetchRodadaResultados();
        } else if (idData && typeof idData.data === 'bigint' && idData.data === 0n) {
            setRodadaInfo(null); // Limpa info da rodada se ID for 0
            setRodadaResultados(null);
        }
        await refetchTicketPriceBase();
        await refetchTaxaPlataforma();
        await refetchPaused();
        if (isOwner) await refetchTaxasAcumuladas();
        if (address) await refetchBalance();
    }
  }, [isConnected, chain, address, isOwner, refetchOwner, refetchRodadaAtualId, refetchRodadaInfo, refetchRodadaResultados, refetchTicketPriceBase, refetchTaxaPlataforma, refetchPaused, refetchTaxasAcumuladas, refetchBalance, sepolia.id]);

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

  useEffect(() => {
    if (isConnected && chain && chain.id !== sepolia.id) {
      setUiMessageType('error');
      setUiMessage(`ATENÇÃO: Você está conectado à rede ${chain.name}, mas este DApp opera na rede Sepolia. Por favor, mude sua carteira para a rede Sepolia.`);
    } else if (isConnected && chain && chain.id === sepolia.id) {
        if (uiMessage?.startsWith("ATENÇÃO: Você está conectado à rede")) {
            setUiMessage(null);
            setUiMessageType(null);
        }
        let connectedMessage = `Carteira: ${address?.substring(0, 6)}...${address?.substring(address.length - 4)}`;
        if (isBalanceLoading) connectedMessage += " (Carregando saldo...)";
        else if (balanceError) connectedMessage += ` (Erro saldo: ${(balanceError as any)?.shortMessage || balanceError.message})`;
        else if (balanceData) connectedMessage += ` | Saldo: ${balanceData.formatted} ${balanceData.symbol}`;

        if (!uiMessage || uiMessageType === null || uiMessageType === 'success' || uiMessage === "Conectando carteira...") {
             setUiMessageType('success');
             setUiMessage(connectedMessage);
        }
    }
  }, [isConnected, chain, sepolia.id, uiMessage, uiMessageType, address, balanceData, balanceError, isBalanceLoading]);

  useEffect(() => {
    if (isConnecting || isConnectPending) {
      setUiMessageType('info');
      setUiMessage("Conectando carteira...");
    } else if (connectError) {
      setUiMessageType('error');
      setUiMessage(`Erro ao conectar: ${(connectError as any)?.shortMessage || connectError.message}`);
    } else if (!isConnected && uiMessage !== "Conecte sua carteira para apostar." && !uiMessage?.startsWith("Erro ao conectar:")) {
       setUiMessageType(null);
       setUiMessage("Conecte sua carteira para apostar.");
    }
  }, [isConnected, connectError, isConnecting, isConnectPending, uiMessage]);

  useEffect(() => {
    if(isSwitchingChain) {
        setUiMessageType('info');
        setUiMessage("Mudando de rede...");
    } else if (switchChainError) {
        setUiMessageType('error');
        setUiMessage(`Erro ao mudar de rede: ${switchChainError.message}`);
    }
  }, [isSwitchingChain, switchChainError]);

  useEffect(() => {
    if (isConnected && chain?.id === sepolia.id) {
        refreshAllContractData();
    }
  }, [isConnected, chain, sepolia.id, refreshAllContractData]);

  const handleConnect = () => {
    if (connectors.length > 0) {
        // Idealmente, permitir ao usuário escolher o conector se houver mais de um.
        // Por simplicidade, conectar com o primeiro disponível (ex: Injected/Metamask).
        const preferredConnector = connectors.find(c => c.id === 'io.metamask') || connectors[0];
        if (preferredConnector) {
            connect({ connector: preferredConnector, chainId: sepolia.id });
        } else {
            setUiMessageType('error');
            setUiMessage("Nenhum conector de carteira encontrado.");
        }
    } else {
        setUiMessageType('error');
        setUiMessage("Nenhum conector de carteira disponível.");
    }
  };

  const handleInputChange = (index: number, value: string) => {
    const novosPrognosticos = [...prognosticos];
    novosPrognosticos[index] = value;
    setPrognosticos(novosPrognosticos);
  };

  const prepararNumerosParaAposta = (): boolean => {
    setUiMessage(null);
    setUiMessageType(null);

    const prognosticosPreenchidos = prognosticos.filter(p => p.trim() !== "");

    if (prognosticosPreenchidos.length === 0) {
      setUiMessageType('error');
      setUiMessage("Por favor, preencha pelo menos um prognóstico para apostar.");
      return false;
    }

    if (prognosticosPreenchidos.length !== prognosticos.length) {
        setUiMessageType('error');
        setUiMessage(`Por favor, preencha todos os ${prognosticos.length} campos de prognóstico.`);
        return false;
    }

    const novosNumerosX: number[] = [];
    const novosNumerosY: number[] = [];

    for (let i = 0; i < prognosticosPreenchidos.length; i++) {
      const prognostico = prognosticosPreenchidos[i];
      if (!validPrognosticsSet.has(prognostico)) {
        setUiMessageType('error');
        setUiMessage(`Prognóstico "${prognostico}" (no campo ${i + 1}) é inválido. Use o formato NÚMERO/NÚMERO, com números de 1 a 25.`);
        return false;
      }
      const partes = prognostico.split('/');
      const x = parseInt(partes[0], 10);
      const y = parseInt(partes[1], 10);
      novosNumerosX.push(x);
      novosNumerosY.push(y);
    }

    setNumerosXParaEnviar(novosNumerosX);
    setNumerosYParaEnviar(novosNumerosY);
    console.log("Números preparados para aposta:", novosNumerosX, novosNumerosY);
    return true;
  };

  const { data: simulateData, error: simulateError, refetch: refetchSimulate, isLoading: isSimulating } = useSimulateContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'apostar',
    args: [numerosXParaEnviar, numerosYParaEnviar], // Estes serão atualizados antes do refetchSimulate
    value: (rodadaInfo && rodadaInfo.ticketPrice) ? rodadaInfo.ticketPrice : parseEther('0.01'), // Atualizado antes do refetchSimulate
    query: { enabled: false, retry: false, },
    chainId: sepolia.id
  });
  const { writeContract, data: writeTxHash, isPending: isWritePending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: receiptError } = useWaitForTransactionReceipt({
    hash: writeTxHash,
    query: { enabled: !!writeTxHash, }
  });

  useEffect(() => {
    if (isSimulating) {
        // A mensagem de "Simulando transação da aposta..." já é setada no useEffect de executeAposta
    } else if (isWritePending) {
        setUiMessageType('info');
        setUiMessage("Aguardando aprovação da transação na carteira...");
    } else if (isConfirming) {
        setUiMessageType('info');
        setUiMessage(`Processando aposta... Hash: ${writeTxHash?.substring(0,10)}...`);
    }
  }, [isSimulating, isWritePending, isConfirming, writeTxHash]);

  useEffect(() => {
    if (isConfirmed && writeTxHash) {
      setUiMessageType('success');
      setUiMessage(`Aposta realizada com sucesso! Hash: ${writeTxHash.substring(0,10)}...`);
      setPrognosticos(Array(5).fill(""));
      setNumerosXParaEnviar([]);
      setNumerosYParaEnviar([]);
      setIsSubmitting(false);
      setIsPreparingBet(false); // <<< Adicionado
      refreshAllContractData();
    }
  }, [isConfirmed, writeTxHash, refreshAllContractData]);

  useEffect(() => {
    let errorToSet: string | null = null;
    let typeToSet: 'error' | null = null;

    if (simulateError) {
      errorToSet = `Erro ao simular aposta: ${(simulateError as any)?.cause?.shortMessage || (simulateError as any)?.shortMessage || simulateError.message}`;
      typeToSet = 'error';
    } else if (writeError) {
      errorToSet = `Erro ao enviar aposta: ${(writeError as any)?.cause?.shortMessage || (writeError as any)?.shortMessage || writeError.message}`;
      typeToSet = 'error';
    } else if (receiptError) {
      errorToSet = `Erro na confirmação da aposta: ${receiptError.message}`;
      typeToSet = 'error';
    }

    if (errorToSet) {
      setUiMessageType(typeToSet);
      setUiMessage(errorToSet);
      setIsSubmitting(false);
      setIsPreparingBet(false); // <<< Adicionado
    }
  }, [simulateError, writeError, receiptError]);

  const handleSubmitBetClick = () => {
    if (!isConnected || !address) {
      setUiMessageType('error');
      setUiMessage("Conecte sua carteira para apostar.");
      return;
    }
    if (chain && chain.id !== sepolia.id) {
      setUiMessageType('error');
      setUiMessage("Por favor, mude sua carteira para a rede Sepolia para apostar.");
      return;
    }
    if (!rodadaInfo || rodadaInfo.status !== 1) {
      setUiMessageType('error');
      setUiMessage(rodadaInfo ? `Apostas para esta rodada estão ${STATUS_RODADA_MAP[rodadaInfo.status].toLowerCase()}.` : "Informações da rodada não carregadas ou rodada não está aberta.");
      return;
    }
     if (isContractPaused) {
      setUiMessageType('error');
      setUiMessage("O contrato está pausado. Novas apostas não são permitidas no momento.");
      return;
    }

    if (prepararNumerosParaAposta()) {
      setIsPreparingBet(true);
      setUiMessageType('info');
      setUiMessage("Validando prognósticos e preparando aposta...");
    } else {
      setIsPreparingBet(false);
    }
  };

  useEffect(() => {
    if (!isPreparingBet || numerosXParaEnviar.length === 0 || numerosYParaEnviar.length === 0) {
      return;
    }
    if (chain && chain.id !== sepolia.id) {
      setUiMessageType('error');
      setUiMessage("Mude para a rede Sepolia antes de prosseguir com a aposta.");
      setIsPreparingBet(false);
      setIsSubmitting(false);
      return;
    }

    const executeAposta = async () => {
      if (!rodadaInfo || !rodadaInfo.ticketPrice) {
        setUiMessageType('error');
        setUiMessage("Não foi possível obter o preço do ticket da rodada.");
        setIsPreparingBet(false);
        setIsSubmitting(false);
        return;
      }
      
      setIsSubmitting(true);
      setUiMessageType('info');
      setUiMessage("Simulando transação da aposta...");

      try {
        const simulation = await refetchSimulate();
        if (simulation.isError || !simulation.data?.request) {
          console.error("Erro na simulação:", simulation.error);
          const errorMsg = (simulation.error as any)?.cause?.shortMessage || (simulation.error as any)?.shortMessage || simulation.error?.message || "Erro desconhecido na simulação.";
          setUiMessageType('error');
          setUiMessage(`Erro ao simular aposta: ${errorMsg}`);
          setIsPreparingBet(false);
          setIsSubmitting(false);
          return;
        }
        setUiMessage("Simulação bem-sucedida. Por favor, aprove a transação na sua carteira.");
        writeContract(simulation.data.request);
      } catch (e: any) {
        console.error("Exceção ao executar aposta:", e);
        const errorMsg = (e as any)?.cause?.shortMessage || (e as any)?.shortMessage || e.message || "Erro inesperado ao preparar aposta.";
        setUiMessageType('error');
        setUiMessage(`Erro: ${errorMsg}`);
        setIsPreparingBet(false);
        setIsSubmitting(false);
      }
    };
    executeAposta();
  }, [isPreparingBet, numerosXParaEnviar, numerosYParaEnviar, refetchSimulate, writeContract, chain, sepolia.id, rodadaInfo, setIsSubmitting, setUiMessageType, setUiMessage]);

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

  const { data: simFecharApostasData, error: simFecharApostasError, refetch: refetchSimFecharApostas } = useSimulateContract({
    address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: 'fecharApostas',
    args: adminRodadaIdFechar ? [BigInt(adminRodadaIdFechar)] : (rodadaAtualId && rodadaAtualId !== 0n ? [rodadaAtualId] : undefined),
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
        const simResult = await refetchSimFecharApostas();
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
        refreshAllContractData();
    } else if (simReivindicarError || writeReivindicarError || receiptReivindicarError) {
        const error = simReivindicarError || writeReivindicarError || receiptReivindicarError;
        setUiMessageType('error'); setUiMessage(`Erro ao reivindicar prêmio: ${(error as any)?.cause?.shortMessage || (error as any)?.shortMessage || error?.message}`);
        setIsSubmitting(false);
    }
  }, [isWriteReivindicarPending, isConfirmingReivindicar, isConfirmedReivindicar, simReivindicarError, writeReivindicarError, receiptReivindicarError, refreshAllContractData]);

  useEffect(() => {
    if (reivindicarRodadaId && address && isConnected && chain?.id === sepolia.id) {
        refetchPremioParaReivindicar();
        refetchJaReivindicou();
    } else {
        setPremioParaReivindicar(null);
        setJaReivindicou(false);
    }
  }, [reivindicarRodadaId, address, isConnected, chain, sepolia.id, refetchPremioParaReivindicar, refetchJaReivindicou]);

  // --- Efeitos para Pausar/Despausar ---
  // (Simulação omitida por simplicidade, adicione se necessário)
  const { data: writePausarTxData, isPending: isPausarPending, error: pausarError, writeContract: execPausar } = useWriteContract();
  const { isSuccess: isPausarSuccess, isLoading: isPausarConfirming, error: pausarReceiptError } = useWaitForTransactionReceipt({ hash: writePausarTxData });
  const { data: writeDespausarTxData, isPending: isDespausarPending, error: despausarError, writeContract: execDespausar } = useWriteContract();
  const { isSuccess: isDespausarSuccess, isLoading: isDespausarConfirming, error: despausarReceiptError } = useWaitForTransactionReceipt({ hash: writeDespausarTxData });

  const handlePausar = async () => {
    if (!isOwner) { setUiMessageType('error'); setUiMessage("Ação restrita ao proprietário."); return; }
    setIsSubmitting(true); setUiMessageType('info'); setUiMessage("Pausando contrato...");
    try {
        execPausar({ address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: 'pausar' });
    } catch (e: any) {
        setUiMessageType('error'); setUiMessage(`Erro ao pausar: ${e.message}`);
        setIsSubmitting(false);
    }
  };
   useEffect(() => {
    if (isPausarPending) { setUiMessage("Aguardando assinatura para pausar..."); }
    else if (isPausarConfirming) { setUiMessage("Processando pausa do contrato..."); }
    else if (isPausarSuccess) {
        setUiMessageType('success'); setUiMessage("Contrato pausado com sucesso!");
        setIsSubmitting(false); refreshAllContractData();
    } else if (pausarError || pausarReceiptError) {
        const error = pausarError || pausarReceiptError;
        setUiMessageType('error'); setUiMessage(`Erro ao pausar: ${(error as any)?.cause?.shortMessage || (error as any)?.shortMessage || error?.message}`);
        setIsSubmitting(false);
    }
  }, [isPausarPending, isPausarConfirming, isPausarSuccess, pausarError, pausarReceiptError, refreshAllContractData]);


  const handleDespausar = async () => {
    if (!isOwner) { setUiMessageType('error'); setUiMessage("Ação restrita ao proprietário."); return; }
    setIsSubmitting(true); setUiMessageType('info'); setUiMessage("Despausando contrato...");
    try {
        execDespausar({ address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: 'despausar' });
    } catch (e: any) {
        setUiMessageType('error'); setUiMessage(`Erro ao despausar: ${e.message}`);
        setIsSubmitting(false);
    }
  };
  useEffect(() => {
    if (isDespausarPending) { setUiMessage("Aguardando assinatura para despausar..."); }
    else if (isDespausarConfirming) { setUiMessage("Processando despausa do contrato..."); }
    else if (isDespausarSuccess) {
        setUiMessageType('success'); setUiMessage("Contrato despausado com sucesso!");
        setIsSubmitting(false); refreshAllContractData();
    } else if (despausarError || despausarReceiptError) {
        const error = despausarError || despausarReceiptError;
        setUiMessageType('error'); setUiMessage(`Erro ao despausar: ${(error as any)?.cause?.shortMessage || (error as any)?.shortMessage || error?.message}`);
        setIsSubmitting(false);
    }
  }, [isDespausarPending, isDespausarConfirming, isDespausarSuccess, despausarError, despausarReceiptError, refreshAllContractData]);


 const EmojisJogoDoBicho = () => null; // Placeholder

  // --- ESTILOS (exemplo, você pode mover para um arquivo CSS) ---
  const buttonStyle = {
    backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', margin: '5px',
    border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1em'
  };
  const disabledButtonStyle = { ...buttonStyle, backgroundColor: '#ccc', cursor: 'not-allowed' };
  const inputStyle = { padding: '8px', margin: '5px', borderRadius: '4px', border: '1px solid #ccc', width: 'calc(100% - 22px)' };
  const errorStyle = { backgroundColor: '#ffdddd', borderLeft: '6px solid #f44336', color: 'black', padding: '10px', marginTop: '15px', marginBottom: '15px' };
  const successStyle = { backgroundColor: '#ddffdd', borderLeft: '6px solid #4CAF50', color: 'black', padding: '10px', marginTop: '15px', marginBottom: '15px' };
  const infoStyle = { backgroundColor: '#e7f3fe', borderLeft: '6px solid #2196F3', color: 'black', padding: '10px', marginTop: '15px', marginBottom: '15px' };


  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', padding: '25px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9', fontFamily: 'Arial, sans-serif' }}>
      {showTestnetWarning && (
        <div style={{ backgroundColor: 'orange', color: 'black', padding: '10px', textAlign: 'center', fontWeight: 'bold', marginBottom: '15px' }}>
            ⚠️ ATENÇÃO: Este site está em FASE DE TESTES utilizando a rede de teste Sepolia. NÃO UTILIZE FUNDOS REAIS.
        </div>
      )}
      <h1 style={{ color: '#333', textAlign: 'center' }}>Blockchain Bet Brasil - O BBB da Web3 - Esse Jogo é Animal!</h1>
      <EmojisJogoDoBicho />

      {uiMessage && (
        <p style={
            uiMessageType === 'error' ? errorStyle :
            uiMessageType === 'success' ? successStyle :
            uiMessageType === 'info' ? infoStyle :
            { padding: '10px', textAlign: 'center', marginTop: '15px', marginBottom: '15px' }
        }>
          {uiMessage}
          {isConnected && chain && chain.id !== sepolia.id && switchChain && (
            <button
                onClick={() => switchChain({ chainId: sepolia.id })}
                disabled={isSwitchingChain || isSubmitting }
                style={isSwitchingChain || isSubmitting ? disabledButtonStyle : buttonStyle}
            >
              {isSwitchingChain ? "Mudando..." : "Mudar para Rede Sepolia"}
            </button>
          )}
        </p>
      )}

      {!isConnected ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={handleConnect}
            disabled={isConnecting || isConnectPending || isSubmitting}
            style={(isConnecting || isConnectPending || isSubmitting) ? disabledButtonStyle : buttonStyle}
          >
            {isConnecting || isConnectPending ? 'Conectando...' : 'Conectar Wallet'}
          </button>
        </div>
      ) : (
        <div>
          <div style={{ textAlign: 'center', marginTop: '10px', marginBottom: '20px', fontSize: '0.9em', wordBreak: 'break-all', border: '1px solid #eee', padding: '10px', borderRadius: '4px' }}>
            <span>Owner: {contractOwner ? `${contractOwner.substring(0,6)}...${contractOwner.substring(contractOwner.length - 4)}` : "Carregando..."} {isOwner && <strong style={{color: 'green'}}>(Você é o Owner!)</strong>}</span><br/>
            <span>Contrato Pausado: <strong style={{color: isContractPaused ? 'red' : 'green'}}>{isContractPaused ? "SIM" : "NÃO"}</strong></span><br/>
            <span>Ticket Base: {ticketPriceBase ? formatEther(ticketPriceBase) : "N/A"} ETH</span> |
            <span> Taxa Plataforma: {taxaPlataforma ? taxaPlataforma.toString() : "N/A"}%</span>
          </div>

          <hr/>
          <h2>Informações da Rodada Atual #{rodadaAtualId ? rodadaAtualId.toString() : "N/A"}</h2>
          {(isLoadingRodadaInfo || isLoadingRodadaResultados) && <p>Carregando dados da rodada...</p>}
          {rodadaInfo && chain?.id === sepolia.id ? (
            <div style={{border: '1px solid #eee', padding: '15px', borderRadius: '4px', marginBottom: '20px'}}>
              <p>Status: <strong>{STATUS_RODADA_MAP[rodadaInfo.status] || "Desconhecido"}</strong></p>
              <p>Preço do Ticket: {formatEther(rodadaInfo.ticketPrice)} ETH</p>
              <p>Total Arrecadado: {formatEther(rodadaInfo.totalArrecadado)} ETH</p>
              <p>Prêmio Total Estimado: {formatEther(rodadaInfo.premioTotal)} ETH</p>
              <p>Número de Apostas: {rodadaInfo.numApostas.toString()}</p>
              <p>Número de Vencedores: {rodadaInfo.numeroDeVencedores.toString()}</p>
              {rodadaResultados && rodadaResultados.milharesForamInseridos && (
                <div>
                    <h4>Resultados da Rodada #{rodadaInfo.id.toString()}:</h4>
                    <p>Milhares Sorteados: {rodadaResultados.milharesSorteados.map(m => m.toString().padStart(4, '0')).join(', ')}</p>
                    <p>Resultados X: {rodadaResultados.resultadosX.map(x => x.toString()).join(', ')}</p>
                    <p>Resultados Y: {rodadaResultados.resultadosY.map(y => y.toString()).join(', ')}</p>
                </div>
              )}
            </div>
          ) : rodadaAtualId === 0n && chain?.id === sepolia.id && !isLoadingRodadaInfo ? (
            <p>Nenhuma rodada ativa no momento. O proprietário pode iniciar uma nova rodada.</p>
          ) : !isConnected ? (
            <p>Conecte sua carteira.</p>
          ) : chain?.id !== sepolia.id ? (
            <p>Mude para a rede Sepolia.</p>
          ) : isLoadingRodadaInfo ? null : (
             <p>Não foi possível carregar informações da rodada. Tente atualizar a página ou verifique sua conexão.</p>
          )}

          {isConnected && chain?.id === sepolia.id && rodadaInfo && rodadaInfo.status === 1 && !isContractPaused && (
            <>
              <hr />
              <h3 style={{ textAlign: 'center', color: '#4CAF50' }}>Faça sua Aposta na Rodada #{rodadaInfo.id.toString()}!</h3>
              <p style={{textAlign: 'center', fontSize: '0.9em'}}>Ganha com 5, 4, 3, 2 e até com 1 ponto apenas!</p>
              <div style={{ margin: '20px 0' }}>
                {prognosticos.map((prog, index) => (
                  <div key={index} style={{ marginBottom: '10px' }}>
                    <label htmlFor={`prognostico-${index}`} style={{ display: 'block', marginBottom: '5px' }}>
                      Prognóstico {index + 1} (X/Y):
                    </label>
                    <input
                      id={`prognostico-${index}`}
                      type="text"
                      value={prog}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      placeholder="Ex: 12/25"
                      style={inputStyle}
                      disabled={isSubmitting || isPreparingBet}
                    />
                  </div>
                ))}
              </div>
               <div style={{ textAlign: 'center', marginTop: '25px' }}>
                <button
                  onClick={handleSubmitBetClick}
                  disabled={isSubmitting || isPreparingBet || (rodadaInfo?.status !== 1) || isContractPaused}
                  style={(isSubmitting || isPreparingBet || (rodadaInfo?.status !== 1) || isContractPaused) ? disabledButtonStyle : buttonStyle}
                >
                  {isPreparingBet ? "Preparando..." : isSubmitting ? "Processando Aposta..." : `Apostar (${rodadaInfo ? formatEther(rodadaInfo.ticketPrice) : 'N/A'} ETH)`}
                </button>
              </div>
            </>
          )}
           {isConnected && chain?.id === sepolia.id && rodadaInfo && rodadaInfo.status !== 1 && (
            <p style={{textAlign: 'center', color: 'orange', fontWeight: 'bold', marginTop: '15px'}}>
                Apostas para a rodada atual estão: {STATUS_RODADA_MAP[rodadaInfo.status]}.
            </p>
           )}
           {isConnected && chain?.id === sepolia.id && isContractPaused && (
            <p style={{textAlign: 'center', color: 'red', fontWeight: 'bold', marginTop: '15px'}}>
                O CONTRATO ESTÁ PAUSADO. NOVAS APOSTAS NÃO SÃO PERMITIDAS.
            </p>
           )}

          {isConnected && chain?.id === sepolia.id && (
            <>
                <hr style={{marginTop: '30px'}} />
                <h2 style={{textAlign: 'center'}}>Reivindicar Prêmio</h2>
                <div style={{border: '1px solid #eee', padding: '15px', borderRadius: '4px', marginBottom: '20px'}}>
                    ID da Rodada: <input type="number" value={reivindicarRodadaId} onChange={(e) => setReivindicarRodadaId(e.target.value)} placeholder="Ex: 1" disabled={isSubmitting} style={{...inputStyle, width: '100px', marginRight: '10px'}} />
                    <button
                        onClick={handleReivindicarPremio}
                        disabled={isSubmitting || !reivindicarRodadaId || jaReivindicou || !premioParaReivindicar || premioParaReivindicar === 0n}
                        style={(isSubmitting || !reivindicarRodadaId || jaReivindicou || !premioParaReivindicar || premioParaReivindicar === 0n) ? disabledButtonStyle : buttonStyle}
                    >
                        {isSubmitting ? "Processando..." : "Reivindicar Prêmio"}
                    </button>
                    {premioParaReivindicar !== null && reivindicarRodadaId && (
                        <p style={{marginTop: '10px'}}>
                            Prêmio a receber para rodada #{reivindicarRodadaId}: <strong>{formatEther(premioParaReivindicar)} ETH</strong>.
                            {jaReivindicou && <span style={{color: 'green', fontWeight: 'bold'}}> (Você já reivindicou este prêmio)</span>}
                        </p>
                    )}
                     {!premioParaReivindicar && reivindicarRodadaId && !jaReivindicou && (
                        <p style={{marginTop: '10px'}}>Nenhum prêmio para reivindicar nesta rodada ou dados ainda não carregados.</p>
                    )}
                </div>
            </>
          )}

          {isOwner && isConnected && chain?.id === sepolia.id && (
            <>
              <hr style={{marginTop: '30px', marginBottom: '30px', borderTop: '2px dashed #ccc'}}/>
              <h2 style={{color: 'green', textAlign: 'center'}}>Painel do Administrador</h2>
              {isContractPaused && <p style={{color: 'red', textAlign: 'center', fontWeight: 'bold'}}>CONTRATO PAUSADO</p>}

              <div style={{border: '1px solid #eee', padding: '15px', marginBottom: '15px', borderRadius: '4px'}}>
                <h3>Controle de Pausa</h3>
                <button onClick={handlePausar} disabled={isSubmitting || isContractPaused || isPausarPending || isPausarConfirming} style={(isSubmitting || isContractPaused || isPausarPending || isPausarConfirming) ? disabledButtonStyle : buttonStyle}>
                    {isPausarPending || isPausarConfirming ? "Pausando..." : "Pausar Contrato"}
                </button>
                <button onClick={handleDespausar} disabled={isSubmitting || !isContractPaused || isDespausarPending || isDespausarConfirming} style={{marginLeft: '10px', ...((isSubmitting || !isContractPaused || isDespausarPending || isDespausarConfirming) ? disabledButtonStyle : buttonStyle)}}>
                    {isDespausarPending || isDespausarConfirming ? "Despausando..." : "Despausar Contrato"}
                </button>
              </div>

              <div style={{border: '1px solid #eee', padding: '15px', marginBottom: '15px', borderRadius: '4px'}}>
                <h3>Gerenciar Rodada</h3>
                <div>
                  Preço do Ticket para Nova Rodada (ETH, opcional, ex: 0.01):
                  <input type="text" value={adminTicketPrice} onChange={(e) => setAdminTicketPrice(e.target.value)} placeholder="Padrão: Base" disabled={isSubmitting || isWriteIniciarRodadaPending || isConfirmingIniciarRodada} style={inputStyle} />
                  <button onClick={handleIniciarNovaRodada} disabled={isSubmitting || isContractPaused || isWriteIniciarRodadaPending || isConfirmingIniciarRodada} style={(isSubmitting || isContractPaused || isWriteIniciarRodadaPending || isConfirmingIniciarRodada) ? disabledButtonStyle : buttonStyle}>
                    {isWriteIniciarRodadaPending || isConfirmingIniciarRodada ? "Iniciando..." : "Iniciar Nova Rodada"}
                  </button>
                </div>
                <div style={{marginTop: '10px'}}>
                  ID da Rodada para Fechar (padrão: atual):
                  <input type="number" value={adminRodadaIdFechar} onChange={(e) => setAdminRodadaIdFechar(e.target.value)} placeholder={`Atual: ${rodadaAtualId?.toString() || 'N/A'}`} disabled={isSubmitting || isWriteFecharApostasPending || isConfirmingFecharApostas} style={inputStyle} />
                  <button onClick={handleFecharApostas} disabled={isSubmitting || isContractPaused || !rodadaInfo || rodadaInfo.status !== 1 || isWriteFecharApostasPending || isConfirmingFecharApostas} style={(isSubmitting || isContractPaused || !rodadaInfo || rodadaInfo.status !== 1 || isWriteFecharApostasPending || isConfirmingFecharApostas) ? disabledButtonStyle : buttonStyle}>
                    {isWriteFecharApostasPending || isConfirmingFecharApostas ? "Fechando..." : "Fechar Apostas"}
                  </button>
                </div>
                <div style={{marginTop: '10px'}}>
                  <h4>Registrar Resultados da Federal</h4>
                  ID da Rodada: <input type="number" value={adminRodadaIdResultados} onChange={e => setAdminRodadaIdResultados(e.target.value)} placeholder="ID da Rodada Fechada" disabled={isSubmitting || isWriteRegResultPending || isConfirmingRegResult} style={{...inputStyle, width: 'auto', marginRight: '10px'}} />
                  <br/>
                  {Array(5).fill(0).map((_, i) => (
                    <div key={`milhar-adm-${i}`} style={{display: 'inline-block', marginRight: '10px', marginTop: '5px'}}>
                      Milhar {i + 1}: <input type="number" style={{...inputStyle, width: '80px'}} value={adminMilhares[i]} onChange={(e) => {
                        const newMilhares = [...adminMilhares]; newMilhares[i] = e.target.value; setAdminMilhares(newMilhares);
                      }} min="0" max="9999" disabled={isSubmitting || isWriteRegResultPending || isConfirmingRegResult} />
                    </div>
                  ))}
                  <button onClick={handleRegistrarResultados} disabled={isSubmitting || isContractPaused || !adminRodadaIdResultados || adminMilhares.some(m => m === "") || isWriteRegResultPending || isConfirmingRegResult} style={(isSubmitting || isContractPaused || !adminRodadaIdResultados || adminMilhares.some(m => m === "") || isWriteRegResultPending || isConfirmingRegResult) ? disabledButtonStyle : buttonStyle}>
                    {isWriteRegResultPending || isConfirmingRegResult ? "Registrando..." : "Registrar Resultados"}
                  </button>
                </div>
              </div>

              <div style={{border: '1px solid #eee', padding: '15px', marginBottom: '15px', borderRadius: '4px'}}>
                <h3>Configurações Globais (TODO)</h3>
                <div>
                    Novo Preço Base do Ticket (ETH):
                    <input type="text" value={adminNovoTicketBase} onChange={e => setAdminNovoTicketBase(e.target.value)} placeholder={`Atual: ${ticketPriceBase ? formatEther(ticketPriceBase) : 'N/A'}`} disabled={isSubmitting} style={inputStyle}/>
                    <button onClick={() => alert("TODO: handleSetTicketPriceBase")} disabled={isSubmitting || isContractPaused} style={buttonStyle}>Atualizar Preço Base</button>
                </div>
                <div style={{marginTop: '10px'}}>
                    Nova Taxa da Plataforma (%):
                    <input type="number" value={adminNovaTaxaPlat} onChange={e => setAdminNovaTaxaPlat(e.target.value)} placeholder={`Atual: ${taxaPlataforma ? taxaPlataforma.toString() : 'N/A'}`} disabled={isSubmitting} style={inputStyle}/>
                    <button onClick={() => alert("TODO: handleSetTaxaPlataforma")} disabled={isSubmitting || isContractPaused} style={buttonStyle}>Atualizar Taxa</button>
                </div>
              </div>
              <div style={{border: '1px solid #eee', padding: '15px', marginBottom: '15px', borderRadius: '4px'}}>
                <h3>Finanças (TODO)</h3>
                <p>Taxas Acumuladas: {taxasAcumuladas ? formatEther(taxasAcumuladas) : "0.00"} ETH</p>
                Endereço para Retirar Taxas:
                <input type="text" value={adminRetirarTaxasPara} onChange={e => setAdminRetirarTaxasPara(e.target.value)} placeholder={address || "Seu endereço"} style={{...inputStyle, width: '300px'}} disabled={isSubmitting}/>
                <button onClick={() => alert("TODO: handleRetirarTaxas")} disabled={isSubmitting || !taxasAcumuladas || taxasAcumuladas === 0n} style={buttonStyle}>Retirar Taxas</button>
              </div>
            </>
          )}

          {isConnected && (
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button onClick={() => disconnect()} style={isSubmitting ? disabledButtonStyle : buttonStyle} disabled={isSubmitting}>
                Desconectar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}