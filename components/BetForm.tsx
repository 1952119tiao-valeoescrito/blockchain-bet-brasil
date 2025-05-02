import toast from 'react-hot-toast';

export function showWalletToast(isConnected: boolean) {
  toast.success(`Wallet ${isConnected ? 'connected' : 'disconnected'}`);
}