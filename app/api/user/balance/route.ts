import { NextResponse } from 'next/server';

let currentUserBalance = 1000.00;

export async function GET(request: Request) {
  console.log('[API MOCK] GET /api/user/balance - Saldo atual:', currentUserBalance);
  return NextResponse.json({ balance: currentUserBalance });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const amount = parseFloat(body.amount);

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ success: false, message: 'Valor de depósito inválido.' }, { status: 400 });
    }

    currentUserBalance += amount;
    console.log(`[API MOCK] POST /api/user/balance - Adicionado: ${amount}, Novo Saldo: ${currentUserBalance}`);
    return NextResponse.json({
      success: true,
      newBalance: currentUserBalance,
      message: `R$ ${amount.toFixed(2)} adicionados com sucesso.`
    });

  } catch (error) {
    console.error('[API MOCK] Erro ao processar depósito:', error);
    return NextResponse.json({ success: false, message: 'Erro ao processar o depósito.' }, { status: 500 });
  }
}