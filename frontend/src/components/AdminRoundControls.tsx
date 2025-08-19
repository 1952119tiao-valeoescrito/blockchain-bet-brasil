// Caminho: /src/components/AdminRoundControls.tsx
'use client';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
// 1. DEFINIÇÃO DAS PROPS (MAIS ESPECÍFICA E SIMPLES)
// O componente agora recebe as funções que ele realmente precisa, em vez de um manipulador genérico.
export type AdminRoundControlsProps = {
isBusy: boolean;
iniciarNovaRodada: (ticketPrice: string) => void;
// Adicione outras funções de admin que pertençam a este painel, se houver.
// ex: pausarContrato: () => void;
};
const AdminRoundControls = ({ isBusy, iniciarNovaRodada }: AdminRoundControlsProps) => {
const t = useTranslations('AdminPanel.RoundControls'); // Namespace de tradução específico
const [ticketPrice, setTicketPrice] = useState('1'); // Valor padrão de 1 USDC
const handleIniciarRodada = () => {
// Validação simples para garantir que o preço não está vazio
if (!ticketPrice || parseFloat(ticketPrice) <= 0) {
// Poderíamos usar um toast de erro aqui
alert(t('error_invalid_price'));
return;
}
iniciarNovaRodada(ticketPrice);
};
// A função de pausar seria passada como prop da mesma forma
const handlePausarContrato = () => {
// pausarContrato();
console.log("A função de pausar precisa ser implementada no hook useLotteryAdmin");
};
return (
<div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
<h3 className="text-xl font-semibold text-white mb-4">{t('title')}</h3>
<div className="space-y-4">
<div>
<label htmlFor="ticketPrice" className="block text-sm font-medium text-gray-300 mb-1">
{t('ticket_price_label')}
</label>
<input
type="text"
id="ticketPrice"
value={ticketPrice}
onChange={(e) => setTicketPrice(e.target.value)}
className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-white"
placeholder={t('ticket_price_placeholder')}
disabled={isBusy}
/>
</div>
<button
onClick={handleIniciarRodada}
disabled={isBusy}
className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-500 transition-colors"
>
{isBusy ? t('button_starting') : t('button_start')}
</button>
<button
onClick={handlePausarContrato}
disabled={isBusy}
className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:bg-gray-500 transition-colors"
>
{isBusy ? t('button_pausing') : t('button_pause')}
</button>
</div>
</div>
);
};
export default AdminRoundControls;