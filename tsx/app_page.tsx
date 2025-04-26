'use client'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()

  return (
    <div>
      {isConnected ? (
        <div>
          <p>Conectado: {address}</p>
          <button onClick={() => disconnect()}>Desconectar</button>
        </div>
      ) : (
        <button onClick={() => connect()}>Conectar Carteira</button>
      )}
    </div>
  )
}