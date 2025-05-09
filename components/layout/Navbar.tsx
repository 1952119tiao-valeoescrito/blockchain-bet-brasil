// components/layout/Navbar.tsx
"use client"; // Necessário para useState e useEffect

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/user/balance'); // Faz a chamada para nossa API
        if (!response.ok) {
          throw new Error('Falha ao buscar saldo');
        }
        const data = await response.json();
        setBalance(data.balance);
      } catch (err: any) {
        console.error("Erro ao buscar saldo:", err);
        setError(err.message || 'Erro ao carregar saldo.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, []); // Array de dependências vazio, executa uma vez ao montar o componente

  const formatCurrency = (value: number | null) => {
    if (value === null) return '...';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <nav style={{
      backgroundColor: '#333',
      color: 'white',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: '60px', // Para evitar que o layout pule enquanto carrega
    }}>
      <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem' }}>
        BetBrasil
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ marginRight: '1rem', fontSize: '0.9rem' }}>
          {isLoading && <span>Carregando saldo...</span>}
          {error && <span style={{ color: 'red' }}>{error}</span>}
          {!isLoading && !error && balance !== null && (
            <span>Saldo: <strong>{formatCurrency(balance)}</strong></span>
          )}
        </div>
        <Link href="/apostas" style={{ color: 'white', textDecoration: 'none' }}>
          Apostas
        </Link>
        <Link href="/login" style={{ color: 'white', textDecoration: 'none' }}>
          Login
        </Link>
        <Link href="/register" style={{ color: 'white', textDecoration: 'none' }}>
          Registrar
        </Link>
      </div>
    </nav>
  );
}