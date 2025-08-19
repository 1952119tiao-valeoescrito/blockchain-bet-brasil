// Caminho: /src/components/CountdownTimer.tsx
"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

// Função para calcular o próximo evento (fechamento ou reabertura)
const getNextEvent = () => {
  const now = new Date();
  const nowUTC = {
    day: now.getUTCDay(), // Domingo = 0, Sexta = 5, Sábado = 6
    hours: now.getUTCHours(),
    minutes: now.getUTCMinutes()
  };

  let targetDate = new Date(now);
  let eventType: 'closing' | 'opening';

  // Horários em UTC (Brasília é UTC-3)
  const closingTime = { day: 5, hours: 20, minutes: 30 }; // Sexta, 17:30 BRT = 20:30 UTC
  const openingTime = { day: 6, hours: 0, minutes: 0 };   // Sábado, 21:00 BRT do dia anterior = 00:00 UTC de Sábado
                                                          // (Simplificado para meia-noite UTC de sábado para reabertura)

  // Estamos antes do fechamento na sexta?
  if (nowUTC.day < closingTime.day || 
      (nowUTC.day === closingTime.day && (nowUTC.hours < closingTime.hours || (nowUTC.hours === closingTime.hours && nowUTC.minutes < closingTime.minutes)))) {
    
    // Alvo é o fechamento desta semana
    eventType = 'closing';
    const daysUntilFriday = (closingTime.day - nowUTC.day + 7) % 7;
    targetDate.setUTCDate(now.getUTCDate() + daysUntilFriday);
    targetDate.setUTCHours(closingTime.hours, closingTime.minutes, 0, 0);

  } else { // Já passou do fechamento na sexta, estamos esperando a reabertura
    
    // Alvo é a reabertura no sábado
    eventType = 'opening';
    const daysUntilSaturday = (openingTime.day - nowUTC.day + 7) % 7;
    targetDate.setUTCDate(now.getUTCDate() + daysUntilSaturday);
    targetDate.setUTCHours(openingTime.hours, openingTime.minutes, 0, 0);
    
    // Se hoje já é sábado e já passou da hora de reabertura, o alvo é o fechamento da PRÓXIMA sexta.
    if (targetDate < now) {
        eventType = 'closing';
        targetDate.setUTCDate(now.getUTCDate() + ((closingTime.day - nowUTC.day + 7) % 7) + 7);
        targetDate.setUTCHours(closingTime.hours, closingTime.minutes, 0, 0);
    }
  }

  return { targetDate, eventType };
};

export default function CountdownTimer() {
  const t = useTranslations('Countdown');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [eventType, setEventType] = useState<'closing' | 'opening'>('closing');

  useEffect(() => {
    const updateCountdown = () => {
      const { targetDate, eventType: currentEvent } = getNextEvent();
      setEventType(currentEvent);
      
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    
    updateCountdown(); // Roda uma vez imediatamente
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);
  
  // O título agora muda dinamicamente!
  const title = eventType === 'closing' ? t('title_closing') : t('title_opening');

  return (
    <div className="text-center bg-slate-900/50 p-4 rounded-lg border border-slate-700">
      <h3 className="text-lg font-semibold text-cyan-400 mb-2">{title}</h3>
      <div className="grid grid-cols-4 gap-2 text-white">
        <div><span className="text-4xl font-bold">{timeLeft.days}</span><p className="text-xs">{t('days')}</p></div>
        <div><span className="text-4xl font-bold">{timeLeft.hours}</span><p className="text-xs">{t('hours')}</p></div>
        <div><span className="text-4xl font-bold">{timeLeft.minutes}</span><p className="text-xs">{t('minutes')}</p></div>
        <div><span className="text-4xl font-bold">{timeLeft.seconds}</span><p className="text-xs">{t('seconds')}</p></div>
      </div>
    </div>
  );
}