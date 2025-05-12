// app/(auth)/login/page.tsx
"use client"; // Necessário para useState, useEffect e manipulação de eventos

import { useState } from 'react';

export default function LoginPage() {
  const [depositAmount, setDepositAmount] = useState<string>("100"); // Valor padrão para depósito
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Função para lidar com o depósito de fundos de teste
  const handleTestDeposit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setMessage(null);

    const amountNumber = parseFloat(depositAmount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      setMessage("Por favor, insira um valor numérico positivo para o depósito.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/user/balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: amountNumber }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Falha ao depositar fundos de teste.');
      }

      setMessage(data.message || `R$ ${amountNumber.toFixed(2)} adicionados com sucesso! (Atualize o Navbar para ver o novo saldo)`);
      // Idealmente, aqui poderíamos ter uma forma de notificar o Navbar para atualizar o saldo
      // ou usar um gerenciador de estado global. Por enquanto, um refresh manual ou navegação o fará.

    } catch (err: any) {
      console.error("Erro ao depositar fundos de teste:", err);
      setMessage(err.message || 'Erro ao tentar depositar fundos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center', maxWidth: '500px', margin: '2rem auto' }}>
      <h1>Página de Login</h1>
      <p>Formulário de login será implementado aqui em breve.</p>
      <p>Esta página está no grupo de rotas <code>(auth)</code>.</p>

      <div style={{
        border: '1px solid #ccc',
        padding: '20px',
        marginTop: '30px',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
      }}>
        <h2>Fundos de Teste</h2>
        <p>Adicione fundos fictícios à sua conta para testar a plataforma.</p>
        <div>
          <label htmlFor="depositAmount" style={{ marginRight: '10px' }}>Valor (R$):</label>
          <input
            type="number"
            id="depositAmount"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="Ex: 100"
            style={{ padding: '8px', marginRight: '10px', width: '100px' }}
            disabled={isSubmitting}
          />
          <button
            onClick={handleTestDeposit}
            disabled={isSubmitting}
            style={{
              padding: '8px 15px',
              cursor: 'pointer',
              backgroundColor: isSubmitting ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            {isSubmitting ? 'Processando...' : 'Depositar Fundos de Teste'}
          </button>
        </div>
        {message && (
          <p style={{
            marginTop: '15px',
            color: message.toLowerCase().includes('erro') || message.toLowerCase().includes('falha') ? 'red' : 'green',
            fontWeight: 'bold'
          }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}