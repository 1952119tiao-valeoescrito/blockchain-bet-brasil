// Caminho: /src/components/ConnectWalletButton.tsx
'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useTranslations } from 'next-intl';

export default function ConnectWalletButton() {
  const t = useTranslations('ConnectWalletButton');
  return (
    <ConnectButton 
      label={t('label')}
      showBalance={false}
      accountStatus={{
        smallScreen: 'avatar',
        largeScreen: 'full',
      }}
    />
  );
}