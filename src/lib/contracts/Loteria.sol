// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

// Removemos a dependência da Chainlink POR ENQUANTO, para a Fase 1
// import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract BlockchainBetBrasil is Ownable {

    // ... (As estruturas Aposta, mappings e arrays continuam iguais)
    struct Aposta { uint8 grupo1; uint8 grupo2; }
    mapping(address => Aposta) public apostas;
    address[] public apostadores;
    
    uint256 public ultimoResultadoMilhar;
    string public ultimoPrognosticoVencedor;
    uint256 public valorDaAposta;

    enum Estado { Aberta, Fechada, Paga }
    Estado public estadoAtual;

    event ApostaFeita(address indexed apostador, uint8 grupo1, uint8 grupo2);
    event ResultadoRegistrado(uint256 milhar, string prognostico);

    constructor() {
        estadoAtual = Estado.Aberta;
        valorDaAposta = 0.01 ether; // Exemplo: 0.01 MATIC
    }

    function apostar(uint8 _grupo1, uint8 _grupo2) public payable {
        require(estadoAtual == Estado.Aberta, "Apostas estao fechadas.");
        require(msg.value >= valorDaAposta, "Valor da aposta incorreto.");
        require(_grupo1 > 0 && _grupo1 <= 25 && _grupo2 > 0 && _grupo2 <= 25, "Grupos invalidos.");
        require(apostas[msg.sender].grupo1 == 0, "Voce ja apostou.");

        apostas[msg.sender] = Aposta(_grupo1, _grupo2);
        apostadores.push(msg.sender);

        emit ApostaFeita(msg.sender, _grupo1, _grupo2);
    }
    
    function getPrognosticoFromMilhar(uint256 _milhar) internal pure returns (string memory) {
        uint256 dezena1 = (_milhar / 100) % 100;
        uint256 dezena2 = _milhar % 100;
        if (dezena1 == 0) dezena1 = 100;
        if (dezena2 == 0) dezena2 = 100;
        uint8 grupo1 = uint8((dezena1 - 1) / 4 + 1);
        uint8 grupo2 = uint8((dezena2 - 1) / 4 + 1);
        return string(abi.encodePacked(uint2str(grupo1), "/", uint2str(grupo2)));
    }

    // --- FUNÇÕES DE ADMINISTRAÇÃO (SÓ O DONO PODE CHAMAR) ---

    function fecharApostas() public onlyOwner {
        require(estadoAtual == Estado.Aberta, "O jogo nao esta aberto.");
        estadoAtual = Estado.Fechada;
    }

    // AQUI ESTÁ A "TAREFA" EXECUTADA! A FUNÇÃO PARA A FASE 1
    // Somente VOCÊ (o dono) pode chamar esta função.
    function registrarResultadoManualmente(uint256 _milharSorteado) public onlyOwner {
        require(estadoAtual == Estado.Fechada, "O jogo precisa estar fechado para registrar resultado.");
        
        ultimoResultadoMilhar = _milharSorteado;
        ultimoPrognosticoVencedor = getPrognosticoFromMilhar(_milharSorteado);
        
        estadoAtual = Estado.Paga; // Marca a rodada como finalizada
        
        emit ResultadoRegistrado(_milharSorteado, ultimoPrognosticoVencedor);
        
        // Futuramente, a lógica de distribuição dos prêmios entraria aqui.
    }

    // Função para começar uma nova rodada de apostas
    function iniciarNovaRodada() public onlyOwner {
        require(estadoAtual == Estado.Paga, "A rodada atual ainda nao foi paga.");
        
        // Limpa os dados da rodada anterior
        delete ultimoResultadoMilhar;
        delete ultimoPrognosticoVencedor;
        for (uint i = 0; i < apostadores.length; i++) {
            delete apostas[apostadores[i]];
        }
        delete apostadores;
        
        estadoAtual = Estado.Aberta;
    }
    
    function setValorAposta(uint256 _valor) public onlyOwner {
        valorDaAposta = _valor;
    }
    
    // --- FUNÇÃO AUXILIAR ---
    function uint2str(uint256 _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) { return "0"; }
        uint j = _i; uint len; while (j != 0) { len++; j /= 10; }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) { k = k-1; uint8 temp = (48 + uint8(_i - _i / 10 * 10)); bstr[k] = bytes1(temp); _i /= 10; }
        return string(bstr);
    }
}