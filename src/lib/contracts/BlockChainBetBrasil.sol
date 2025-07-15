// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BlockchainBetBrasil is Ownable {
    
    // ===== NOVA VARIÁVEL =====
    address public gameManager; // Endereço do nosso novo contrato Gerenciador

    // ... (struct Aposta, mappings, arrays, etc. continuam iguais) ...
    struct Aposta { uint8 grupo1; uint8 grupo2; }
    mapping(address => Aposta) public apostas;
    address[] public apostadores;
    
    uint256 public ultimoResultadoMilhar;
    string public ultimoPrognosticoVencedor;
    uint256 public valorDaAposta;
    enum Estado { Aberta, Fechada, Paga }
    Estado public estadoAtual;

    // ... (eventos e constructor continuam iguais) ...
    
    // ===== NOVO MODIFICADOR =====
    // Este modificador garante que apenas o contrato Gerenciador possa chamar a função
    modifier onlyManager() {
        require(msg.sender == gameManager, "Apenas o gerenciador pode chamar esta funcao.");
        _;
    }

    // ... (função apostar continua a mesma) ...

    // ... (função getPrognosticoFromMilhar continua a mesma) ...

    // --- FUNÇÕES DE ADMINISTRAÇÃO MODIFICADAS ---
    // Agora elas usam o modificador onlyManager

    function fecharApostas() public onlyManager { // <-- MUDOU
        require(estadoAtual == Estado.Aberta, "O jogo nao esta aberto.");
        estadoAtual = Estado.Fechada;
    }

    function registrarResultadoManualmente(uint256 _milharSorteado) public onlyManager { // <-- MUDOU
        require(estadoAtual == Estado.Fechada, "O jogo precisa estar fechado.");
        
        ultimoResultadoMilhar = _milharSorteado;
        ultimoPrognosticoVencedor = getPrognosticoFromMilhar(_milharSorteado);
        
        estadoAtual = Estado.Paga;
        emit ResultadoRegistrado(_milharSorteado, ultimoPrognosticoVencedor);
    }

    function iniciarNovaRodada() public onlyManager { // <-- MUDOU
        // ... (lógica interna da função continua a mesma) ...
    }
    
    // ===== NOVA FUNÇÃO PARA O DONO =====
    // O Dono (você) define quem é o contrato Gerenciador
    function setGameManager(address _managerAddress) public onlyOwner {
        gameManager = _managerAddress;
    }

    // ... (função setValorAposta e uint2str continuam as mesmas) ...
}