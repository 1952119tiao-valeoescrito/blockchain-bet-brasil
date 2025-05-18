// app/(auth)/register/page.tsx
"use client";

import { useState } from 'react';
// import { useRouter } from 'next/navigation'; // Descomente se for usar redirecionamento após registro

export default function RegisterPage() {
  // Estado para o formulário de registro
  const [name, setName] = useState<string>(""); // Nome do usuário
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [registerMessage, setRegisterMessage] = useState<string | null>(null);
  const [isRegisterSubmitting, setIsRegisterSubmitting] = useState<boolean>(false);

  // const router = useRouter(); // Descomente e use router.push('/login') ou '/dashboard' após registro

  // Função para lidar com o registro
  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Previne o comportamento padrão de submit do formulário
    if (isRegisterSubmitting) return;
    setIsRegisterSubmitting(true);
    setRegisterMessage(null);

    // Validações básicas
    if (!name || !email || !password || !confirmPassword) {
      setRegisterMessage("Por favor, preencha todos os campos.");
      setIsRegisterSubmitting(false);
      return;
    }
    if (password !== confirmPassword) {
      setRegisterMessage("As senhas não coincidem.");
      setIsRegisterSubmitting(false);
      return;
    }
    if (password.length < 6) { // Exemplo de validação de senha
      setRegisterMessage("A senha deve ter pelo menos 6 caracteres.");
      setIsRegisterSubmitting(false);
      return;
    }

    try {
      // AQUI VOCÊ FARIA A CHAMADA REAL PARA SUA API DE REGISTRO
      // Exemplo:
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ name, email, password }),
      // });
      // const data = await response.json();
      // if (!response.ok || !data.success) {
      //   throw new Error(data.message || 'Falha ao registrar.');
      // }
      // setRegisterMessage(data.message || "Registro realizado com sucesso! Faça login para continuar.");
      // router.push('/login'); // Redireciona para a página de login

      // Simulação de chamada de API para registro
      console.log("Tentando registrar com:", { name, email, password });
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simula delay da API

      // Simulação de sucesso (substitua pela lógica real)
      // Para teste, vamos assumir que qualquer email novo é aceito
      setRegisterMessage("Registro realizado com sucesso! Você já pode fazer login. (Simulado)");
      // Limpar campos opcionais após sucesso
      // setName("");
      // setEmail("");
      // setPassword("");
      // setConfirmPassword("");
      // router.push('/login'); // Exemplo de redirecionamento para a página de login

    } catch (err: any) {
      console.error("Erro no registro:", err);
      setRegisterMessage(err.message || 'Erro ao tentar registrar.');
    } finally {
      setIsRegisterSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center', maxWidth: '500px', margin: '2rem auto' }}>
      <h1>Página de Registro</h1>
      <p>Esta página também está no grupo de rotas <code>(auth)</code>.</p>

      {/* Formulário de Registro */}
      <form onSubmit={handleRegister} style={{
        border: '1px solid #ddd',
        padding: '25px',
        marginTop: '30px',
        borderRadius: '8px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Criar Nova Conta</h2>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', textAlign: 'left', fontWeight: 'bold', color: '#555' }}>Nome Completo:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome completo"
            required
            style={{ width: '100%', padding: '12px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
            disabled={isRegisterSubmitting}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email-register" style={{ display: 'block', marginBottom: '0.5rem', textAlign: 'left', fontWeight: 'bold', color: '#555' }}>Email:</label>
          <input
            type="email"
            id="email-register" // ID diferente do email do login para evitar conflitos se ambos estiverem na mesma página em algum momento (raro)
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            style={{ width: '100%', padding: '12px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
            disabled={isRegisterSubmitting}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password-register" style={{ display: 'block', marginBottom: '0.5rem', textAlign: 'left', fontWeight: 'bold', color: '#555' }}>Senha:</label>
          <input
            type="password"
            id="password-register"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Crie uma senha (mín. 6 caracteres)"
            required
            style={{ width: '100%', padding: '12px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
            disabled={isRegisterSubmitting}
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '0.5rem', textAlign: 'left', fontWeight: 'bold', color: '#555' }}>Confirmar Senha:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repita a senha"
            required
            style={{ width: '100%', padding: '12px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
            disabled={isRegisterSubmitting}
          />
        </div>
        <button
          type="submit"
          disabled={isRegisterSubmitting}
          style={{
            width: '100%',
            padding: '12px 15px',
            cursor: 'pointer',
            backgroundColor: isRegisterSubmitting ? '#b0bec5' : '#28a745', // Cor verde
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: 'bold',
            transition: 'background-color 0.2s ease'
          }}
          onMouseOver={(e) => { if (!isRegisterSubmitting) (e.target as HTMLButtonElement).style.backgroundColor = '#1e7e34'; }}
          onMouseOut={(e) => { if (!isRegisterSubmitting) (e.target as HTMLButtonElement).style.backgroundColor = '#28a745'; }}
        >
          {isRegisterSubmitting ? 'Registrando...' : 'Criar Conta'}
        </button>
        {registerMessage && (
          <p style={{
            marginTop: '15px',
            padding: '10px',
            borderRadius: '4px',
            backgroundColor: registerMessage.toLowerCase().includes('erro') || registerMessage.toLowerCase().includes('falha') ? '#ffebee' : '#e8f5e9',
            color: registerMessage.toLowerCase().includes('erro') || registerMessage.toLowerCase().includes('falha') ? '#c62828' : '#2e7d32',
            fontWeight: 'bold',
            border: `1px solid ${registerMessage.toLowerCase().includes('erro') || registerMessage.toLowerCase().includes('falha') ? '#c62828' : '#2e7d32'}`
          }}>
            {registerMessage}
          </p>
        )}
        <p style={{ marginTop: '1rem', fontSize: '0.9em' }}>
          Já tem uma conta? <a href="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Faça login aqui</a>.
        </p>
      </form>
    </div>
  );
}