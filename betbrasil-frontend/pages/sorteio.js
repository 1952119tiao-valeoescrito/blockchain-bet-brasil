import { ethers } from 'ethers';
import { useState } from 'react';

export default function Sorteio() {
  const [randomResult, setRandomResult] = useState(null);

  const realizarSorteio = async () => {
    const contractAddress = "ENDEREÇO_DO_CONTRATO";
    const abi = [ /* ABI do contrato */ ];
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const tx = await contract.sortear();
      await tx.wait();
      const result = await contract.randomResult();
      setRandomResult(result);
      alert(`Número sorteado: ${result}`);
    } catch (error) {
      alert("Erro ao realizar sorteio: " + error.message);
    }
  };

  return (
    <div>
      <h1>Realizar Sorteio</h1>
      <button onClick={realizarSorteio}>Sortear</button>
      {randomResult !== null && <p>Número sorteado: {randomResult}</p>}
    </div>
  );
}
