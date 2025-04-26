'use client'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export default function Web3Button() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({ connector: new InjectedConnector() })
  const { disconnect } = useDisconnect()

  return (
    <button 
      onClick={() => isConnected ? disconnect() : connect()}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
    >
      {isConnected ? `🦊 ${address?.slice(0,6)}...` : "🔥 Conectar MetaMask"}
    </button>
  )
}