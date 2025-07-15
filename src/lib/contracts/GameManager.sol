// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

// A "carteira de identidade" do contrato principal.
// Assim, o GameManager sabe quais "botões" ele pode apertar.
interface IBlockchainBetBrasil {
    function fecharApostas() external;
    function registrarResultadoManualmente(uint256 _milharSorteado) external;
    function iniciarNovaRodada() external;
    function getPrognosticoFromMilhar(uint256 _milhar) external pure returns (string memory);
}

contract GameManager is Ownable {

    IBlockchainBetBrasil public betContract;

    uint256[5] public ultimosResultadosMilhar;
    string[5] public ultimosPrognosticosVencedores;

    event ResultadoCompletoRegistrado(uint256[5] milhares, string[5] prognosticos);

    constructor(address _betContractAddress) {
        betContract = IBlockchainBetBrasil(_betContractAddress);
    }

    function registrarResultadosCompletos(uint256[5] calldata _milharesSorteados) public onlyOwner {
        // Primeiro, o gerente comanda o cofre para fechar as apostas
        betContract.fecharApostas();

        string[5] memory prognosticosVencedores;
        for (uint i = 0; i < 5; i++) {
            require(_milharesSorteados[i] > 0 && _milharesSorteados[i] <= 99999, "Milhar invalido.");
            ultimosResultadosMilhar[i] = _milharesSorteados[i];
            
            // O gerente usa a função de "tradução" do próprio cofre
            prognosticosVencedores[i] = betContract.getPrognosticoFromMilhar(_milharesSorteados[i]);
        }
        
        ultimosPrognosticosVencedores = prognosticosVencedores;

        // O gerente registra apenas o 1º prêmio no cofre, para manter a lógica original dele
        betContract.registrarResultadoManualmente(_milharesSorteados[0]);
        
        emit ResultadoCompletoRegistrado(ultimosResultadosMilhar, prognosticosVencedores);
    }
    
    function comandarNovaRodada() public onlyOwner {
        betContract.iniciarNovaRodada();
    }

    function setBetContract(address _newBetContractAddress) public onlyOwner {
        betContract = IBlockchainBetBrasil(_newBetContractAddress);
    }
}