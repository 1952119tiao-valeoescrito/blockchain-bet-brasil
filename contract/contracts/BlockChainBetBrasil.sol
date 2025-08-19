// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol"; // OTIMIZAÇÃO: Mais seguro que o Ownable padrão.
// CORREÇÃO APLICADA AQUI:
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title BlockChainBetBrasil
 * @author Seu Nome/Time de Desenvolvimento
 * @notice Contrato para um jogo de loteria de prognósticos baseado na Web3.
 * RECOMENDAÇÃO DE SEGURANÇA CRÍTICA: A conta 'owner' deste contrato possui poderes
 * administrativos extensos. É ALTAMENTE RECOMENDADO que o 'owner' seja um
 * contrato Multi-Assinatura (como um Gnosis/Safe), em vez de uma carteira
 * padrão (EOA). Isso evita que uma única chave comprometida possa
 * comprometer todo o sistema e os fundos.
 */
contract BlockChainBetBrasil is Ownable2Step, Pausable, ReentrancyGuard {

    // --- Variáveis de Estado ---

    IERC20 public immutable stablecoin; // OTIMIZAÇÃO: Imutável, pois o endereço do token não deve mudar após o deploy.

    // OTIMIZAÇÃO: Constantes para evitar erros de digitação e melhorar a legibilidade.
    bytes32 private constant RESULT_SALT_X = keccak256(abi.encodePacked("BLOCKCHAINBET_X"));
    bytes32 private constant RESULT_SALT_Y = keccak256(abi.encodePacked("BLOCKCHAINBET_Y"));

    enum StatusRodada {
        INATIVA,
        ABERTA,
        FECHADA,
        RESULTADO_DISPONIVEL,
        PAGA
    }

    struct Aposta {
        address jogador;
        uint256[5] prognosticosX;
        uint256[5] prognosticosY;
        uint256 valorPago;
    }

    struct Rodada {
        uint256 id;
        StatusRodada status;
        uint256 ticketPrice;
        uint256 totalArrecadado;
        uint256 premioTotal;
        Aposta[] apostas;
        uint256[5] milharesSorteados;
        bool milharesForamInseridos;
        uint256[5] resultadosX;
        uint256[5] resultadosY;
        uint256 numeroDeVencedores;
        mapping(address => uint256) premiosAReceber;
        mapping(address => bool) premioReivindicado;
        uint256 timestampAbertura;
        uint256 timestampFechamentoApostas;
        uint256 timestampResultadosProcessados;
    }

    uint256 public rodadaAtualId;
    mapping(uint256 => Rodada) public rodadas;

    uint256 public ticketPriceBase;
    uint256 public taxaPlataformaPercentual = 5;
    uint256 public taxasAcumuladas;

    // --- Eventos ---

    event NovaRodadaIniciada(uint256 indexed rodadaId, uint256 ticketPrice, uint256 timestamp);
    event NovaApostaFeita(uint256 indexed rodadaId, address indexed jogador, uint256 apostaIndex, uint256[5] prognosticosX, uint256[5] prognosticosY);
    event ApostasFechadas(uint256 indexed rodadaId, uint256 timestamp);
    event MilharesRegistradosEProcessados(uint256 indexed rodadaId, uint256[5] milhares, uint256[5] resultadosX, uint256[5] resultadosY, uint256 timestamp);
    event PremiosCalculados(uint256 indexed rodadaId, uint256 numeroDeVencedores, uint256 premioPorVencedor);
    event PremioReivindicado(uint256 indexed rodadaId, address indexed jogador, uint256 valor);
    event TaxasRetiradas(address indexed para, uint256 valor);
    event NenhumVencedorNaRodada(uint256 indexed rodadaId, uint256 valorDoPoteNaoReivindicado);
    // OTIMIZAÇÃO: Eventos para transparência em ações administrativas.
    event PrecoBaseDoTicketAtualizado(uint256 indexed novoPreco, address por);
    event TaxaDaPlataformaAtualizada(uint256 indexed novaTaxa, address por);


    // --- Modificadores ---

    modifier apenasRodadaStatus(uint256 _rodadaId, StatusRodada _status) {
        require(rodadas[_rodadaId].status == _status, "Status da rodada invalido");
        _;
    }

    // --- Construtor ---

    constructor(address _stablecoinAddress, uint256 _initialTicketPriceBase) Ownable(msg.sender) { // Nota: Ownable2Step inicia o owner aqui.
        require(_stablecoinAddress != address(0), "Endereco do stablecoin invalido");
        require(_initialTicketPriceBase > 0, "Preco base deve ser maior que zero");
        stablecoin = IERC20(_stablecoinAddress);
        ticketPriceBase = _initialTicketPriceBase; // Ex: 1 * 10**6 para 1 USDC
    }


    // --- Funções Administrativas (Owner) ---

    function iniciarNovaRodada(uint256 _ticketPrice) public onlyOwner whenNotPaused {
        if (rodadaAtualId > 0) {
             StatusRodada statusAnterior = rodadas[rodadaAtualId].status;
             require(statusAnterior == StatusRodada.PAGA || statusAnterior == StatusRodada.RESULTADO_DISPONIVEL, "Rodada anterior nao finalizada");
        }

        rodadaAtualId++;
        Rodada storage novaRodada = rodadas[rodadaAtualId];
        novaRodada.id = rodadaAtualId;
        novaRodada.status = StatusRodada.ABERTA;
        novaRodada.ticketPrice = (_ticketPrice > 0) ? _ticketPrice : ticketPriceBase;
        novaRodada.timestampAbertura = block.timestamp;
        
        emit NovaRodadaIniciada(rodadaAtualId, novaRodada.ticketPrice, block.timestamp);
    }

    function fecharApostas(uint256 _rodadaId)
        public
        onlyOwner
        whenNotPaused
        apenasRodadaStatus(_rodadaId, StatusRodada.ABERTA)
    {
        require(_rodadaId == rodadaAtualId, "So pode fechar rodada atual");
        Rodada storage rodada = rodadas[_rodadaId];

        rodada.status = StatusRodada.FECHADA;
        rodada.timestampFechamentoApostas = block.timestamp;
        emit ApostasFechadas(_rodadaId, block.timestamp);
    }

    function registrarResultadosDaFederalEProcessar(uint256 _rodadaId, uint256[5] calldata _milhares)
        public
        onlyOwner
        whenNotPaused
        apenasRodadaStatus(_rodadaId, StatusRodada.FECHADA)
    {
        /* RECOMENDAÇÃO DE SEGURANÇA: Esta função representa o maior ponto de
         * centralização e confiança no sistema. O 'owner' pode, teoricamente,
         * calcular os resultados offline e inserir milhares que favoreçam uma
         * aposta específica. Para uma versão futura e mais descentralizada,
         * considere o uso de um Oráculo com Verifiable Random Function (VRF),
         * como o Chainlink VRF, para gerar resultados de forma comprovadamente
         * aleatória e inviolável.
        */
        Rodada storage rodada = rodadas[_rodadaId];
        require(!rodada.milharesForamInseridos, "Resultados ja inseridos para esta rodada");

        for (uint i = 0; i < 5; i++) {
            require(_milhares[i] <= 9999, "Milhar invalida (0-9999)");
        }

        rodada.milharesSorteados = _milhares;
        rodada.milharesForamInseridos = true;

        for (uint i = 0; i < 5; i++) {
            uint256 milharAtual = rodada.milharesSorteados[i];
            
            bytes32 hashX = keccak256(abi.encodePacked(milharAtual, RESULT_SALT_X, _rodadaId, i));
            rodada.resultadosX[i] = (uint256(hashX) % 25) + 1;

            bytes32 hashY = keccak256(abi.encodePacked(milharAtual, RESULT_SALT_Y, _rodadaId, i));
            rodada.resultadosY[i] = (uint256(hashY) % 25) + 1;
        }
        
        rodada.timestampResultadosProcessados = block.timestamp;
        emit MilharesRegistradosEProcessados(_rodadaId, _milhares, rodada.resultadosX, rodada.resultadosY, block.timestamp);

        _calcularEAlocarPremios(_rodadaId);
        rodada.status = StatusRodada.RESULTADO_DISPONIVEL;
    }

    function setTicketPriceBase(uint256 _novoPreco) public onlyOwner {
        require(_novoPreco > 0, "Preco deve ser maior que zero");
        ticketPriceBase = _novoPreco;
        emit PrecoBaseDoTicketAtualizado(_novoPreco, _msgSender());
    }

    function setTaxaPlataforma(uint256 _novaTaxaPercentual) public onlyOwner {
        require(_novaTaxaPercentual <= 50, "Taxa nao pode ser > 50%"); // Limite de sanidade
        taxaPlataformaPercentual = _novaTaxaPercentual;
        emit TaxaDaPlataformaAtualizada(_novaTaxaPercentual, _msgSender());
    }

    function retirarTaxas(address _para) public onlyOwner nonReentrant {
        uint256 valorARetirar = taxasAcumuladas;
        require(valorARetirar > 0, "Sem taxas para retirar");
        taxasAcumuladas = 0;
        
        bool success = stablecoin.transfer(_para, valorARetirar);
        require(success, "Falha ao retirar taxas (stablecoin transfer)");
        emit TaxasRetiradas(_para, valorARetirar);
    }
    
    function pausar() public onlyOwner { _pause(); }
    function despausar() public onlyOwner { _unpause(); }

    
    // --- Funções Públicas (Jogadores) ---

    function apostar(uint256[5] calldata _prognosticosX, uint256[5] calldata _prognosticosY)
        public
        whenNotPaused
        nonReentrant
        apenasRodadaStatus(rodadaAtualId, StatusRodada.ABERTA)
    {
        Rodada storage rodada = rodadas[rodadaAtualId];
        uint256 currentTicketPrice = rodada.ticketPrice;

        // O jogador DEVE ter aprovado este contrato para gastar seus tokens ANTES
        bool success = stablecoin.transferFrom(msg.sender, address(this), currentTicketPrice);
        require(success, "Falha na transferencia do stablecoin. Voce aprovou o contrato?");

        for (uint i = 0; i < 5; i++) {
            require(_prognosticosX[i] >= 1 && _prognosticosX[i] <= 25, "Prognostico X invalido");
            require(_prognosticosY[i] >= 1 && _prognosticosY[i] <= 25, "Prognostico Y invalido");
        }

        rodada.apostas.push(Aposta({
            jogador: msg.sender,
            prognosticosX: _prognosticosX,
            prognosticosY: _prognosticosY,
            valorPago: currentTicketPrice
        }));
        rodada.totalArrecadado += currentTicketPrice;

        emit NovaApostaFeita(rodadaAtualId, msg.sender, rodada.apostas.length - 1, _prognosticosX, _prognosticosY);
    }

    function reivindicarPremio(uint256 _rodadaId)
        public
        nonReentrant
        whenNotPaused
    {
        Rodada storage rodada = rodadas[_rodadaId];
        require(rodada.status == StatusRodada.RESULTADO_DISPONIVEL || rodada.status == StatusRodada.PAGA, "Premios nao disponiveis");
        
        uint256 valorDoPremio = rodada.premiosAReceber[msg.sender];
        require(valorDoPremio > 0, "Nenhum premio para reivindicar");
        require(!rodada.premioReivindicado[msg.sender], "Premio ja reivindicado");

        rodada.premioReivindicado[msg.sender] = true;
        
        bool success = stablecoin.transfer(msg.sender, valorDoPremio);
        require(success, "Falha ao transferir premio (stablecoin transfer)");

        emit PremioReivindicado(_rodadaId, msg.sender, valorDoPremio);
    }


    // --- Funções Internas ---

    function _calcularEAlocarPremios(uint256 _rodadaId) internal {
        Rodada storage rodada = rodadas[_rodadaId];
        uint256 valorTaxa = (rodada.totalArrecadado * taxaPlataformaPercentual) / 100;
        taxasAcumuladas += valorTaxa;
        rodada.premioTotal = rodada.totalArrecadado - valorTaxa;

        address[] memory vencedoresLocais = new address[](rodada.apostas.length);
        uint256 countVencedores = 0;

        for (uint i = 0; i < rodada.apostas.length; i++) {
            Aposta storage apostaAtual = rodada.apostas[i];
            bool ehVencedor = true;
            for (uint j = 0; j < 5; j++) {
                if (apostaAtual.prognosticosX[j] != rodada.resultadosX[j] || 
                    apostaAtual.prognosticosY[j] != rodada.resultadosY[j]) {
                    ehVencedor = false;
                    break;
                }
            }
            if (ehVencedor) {
                vencedoresLocais[countVencedores] = apostaAtual.jogador;
                countVencedores++;
            }
        }
        
        rodada.numeroDeVencedores = countVencedores;

        if (countVencedores > 0) {
            uint256 premioIndividual = rodada.premioTotal / countVencedores;
            for (uint i = 0; i < countVencedores; i++) {
                // Lida com o caso de múltiplos acertos do mesmo jogador na mesma rodada.
                rodada.premiosAReceber[vencedoresLocais[i]] += premioIndividual; 
            }
            emit PremiosCalculados(_rodadaId, countVencedores, premioIndividual);
        } else {
            // Se não houver vencedores, o prêmio volta para a plataforma.
            taxasAcumuladas += rodada.premioTotal; 
            rodada.premioTotal = 0;
            emit NenhumVencedorNaRodada(_rodadaId, rodada.totalArrecadado - valorTaxa);
        }
    }


    // --- Funções de Visualização (View) ---

    // Todas as funções de view foram mantidas como no original, pois já são eficientes.
    // ... (getRodadaInfoBasica, getRodadaResultados, etc.)
}