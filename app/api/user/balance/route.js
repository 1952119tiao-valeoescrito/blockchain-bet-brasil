// Caminho do arquivo: app/api/user/balance/route.js

import { NextResponse } from 'next/server';

// Simulação de um "banco de dados" em memória para o saldo de teste.
// IMPORTANTE: Este saldo será resetado toda vez que o servidor reiniciar
// ou quando houver um novo deploy na Vercel. Para um saldo persistente,
// você precisaria de um banco de dados real.
let currentTestBalance = 0;

export async function POST(request) {
  try {
    const body = await request.json(); // Pega o corpo da requisição (espera-se um JSON)
    const { amount } = body; // Extrai a propriedade 'amount'

    // Validação básica do valor recebido
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Valor para depósito inválido. Deve ser um número positivo.' },
        { status: 400 } // HTTP 400 Bad Request
      );
    }

    // Adiciona ao saldo de teste simulado
    currentTestBalance += amount;

    console.log(`API /api/user/balance (POST): Depósito de teste de ${amount}. Novo saldo simulado: ${currentTestBalance}`);

    // Retorna uma resposta de sucesso
    return NextResponse.json({
      success: true,
      message: `R$ ${amount.toFixed(2)} de teste adicionados com sucesso.`,
      newBalance: currentTestBalance // Opcional: retornar o novo saldo para o frontend
    });

  } catch (error) {
    // Captura erros (ex: se o corpo da requisição não for JSON válido, ou outros erros inesperados)
    console.error("Erro na API POST /api/user/balance:", error);
    let errorMessage = 'Erro interno no servidor ao processar o depósito.';
    if (error instanceof SyntaxError) { // Exemplo de tratamento de erro mais específico
        errorMessage = 'Corpo da requisição inválido. Esperado um JSON.';
    }
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 } // HTTP 500 Internal Server Error
    );
  }
}

// Você também pode querer um endpoint GET para buscar o saldo atual (opcional)
export async function GET(request) {
  try {
    // Em uma aplicação real, você provavelmente identificaria o usuário
    // (por exemplo, através de uma sessão ou token) e buscaria o saldo específico dele.
    // Para esta simulação, apenas retornamos o saldo de teste global.
    console.log(`API /api/user/balance (GET): Buscando saldo simulado. Atual: ${currentTestBalance}`);
    return NextResponse.json({
      success: true,
      balance: currentTestBalance,
      message: 'Saldo de teste obtido com sucesso.'
    });
  } catch (error) {
    console.error("Erro na API GET /api/user/balance:", error);
    return NextResponse.json(
      { success: false, message: 'Erro interno no servidor ao buscar o saldo de teste.' },
      { status: 500 }
    );
  }
}

// Se você não precisar do método GET por enquanto, pode remover a função GET exportada.
// Apenas a função POST já resolveria o erro 404 para a requisição que seu frontend está fazendo.