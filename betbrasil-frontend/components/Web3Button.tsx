'use client'
import { useAccount } from 'wagmi'

export default function Web3Button() {
  const { address, isConnected } = useAccount() // <-- Aqui declaramos isConnected

  return (
    <button className="bg-amber-500 px-4 py-2 rounded-lg font-bold hover:bg-amber-600 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
      {isConnected ? `🦊 ${address?.slice(0,6)}...` : "🔥 CONECTAR WALLET"}
    </button>
  )
}