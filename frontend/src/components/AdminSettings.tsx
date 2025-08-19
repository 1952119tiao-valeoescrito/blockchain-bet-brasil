// Caminho: /src/components/AdminSettings.tsx
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { isAddress } from 'viem';

export type AdminSettingsProps = {
  isBusy: boolean;
  currentFee: bigint | undefined;
  setTaxaPlataforma: (newFee: number) => void;
  transferOwnership: (newOwner: `0x${string}`) => void;
};

export default function AdminSettings({
  isBusy, currentFee, setTaxaPlataforma, transferOwnership
}: AdminSettingsProps) {
  const t = useTranslations('AdminPanel.Settings');
  const [newFee, setNewFee] = useState('');
  const [newOwnerAddress, setNewOwnerAddress] = useState('');

  const handleSetFee = () => {
    const feePercent = parseInt(newFee, 10);
    if (isNaN(feePercent) || feePercent < 0 || feePercent > 50) {
      return toast.error(t('error_invalid_fee'));
    }
    setTaxaPlataforma(feePercent);
  };

  const handleTransferOwnership = () => {
    if (!isAddress(newOwnerAddress)) {
      return toast.error(t('error_invalid_address'));
    }
    transferOwnership(newOwnerAddress as `0x${string}`);
  };

  const currentFeePercent = currentFee !== undefined ? Number(currentFee) : 'N/A';

  return (
    <div className="w-full p-6 bg-slate-800/50 rounded-lg border border-slate-700">
      <h3 className="text-xl font-bold text-center text-slate-100 mb-6">{t('title')}</h3>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-slate-900/50 rounded-md mb-6">
        <div>
          <h4 className="font-semibold">{t('fee_title')}</h4>
          <p className="text-sm text-slate-400">{t('fee_current', { fee: currentFeePercent })}</p>
        </div>
        <div className="flex items-center gap-2">
          <input type="text" value={newFee} onChange={(e) => setNewFee(e.target.value)} placeholder={t('fee_placeholder')} className="input-admin w-36" disabled={isBusy}/>
          <button onClick={handleSetFee} disabled={isBusy || !newFee} className="btn-admin bg-indigo-600 hover:bg-indigo-700">
            {t('button_change')}
          </button>
        </div>
      </div>
      <div className="p-4 rounded-md border border-red-500/50 bg-red-900/20">
        <h4 className="font-semibold text-red-400">{t('owner_title')}</h4>
        <p className="text-xs text-amber-400 mb-2">{t('owner_warning')}</p>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <input type="text" value={newOwnerAddress} onChange={(e) => setNewOwnerAddress(e.target.value)} placeholder={t('owner_placeholder')} className="input-admin flex-grow" disabled={isBusy}/>
          <button onClick={handleTransferOwnership} disabled={isBusy || !newOwnerAddress} className="btn-admin bg-red-600 hover:bg-red-700">
            {t('button_transfer')}
          </button>
        </div>
      </div>
    </div>
  );
}