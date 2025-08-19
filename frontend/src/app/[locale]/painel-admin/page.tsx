// Caminho: /src/app/[locale]/painel-admin/page.tsx
'use client';

import AdminGuard from "@/components/AdminGuard";
import AdminRoundControls from "@/components/admin/IniciarRodadaForm"; // Corrigindo o nome para consistência
import AdminRegisterResults from "@/components/admin/RegistrarResultadosForm"; // Corrigindo o nome
import AdminSettings from "@/components/AdminSettings";
import { useTranslations } from "next-intl";
import { useLotteryAdmin } from '@/hooks/useLotteryAdmin'; // O cérebro da operação!

export default function AdminPage() {
  const t = useTranslations('AdminPanel');
  
  // Uma única chamada que nos dá tudo que precisamos!
  const { 
    isOwner, 
    isLoading, 
    isBusy, 
    roundInfo, 
    taxaAtual,
    iniciarNovaRodada, 
    fecharApostas,
    registrarResultados,
    setTaxaPlataforma,
    transferOwnership
  } = useLotteryAdmin();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6 text-green-400">{t('title')}</h1>
      
      {/* O AdminGuard cuida da segurança */}
      <AdminGuard>
        <div className="space-y-8">
          {/* Cada componente recebe apenas o que precisa */}
          <AdminRoundControls 
            isBusy={isBusy}
            iniciarNovaRodada={iniciarNovaRodada}
          />
          <AdminRegisterResults 
            isBusy={isBusy}
            roundInfo={roundInfo}
            fecharApostas={fecharApostas}
            registrarResultados={registrarResultados}
          />
          <AdminSettings
            isBusy={isBusy}
            currentFee={taxaAtual}
            setTaxaPlataforma={setTaxaPlataforma}
            transferOwnership={transferOwnership}
          />
        </div>
      </AdminGuard>
    </div>
  );
}