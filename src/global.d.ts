// CÓDIGO CORRIGIDO para: src/global.d.ts

import { Eip1193Provider } from 'ethers';

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}