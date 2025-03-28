// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract LoteriaPrognosticos is ReentrancyGuard, VRFConsumerBaseV2 {
    // Estrutura para armazenar apostas
    struct Aposta {
        uint256[5] prognosticos;
        address apostador;
    }

    // Estrutura para armazenar prognósticos
    struct Prognostico {
        uint256 id;
        string descricao;
    }

    // Variáveis do contrato
    address public dono;
    uint256 public taxaAposta = 0.00033 ether;
    uint256 public encerramentoApostas;
    uint256 public reaberturaApostas;
    Aposta[] public apostas;
    uint256[] public resultados;
    bool public sorteioRealizado;
    mapping(address => uint256) public premiacao;
    mapping(uint256 => Prognostico) public prognosticos; // Mapeamento de prognósticos
    uint256 public proximoIdPrognostico = 1;

    // Chainlink VRF
    VRFCoordinatorV2Interface public vrfCoordinator;
    bytes32 public keyHash;
    uint64 public subscriptionId;
    uint32 public callbackGasLimit = 100000;
    uint16 public requestConfirmations = 3;
    uint32 public numWords = 5;
    uint256 public requestId;

    // Eventos
    event ApostaRealizada(address indexed apostador, uint256[5] prognosticos);
    event SorteioRealizado(uint256[] resultados);
    event PremioDistribuido(address indexed apostador, uint256 valor);
    event PrognosticoAdicionado(uint256 id, string descricao);

    // Modificadores
    modifier apenasDono() {
        require(msg.sender == dono, "Somente o dono pode executar esta funcao");
        _;
    }

    modifier apostasAbertas() {
        require(block.timestamp < encerramentoApostas, "Apostas encerradas");
        _;
    }

    modifier apostasFechadas() {
        require(block.timestamp >= encerramentoApostas && !sorteioRealizado, "Apostas ainda abertas ou sorteio ja realizado");
        _;
    }

    // Construtor
    constructor(
        address _vrfCoordinator,
        bytes32 _keyHash,
        uint64 _subscriptionId
    ) VRFConsumerBaseV2(_vrfCoordinator) {
        dono = msg.sender;
        vrfCoordinator = VRFCoordinatorV2Interface(_vrfCoordinator);
        keyHash = _keyHash;
        subscriptionId = _subscriptionId;
        encerramentoApostas = block.timestamp + 5 days; // Exemplo: encerramento em 5 dias
        reaberturaApostas = encerramentoApostas + 2 days; // Exemplo: reabertura em 2 dias após o encerramento
    }

    // Função para adicionar prognósticos
    function adicionarPrognostico(string memory _descricao) external apenasDono {
        uint256 id = proximoIdPrognostico++;
        prognosticos[id] = Prognostico(id, _descricao);
        emit PrognosticoAdicionado(id, _descricao);
    }

    // Função para obter um prognóstico por ID
    function obterPrognostico(uint256 _id) external view returns (string memory) {
        require(prognosticos[_id].id != 0, "Prognostico nao existe");
        return prognosticos[_id].descricao;
    }

    // Função para apostar
    function apostar(uint256[5] memory _prognosticos) external payable nonReentrant apostasAbertas {
        require(msg.value == taxaAposta, "Valor da aposta incorreto");
        require(validarPrognosticos(_prognosticos), "Prognosticos invalidos");

        apostas.push(Aposta({
            prognosticos: _prognosticos,
            apostador: msg.sender
        }));

        emit ApostaRealizada(msg.sender, _prognosticos);
    }

    // Função para validar prognósticos
    function validarPrognosticos(uint256[5] memory _prognosticos) internal view returns (bool) {
        for (uint i = 0; i < 5; i++) {
            if (_prognosticos[i] < 1 || _prognosticos[i] >= proximoIdPrognostico) {
                return false;
            }
        }
        return true;
    }

    // Função para solicitar números aleatórios do Chainlink VRF
    function solicitarSorteio() external apenasDono apostasFechadas {
        require(!sorteioRealizado, "Sorteio ja realizado");
        requestId = vrfCoordinator.requestRandomWords(
            keyHash,
            subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
    }

    // Callback do Chainlink VRF para receber números aleatórios
    function fulfillRandomWords(uint256 _requestId, uint256[] memory _randomWords) internal override {
        require(_requestId == requestId, "ID de requisicao invalido");
        require(_randomWords.length == numWords, "Numero de palavras aleatorias invalido");

        // Mapear números aleatórios para IDs de prognósticos válidos
        for (uint i = 0; i < numWords; i++) {
            resultados.push((_randomWords[i] % (proximoIdPrognostico - 1)) + 1);
        }

        sorteioRealizado = true;
        emit SorteioRealizado(resultados);
    }

    // Função para distribuir prêmios
    function distribuirPremios() external apenasDono nonReentrant {
        require(sorteioRealizado, "Sorteio ainda nao realizado");

        uint256 totalPremiacao = address(this).balance * 45 / 100;
        uint256[] memory distribuicao = new uint256[](5);
        distribuicao[0] = totalPremiacao * 50 / 100;
        distribuicao[1] = totalPremiacao * 25 / 100;
        distribuicao[2] = totalPremiacao * 12 / 100;
        distribuicao[3] = totalPremiacao * 8 / 100;
        distribuicao[4] = totalPremiacao * 5 / 100;

        for (uint i = 0; i < apostas.length; i++) {
            uint256 pontos = calcularPontos(apostas[i].prognosticos);
            if (pontos > 0) {
                premiacao[apostas[i].apostador] += distribuicao[pontos - 1];
            }
        }

        for (uint i = 0; i < apostas.length; i++) {
            if (premiacao[apostas[i].apostador] > 0) {
                payable(apostas[i].apostador).transfer(premiacao[apostas[i].apostador]);
                emit PremioDistribuido(apostas[i].apostador, premiacao[apostas[i].apostador]);
                premiacao[apostas[i].apostador] = 0;
            }
        }
    }

    // Função para calcular pontos
    function calcularPontos(uint256[5] memory _prognosticos) internal view returns (uint256) {
        uint256 pontos = 0;
        for (uint i = 0; i < 5; i++) {
            for (uint j = 0; j < 5; j++) {
                if (_prognosticos[i] == resultados[j]) {
                    pontos++;
                    break;
                }
            }
        }
        return pontos;
    }

    // Função para reabrir apostas
    function reabrirApostas() external apenasDono {
        require(block.timestamp >= reaberturaApostas, "Ainda nao e hora de reabrir as apostas");
        encerramentoApostas = block.timestamp + 5 days;
        reaberturaApostas = encerramentoApostas + 2 days;
        sorteioRealizado = false;
        delete apostas;
        delete resultados;
    }
}
