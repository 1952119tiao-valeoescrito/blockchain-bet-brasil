'use client'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

export default function ConnectButton() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({ connector: new InjectedConnector() })
  const { disconnect } = useDisconnect()

  return (
    <button 
      onClick={() => isConnected ? disconnect() : connect()}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      {isConnected ? `Connected: ${address?.slice(0, 6)}...` : "Connect Wallet"}
    </button>
  )
}