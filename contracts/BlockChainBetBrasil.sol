// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; // ADICIONADO: Para interagir com o token USDC
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract BlockChainBetBrasil is Ownable, Pausable, ReentrancyGuard {

    IERC20 public stablecoin; // ADICIONADO: Referência ao contrato do token USDC

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
        uint256 valorPago; // Agora em unidades de stablecoin
    }

    struct Rodada {
        uint256 id;
        StatusRodada status;
        uint256 ticketPrice;        // Agora em unidades de stablecoin
        uint256 totalArrecadado;    // Agora em unidades de stablecoin
        uint256 premioTotal;        // Agora em unidades de stablecoin
        Aposta[] apostas;
        uint256[5] milharesSorteados;
        bool milharesForamInseridos;
        uint256[5] resultadosX;
        uint256[5] resultadosY;
        uint256 numeroDeVencedores;
        mapping(address => uint256) premiosAReceber; // Agora em unidades de stablecoin
        mapping(address => bool) premioReivindicado;
        uint256 timestampAbertura;
        uint256 timestampFechamentoApostas;
        uint256 timestampResultadosProcessados;
    }

    uint256 public rodadaAtualId;
    mapping(uint256 => Rodada) public rodadas;

    // MODIFICADO: Preço base em unidades de stablecoin (ex: 1 USDC com 6 decimais = 1 * 10^6)
    uint256 public ticketPriceBase = 1 * 10**6; // Assumindo 6 decimais para USDC
    uint256 public taxaPlataformaPercentual = 5;
    uint256 public taxasAcumuladas; // Agora em unidades de stablecoin

    event NovaRodadaIniciada(uint256 indexed rodadaId, uint256 ticketPrice, uint256 timestamp);
    event NovaApostaFeita(uint256 indexed rodadaId, address indexed jogador, uint256 apostaIndex, uint256[5] prognosticosX, uint256[5] prognosticosY);
    event ApostasFechadas(uint256 indexed rodadaId, uint256 timestamp);
    event MilharesRegistradosEProcessados(uint256 indexed rodadaId, uint256[5] milhares, uint256[5] resultadosX, uint256[5] resultadosY, uint256 timestamp);
    event PremiosCalculados(uint256 indexed rodadaId, uint256 numeroDeVencedores, uint256 premioPorVencedor);
    event PremioReivindicado(uint256 indexed rodadaId, address indexed jogador, uint256 valor);
    event TaxasRetiradas(address indexed para, uint256 valor);
    event NenhumVencedorNaRodada(uint256 indexed rodadaId, uint256 valorDoPoteNaoReivindicado);

    modifier apenasRodadaStatus(uint256 _rodadaId, StatusRodada _status) {
        require(rodadas[_rodadaId].status == _status, "Status da rodada invalido");
        _;
    }

    // ADICIONADO: O constructor agora recebe o endereço do token USDC
    constructor(address _stablecoinAddress) Ownable() {
        require(_stablecoinAddress != address(0), "Endereco do stablecoin invalido");
        stablecoin = IERC20(_stablecoinAddress);
        rodadaAtualId = 0;
        // Você pode querer definir ticketPriceBase aqui também se não for fixo como 1*10**6
        // ticketPriceBase = SEU_VALOR_INICIAL_DE_STABLECOIN; // ex: 1000000 para 1 USDC
    }

    function iniciarNovaRodada(uint256 _ticketPrice) public onlyOwner whenNotPaused {
        // _ticketPrice agora deve ser passado em unidades de stablecoin (ex: 1000000 para 1 USDC)
        if (rodadaAtualId > 0) {
             StatusRodada statusAnterior = rodadas[rodadaAtualId].status;
             require(statusAnterior == StatusRodada.PAGA || statusAnterior == StatusRodada.INATIVA || statusAnterior == StatusRodada.RESULTADO_DISPONIVEL, "Rodada anterior nao finalizada");
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
        Rodada storage rodada = rodadas[_rodadaId];
        require(!rodada.milharesForamInseridos, "Resultados ja inseridos para esta rodada");

        for (uint i = 0; i < 5; i++) {
            require(_milhares[i] <= 9999, "Milhar invalida (0-9999)");
        }

        rodada.milharesSorteados = _milhares;
        rodada.milharesForamInseridos = true;

        for (uint i = 0; i < 5; i++) {
            uint256 milharAtual = rodada.milharesSorteados[i];
            
            bytes32 hashX = keccak256(abi.encodePacked(milharAtual, "BLOCKCHAINBET_X", _rodadaId, i));
            rodada.resultadosX[i] = (uint256(hashX) % 25) + 1;

            bytes32 hashY = keccak256(abi.encodePacked(milharAtual, "BLOCKCHAINBET_Y", _rodadaId, i));
            rodada.resultadosY[i] = (uint256(hashY) % 25) + 1;
        }
        
        rodada.timestampResultadosProcessados = block.timestamp;
        emit MilharesRegistradosEProcessados(_rodadaId, _milhares, rodada.resultadosX, rodada.resultadosY, block.timestamp);

        _calcularEAlocarPremios(_rodadaId);
        rodada.status = StatusRodada.RESULTADO_DISPONIVEL;
    }


    function setTicketPriceBase(uint256 _novoPreco) public onlyOwner {
        // _novoPreco agora deve ser em unidades de stablecoin (ex: 1000000 para 1 USDC)
        require(_novoPreco > 0, "Preco deve ser maior que zero");
        ticketPriceBase = _novoPreco;
    }

    function setTaxaPlataforma(uint256 _novaTaxaPercentual) public onlyOwner {
        require(_novaTaxaPercentual <= 50, "Taxa nao pode ser > 50%");
        taxaPlataformaPercentual = _novaTaxaPercentual;
    }

    function retirarTaxas(address _para) public onlyOwner nonReentrant { // MODIFICADO: _para não precisa ser payable
        uint256 valorARetirar = taxasAcumuladas;
        require(valorARetirar > 0, "Sem taxas para retirar");
        taxasAcumuladas = 0;
        
        // MODIFICADO: Transferir stablecoins em vez de ETH
        bool success = stablecoin.transfer(_para, valorARetirar);
        require(success, "Falha ao retirar taxas (stablecoin transfer)");
        emit TaxasRetiradas(_para, valorARetirar);
    }
    
    function pausar() public onlyOwner {
        _pause();
    }

    function despausar() public onlyOwner {
        _unpause();
    }

    // MODIFICADO: Função apostar para usar stablecoins
    function apostar(uint256[5] calldata _prognosticosX, uint256[5] calldata _prognosticosY)
        public
        // payable // REMOVIDO: Não mais payable pois não recebe ETH diretamente
        whenNotPaused
        nonReentrant
        apenasRodadaStatus(rodadaAtualId, StatusRodada.ABERTA)
    {
        Rodada storage rodada = rodadas[rodadaAtualId];
        uint256 currentTicketPrice = rodada.ticketPrice; // valor da aposta em unidades de stablecoin

        // MODIFICADO: Transferir stablecoins do jogador para o contrato
        // O jogador DEVE ter aprovado este contrato para gastar seus tokens ANTES de chamar esta função
        bool success = stablecoin.transferFrom(msg.sender, address(this), currentTicketPrice);
        require(success, "Falha na transferencia do stablecoin. O jogador aprovou o contrato?");

        for (uint i = 0; i < 5; i++) {
            require(_prognosticosX[i] >= 1 && _prognosticosX[i] <= 25, "Prognostico X invalido");
            require(_prognosticosY[i] >= 1 && _prognosticosY[i] <= 25, "Prognostico Y invalido");
        }

        rodada.apostas.push(Aposta({
            jogador: msg.sender,
            prognosticosX: _prognosticosX,
            prognosticosY: _prognosticosY,
            valorPago: currentTicketPrice // MODIFICADO: Usar o valor do ticket em stablecoin
        }));
        rodada.totalArrecadado += currentTicketPrice; // MODIFICADO: Acumular em stablecoin

        emit NovaApostaFeita(rodadaAtualId, msg.sender, rodada.apostas.length - 1, _prognosticosX, _prognosticosY);
    }

    // MODIFICADO: Função para reivindicar prêmio em stablecoins
    function reivindicarPremio(uint256 _rodadaId)
        public
        nonReentrant
        whenNotPaused
    {
        Rodada storage rodada = rodadas[_rodadaId];
        require(rodada.status == StatusRodada.RESULTADO_DISPONIVEL || rodada.status == StatusRodada.PAGA, "Premios nao disponiveis ou rodada invalida");
        
        uint256 valorDoPremio = rodada.premiosAReceber[msg.sender];
        require(valorDoPremio > 0, "Nenhum premio para reivindicar");
        require(!rodada.premioReivindicado[msg.sender], "Premio ja reivindicado");

        rodada.premioReivindicado[msg.sender] = true;
        
        // MODIFICADO: Transferir prêmio em stablecoins
        bool success = stablecoin.transfer(msg.sender, valorDoPremio);
        require(success, "Falha ao transferir premio (stablecoin transfer)");

        emit PremioReivindicado(_rodadaId, msg.sender, valorDoPremio);
        
        // Opcional: Atualizar status da rodada para PAGA se todos os prêmios foram pagos
        // Isso exigiria mais lógica para rastrear quantos prêmios foram pagos.
    }

    function _calcularEAlocarPremios(uint256 _rodadaId) internal {
        Rodada storage rodada = rodadas[_rodadaId];
        // Cálculos continuam os mesmos, mas os valores base (totalArrecadado) são em stablecoin
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
                rodada.premiosAReceber[vencedoresLocais[i]] += premioIndividual; 
            }
            emit PremiosCalculados(_rodadaId, countVencedores, premioIndividual);
        } else {
            // Se não houver vencedores, o prêmio total (já descontada a taxa inicial) volta para as taxas acumuladas.
            taxasAcumuladas += rodada.premioTotal; 
            rodada.premioTotal = 0; // Zera o prêmio da rodada, pois foi para as taxas
            emit NenhumVencedorNaRodada(_rodadaId, rodada.totalArrecadado - valorTaxa); // O valor não reivindicado é o prêmio que iria aos vencedores
        }
    }

    // Funções de visualização (view/pure) não precisam de grandes alterações,
    // mas lembre-se que os valores retornados (ticketPrice, totalArrecadado, etc.)
    // estarão em unidades de stablecoin.
    function getRodadaInfoBasica(uint256 _rodadaId)
        public
        view
        returns (
            uint256 id,
            StatusRodada status,
            uint256 ticketPrice,
            uint256 totalArrecadado,
            uint256 premioTotal,
            uint256 numApostas,
            uint256 numeroDeVencedores
        )
    {
        Rodada storage r = rodadas[_rodadaId];
        return (
            r.id,
            r.status,
            r.ticketPrice,
            r.totalArrecadado,
            r.premioTotal,
            r.apostas.length,
            r.numeroDeVencedores
        );
    }

    function getRodadaResultados(uint256 _rodadaId)
        public
        view
        returns (
            uint256[5] memory milharesSorteados,
            bool milharesForamInseridos,
            uint256[5] memory resultadosX,
            uint256[5] memory resultadosY
        )
    {
        Rodada storage r = rodadas[_rodadaId];
        return (
            r.milharesSorteados,
            r.milharesForamInseridos,
            r.resultadosX,
            r.resultadosY
        );
    }

    function getRodadaTimestamps(uint256 _rodadaId)
        public
        view
        returns (
            uint256 timestampAbertura,
            uint256 timestampFechamentoApostas,
            uint256 timestampResultadosProcessados
        )
    {
        Rodada storage r = rodadas[_rodadaId];
        return (
            r.timestampAbertura,
            r.timestampFechamentoApostas,
            r.timestampResultadosProcessados
        );
    }

    function getApostasDaRodada(uint256 _rodadaId, uint256 _startIndex, uint256 _pageSize) 
        public 
        view 
        returns (Aposta[] memory apostasPaginadas) 
    {
        Rodada storage rodada = rodadas[_rodadaId];
        uint256 totalApostas = rodada.apostas.length;

        if (_startIndex >= totalApostas) {
            return new Aposta[](0);
        }

        uint256 endIndex = _startIndex + _pageSize;
        if (endIndex > totalApostas) {
            endIndex = totalApostas;
        }
        
        uint256 itemsToReturn = endIndex - _startIndex;
        apostasPaginadas = new Aposta[](itemsToReturn);

        for (uint256 i = 0; i < itemsToReturn; i++) {
            apostasPaginadas[i] = rodada.apostas[_startIndex + i];
        }
        return apostasPaginadas;
    }


    function getPremioParaReivindicar(uint256 _rodadaId, address _jogador) public view returns (uint256) {
        return rodadas[_rodadaId].premiosAReceber[_jogador];
    }

    function checarSePremioFoiReivindicado(uint256 _rodadaId, address _jogador) public view returns (bool) {
        return rodadas[_rodadaId].premioReivindicado[_jogador];
    }

    function simularConversaoMilhares(uint256 _rodadaIdParaContexto, uint256[5] calldata _milhares) 
        public 
        pure 
        returns (uint256[5] memory resultadosX, uint256[5] memory resultadosY)
    {
        for (uint i = 0; i < 5; i++) {
            require(_milhares[i] <= 9999, "Milhar invalida (0-9999)");
            uint256 milharAtual = _milhares[i];
            
            bytes32 hashX = keccak256(abi.encodePacked(milharAtual, "BLOCKCHAINBET_X", _rodadaIdParaContexto, i));
            resultadosX[i] = (uint256(hashX) % 25) + 1;

            bytes32 hashY = keccak256(abi.encodePacked(milharAtual, "BLOCKCHAINBET_Y", _rodadaIdParaContexto, i));
            resultadosY[i] = (uint256(hashY) % 25) + 1;
        }
        return (resultadosX, resultadosY);
    }

    // ADICIONADO: Função para o owner atualizar o endereço do stablecoin, caso necessário (com cuidado!)
    function setStablecoinAddress(address _newStablecoinAddress) public onlyOwner {
        require(_newStablecoinAddress != address(0), "Novo endereco do stablecoin invalido");
        stablecoin = IERC20(_newStablecoinAddress);
    }

    // ADICIONADO: Função para verificar o endereço do stablecoin configurado
    function getStablecoinAddress() public view returns (address) {
        return address(stablecoin);
    }
}
