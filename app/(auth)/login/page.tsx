// app/(auth)/login/page.tsx
"use client"; // Necessário para useState, useEffect e manipulação de eventos

import { useState } from 'react';
// import { useRouter } from 'next/navigation'; // Descomente se for usar redirecionamento após login

export default function LoginPage() {
  // Estado para o formulário de login
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const [isLoginSubmitting, setIsLoginSubmitting] = useState<boolean>(false);

  // const router = useRouter(); // Descomente e use router.push('/dashboard') após login bem-sucedido

  // Estado para o depósito de fundos de teste (mantido do seu código original)
  const [depositAmount, setDepositAmount] = useState<string>("100");
  const [depositMessage, setDepositMessage] = useState<string | null>(null); // Renomeado de 'message'
  const [isDepositSubmitting, setIsDepositSubmitting] = useState<boolean>(false); // Renomeado de 'isSubmitting'

  // Função para lidar com o login
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Previne o comportamento padrão de submit do formulário
    if (isLoginSubmitting) return;
    setIsLoginSubmitting(true);
    setLoginMessage(null);

    if (!email || !password) {
      setLoginMessage("Por favor, preencha o email e a senha.");
      setIsLoginSubmitting(false);
      return;
    }

    try {
      // AQUI VOCÊ FARIA A CHAMADA REAL PARA SUA API DE LOGIN
      // Exemplo:
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email, password }),
      // });
      // const data = await response.json();
      // if (!response.ok || !data.success) {
      //   throw new Error(data.message || 'Falha ao fazer login.');
      // }
      // setLoginMessage(data.message || "Login realizado com sucesso!");
      // router.push('/dashboard'); // Redireciona para o painel ou página principal

      // Simulação de chamada de API para login
      console.log("Tentando login com:", { email, password });
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simula delay da API

      // Simulação de sucesso (substitua pela lógica real)
      if (email === "teste@exemplo.com" && password === "senha123") {
        setLoginMessage("Login realizado com sucesso! (Simulado)");
        // Limpar campos opcionais após sucesso
        // setEmail("");
        // setPassword("");
        // router.push('/dashboard'); // Exemplo de redirecionamento
      } else {
        throw new Error("Email ou senha inválidos. (Simulado)");
      }

    } catch (err: any) {
      console.error("Erro no login:", err);
      setLoginMessage(err.message || 'Erro ao tentar fazer login.');
    } finally {
      setIsLoginSubmitting(false);
    }
  };

  // Função para lidar com o depósito de fundos de teste (mantida do seu código original)
  const handleTestDeposit = async () => {
    if (isDepositSubmitting) return;
    setIsDepositSubmitting(true);
    setDepositMessage(null);

    const amountNumber = parseFloat(depositAmount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      setDepositMessage("Por favor, insira um valor numérico positivo para o depósito.");
      setIsDepositSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/user/balance', { // Endpoint original
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

      setDepositMessage(data.message || `R$ ${amountNumber.toFixed(2)} adicionados com sucesso! (Atualize o Navbar para ver o novo saldo)`);
    } catch (err: any) {
      console.error("Erro ao depositar fundos de teste:", err);
      setDepositMessage(err.message || 'Erro ao tentar depositar fundos.');
    } finally {
      setIsDepositSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center', maxWidth: '500px', margin: '2rem auto' }}>
      <h1>Página de Login</h1>
      <p>Esta página está no grupo de rotas <code>(auth)</code>.</p>

      {/* Formulário de Login */}
      <form onSubmit={handleLogin} style={{
        border: '1px solid #ddd',
        padding: '25px',
        marginTop: '30px',
        borderRadius: '8px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Acessar sua Conta</h2>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', textAlign: 'left', fontWeight: 'bold', color: '#555' }}>Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            style={{ width: '100%', padding: '12px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
            disabled={isLoginSubmitting}
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', textAlign: 'left', fontWeight: 'bold', color: '#555' }}>Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
            required
            style={{ width: '100%', padding: '12px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
            disabled={isLoginSubmitting}
          />
        </div>
        <button
          type="submit"
          disabled={isLoginSubmitting}
          style={{
            width: '100%',
            padding: '12px 15px',
            cursor: 'pointer',
            backgroundColor: isLoginSubmitting ? '#b0bec5' : '#007bff', // Cor azul primária
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: 'bold',
            transition: 'background-color 0.2s ease'
          }}
          onMouseOver={(e) => { if (!isLoginSubmitting) (e.target as HTMLButtonElement).style.backgroundColor = '#0056b3'; }}
          onMouseOut={(e) => { if (!isLoginSubmitting) (e.target as HTMLButtonElement).style.backgroundColor = '#007bff'; }}
        >
          {isLoginSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
        {loginMessage && (
          <p style={{
            marginTop: '15px',
            padding: '10px',
            borderRadius: '4px',
            backgroundColor: loginMessage.toLowerCase().includes('erro') || loginMessage.toLowerCase().includes('falha') ? '#ffebee' : '#e8f5e9',
            color: loginMessage.toLowerCase().includes('erro') || loginMessage.toLowerCase().includes('falha') ? '#c62828' : '#2e7d32',
            fontWeight: 'bold',
            border: `1px solid ${loginMessage.toLowerCase().includes('erro') || loginMessage.toLowerCase().includes('falha') ? '#c62828' : '#2e7d32'}`
          }}>
            {loginMessage}
          </p>
        )}
        {/* <p style={{ marginTop: '1rem', fontSize: '0.9em' }}>
          <a href="/forgot-password" style={{ color: '#007bff', textDecoration: 'none' }}>Esqueceu a senha?</a>
        </p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.9em' }}>
          Não tem uma conta? <a href="/register" style={{ color: '#007bff', textDecoration: 'none' }}>Crie uma aqui</a>.
        </p> */}
      </form>

      {/* Seção de Fundos de Teste (mantida do seu código original) */}
      <div style={{
        border: '1px solid #ccc',
        padding: '20px',
        marginTop: '40px',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
      }}>
        <h2>Fundos de Teste (Utilitário)</h2>
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
            disabled={isDepositSubmitting}
          />
          <button
            onClick={handleTestDeposit}
            disabled={isDepositSubmitting}
            style={{
              padding: '8px 15px',
              cursor: 'pointer',
              backgroundColor: isDepositSubmitting ? '#ccc' : '#28a745', // Cor verde
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            {isDepositSubmitting ? 'Processando...' : 'Depositar Fundos de Teste'}
          </button>
        </div>
        {depositMessage && (
          <p style={{
            marginTop: '15px',
            color: depositMessage.toLowerCase().includes('erro') || depositMessage.toLowerCase().includes('falha') ? 'red' : 'green',
            fontWeight: 'bold'
          }}>
            {depositMessage}
          </p>
        )}
      </div>
    </div>
  );
}