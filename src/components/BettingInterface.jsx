import React, { useState, useEffect } from 'react';
import './BettingInterface.css'; // Opcional: para estilização

// O valor fixo da sua aposta em Dólar. Mude aqui se precisar.
const BET_AMOUNT_USD = 1.00; 

function BettingInterface() {
  // Estados para controlar o preço, o valor calculado, o carregamento e erros
  const [maticPrice, setMaticPrice] = useState(null);
  const [betAmountInMatic, setBetAmountInMatic] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect para buscar o preço da cripto quando o componente carregar
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        // API pública e gratuita do CoinGecko para pegar o preço. Não precisa de chave.
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd');
        
        if (!response.ok) {
          throw new Error('A resposta da rede não foi boa.');
        }

        const data = await response.json();
        const price = data['matic-network'].usd;
        
        setMaticPrice(price); // Guarda o preço atual do MATIC em USD

        // Calcula o valor da aposta em MATIC
        const amountInMatic = BET_AMOUNT_USD / price;
        setBetAmountInMatic(amountInMatic.toFixed(6)); // Arredonda para 6 casas decimais

      } catch (err) {
        setError('Não foi possível obter o preço. Tente recarregar a página.');
        console.error(err);
      } finally {
        setIsLoading(false); // Termina o carregamento, com sucesso ou erro
      }
    };

    fetchPrice();
  }, []); // O array vazio [] faz com que o useEffect rode apenas uma vez

  // Função que seria chamada ao clicar no botão de apostar
  const handlePlaceBet = () => {
    if (!betAmountInMatic) return;
    
    // --- AQUI ENTRA A LÓGICA DO SEU SMART CONTRACT ---
    // Você chamaria a função do seu contrato passando `betAmountInMatic` como o valor.
    // Ex: seuContrato.methods.apostar().send({ from: userAddress, value: web3.utils.toWei(betAmountInMatic, 'ether') })
    
    alert(`Apostando ${betAmountInMatic} MATIC! (Integração com o contrato pendente)`);
  };


  // Renderização condicional do componente
  if (isLoading) {
    return <div className="bet-container">Calculando valor da aposta...</div>;
  }

  if (error) {
    return <div className="bet-container error">{error}</div>;
  }

  return (
    <div className="bet-container">
      <h2>Faça sua Aposta</h2>
      <div className="price-info">
        <p>
          Valor Fixo da Aposta: 
          <strong> ${BET_AMOUNT_USD.toFixed(2)} USD</strong>
        </p>
        <p className="crypto-value">
          Você pagará aproximadamente: 
          <span>{betAmountInMatic} MATIC</span>
        </p>
        <small>(Preço atual: 1 MATIC ≈ ${maticPrice?.toFixed(2)} USD)</small>
      </div>
      <button 
        className="bet-button"
        onClick={handlePlaceBet} 
        disabled={!betAmountInMatic}
      >
        Apostar Agora
      </button>
      <small className="gas-warning">Taxas de transação (gás) da rede não inclusas.</small>
    </div>
  );
}

export default BettingInterface;