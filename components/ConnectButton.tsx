'use client'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'

export default function ConnectButton() {
  const { address, isConnected } = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()

  const injectedConnector = injected()

  return (
    <div>
      {isConnected ? (
        <button onClick={() => disconnect()}>
          Disconnect {address?.slice(0, 6)}...{address?.slice(-4)}
        </button>
      ) : (
        <button onClick={() => connect({ connector: injectedConnector })}>
          Connect Wallet
        </button>
      )}
    </div>
  )
}