const contractAddress = "ENDEREÇO_DO_CONTRATO";
const contractABI = [/* ABI do contrato inteligente */];

const connectBlockchain = async () => {
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        return new web3.eth.Contract(contractABI, contractAddress);
    } else {
        alert("Por favor, instale o MetaMask!");
    }
};

document.getElementById("apostaForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const prognosticosInput = document.getElementById("prognosticos").value;
    const prognosticos = prognosticosInput.split(",").map(Number);

    const contract = await connectBlockchain();
    const accounts = await ethereum.request({ method: "eth_accounts" });

    try {
        const taxaAposta = Web3.utils.toWei("0.00033", "ether"); // Alinhado com o contrato inteligente
        await contract.methods.apostar(prognosticos).send({
            from: accounts[0],
            value: taxaAposta
        });
        alert("Aposta enviada com sucesso!");
    } catch (error) {
        console.error("Erro ao enviar aposta:", error);
        alert("Ocorreu um erro. Verifique os dados e tente novamente.");
    }
});
