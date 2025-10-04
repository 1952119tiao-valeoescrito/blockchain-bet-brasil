'use client'

import React, { useState, useEffect } from 'react'
import { useAccount, useWaitForTransactionReceipt } from 'wagmi' // <- useWaitForTransactionReceipt

interface TransactionNotification {
  hash: string
  status: 'pending' | 'success' | 'error' | 'warning'
  message: string
  timestamp: number
}

export function SecurityAudit() {
  const { address, isConnected } = useAccount()
  const [notifications, setNotifications] = useState<TransactionNotification[]>([])
  const [securityScore, setSecurityScore] = useState(100)
  const [threatsDetected, setThreatsDetected] = useState<string[]>([])

  // Monitorar transações da MetaMask
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleMessage = (message: any) => {
        if (message.type === 'transaction_submitted') {
          addNotification({
            hash: message.transactionHash,
            status: 'pending',
            message: '📫 Transação enviada para a blockchain...',
            timestamp: Date.now()
          })
        }
      }

      const handleAccountsChanged = (accounts: string[]) => {
        addNotification({
          hash: 'account-change',
          status: 'warning',
          message: '🔄 Conta da carteira alterada',
          timestamp: Date.now()
        })
      }

      const handleChainChanged = (chainId: string) => {
        addNotification({
          hash: 'chain-change',
          status: 'warning', 
          message: `🌐 Rede alterada para: ${parseInt(chainId, 16)}`,
          timestamp: Date.now()
        })
      }

      window.ethereum.on('message', handleMessage)
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)

      return () => {
        window.ethereum?.removeListener('message', handleMessage)
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum?.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [])

  // Auditoria de segurança
  useEffect(() => {
    const detectThreats = () => {
      const detectedThreats: string[] = []

      // Verificar ambiente
      if (window.location.hostname !== 'localhost' && !window.location.hostname.includes('vercel.app')) {
        if (!window.location.protocol.includes('https')) {
          detectedThreats.push('Conexão não segura (HTTP)')
        }
      }

      // Verificar Web3 provider
      if (typeof window.ethereum === 'undefined') {
        detectedThreats.push('Provider Web3 não detectado')
      } else {
        // Verificar rede
        if (window.ethereum.chainId !== '0xaa36a7') { // Sepolia
          detectedThreats.push('Rede não autorizada detectada')
        }
      }

      // Verificar notificações suspeitas
      const recentErrors = notifications.filter(n => 
        n.status === 'error' && 
        Date.now() - n.timestamp < 30000 // últimos 30 segundos
      )
      
      if (recentErrors.length > 3) {
        detectedThreats.push('Múltiplas transações falhando')
      }

      setThreatsDetected(detectedThreats)
      setSecurityScore(Math.max(0, 100 - (detectedThreats.length * 20)))
    }

    detectThreats()
    const interval = setInterval(detectThreats, 10000) // Verificar a cada 10 segundos

    return () => clearInterval(interval)
  }, [notifications])

  const addNotification = (notification: TransactionNotification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 4)]) // Mantém apenas as 5 mais recentes
    
    // Auto-remover após 8 segundos (exceto pendentes)
    if (notification.status !== 'pending') {
      setTimeout(() => {
        removeNotification(notification.hash)
      }, 8000)
    }
  }

  const removeNotification = (hash: string) => {
    setNotifications(prev => prev.filter(n => n.hash !== hash))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳'
      case 'success': return '✅'
      case 'error': return '❌'
      case 'warning': return '⚠️'
      default: return 'ℹ️'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-500 border-blue-400'
      case 'success': return 'bg-emerald-500 border-emerald-400'
      case 'error': return 'bg-red-500 border-red-400'
      case 'warning': return 'bg-amber-500 border-amber-400'
      default: return 'bg-slate-500 border-slate-400'
    }
  }

  // Hook para monitorar transações (exemplo)
  const { data: receipt, isError } = useWaitForTransactionReceipt({ // <- useWaitForTransactionReceipt
  hash: notifications.find(n => n.status === 'pending')?.hash as `0x${string}`,
})

  // Atualizar status da transação quando confirmada
  useEffect(() => {
    if (receipt) {
      const success = receipt.status === 'success'
      const pendingNotification = notifications.find(n => n.status === 'pending')
      
      if (pendingNotification) {
        updateNotificationStatus(
          pendingNotification.hash,
          success ? 'success' : 'error',
          success ? '🎉 Transação confirmada na blockchain!' : '❌ Transação falhou'
        )
      }
    }
  }, [receipt])

  const updateNotificationStatus = (hash: string, status: 'success' | 'error', message: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.hash === hash 
          ? { ...n, status, message, timestamp: Date.now() }
          : n
      )
    )
  }

  // Simular transação de teste (para demonstração)
  const simulateTransaction = () => {
    const testHash = '0x' + Math.random().toString(16).substr(2, 64)
    
    addNotification({
      hash: testHash,
      status: 'pending',
      message: '🧪 Transação de teste enviada...',
      timestamp: Date.now()
    })

    // Simular confirmação após 3 segundos
    setTimeout(() => {
      updateNotificationStatus(
        testHash,
        'success',
        '🎉 Transação de teste confirmada!'
      )
    }, 3000)
  }

  if (!isConnected) return null

  return (
    <>
      {/* Notificações de Transação */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {notifications.map((notification) => (
          <div
            key={notification.hash}
            className={`p-4 rounded-lg border-2 shadow-lg text-white font-semibold transform transition-all duration-300 animate-fade-in-down ${getStatusColor(notification.status)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg">{getStatusIcon(notification.status)}</span>
                <div>
                  <p className="text-sm">{notification.message}</p>
                  {notification.status === 'pending' && (
                    <div className="w-full bg-white/30 rounded-full h-1 mt-2">
                      <div className="bg-white h-1 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeNotification(notification.hash)}
                className="text-white/70 hover:text-white text-lg"
              >
                ×
              </button>
            </div>
            
            {/* Link para explorer para transações reais */}
            {notification.hash.startsWith('0x') && notification.hash.length === 66 && (
              <a
                href={`https://sepolia.etherscan.io/tx/${notification.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs underline opacity-70 hover:opacity-100 block mt-2"
              >
                Ver no Explorer
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Painel de Auditoria de Segurança */}
      {(threatsDetected.length > 0 || securityScore < 100) && (
        <div className="fixed bottom-4 left-4 z-50 bg-slate-800 border border-red-500/30 rounded-lg p-4 max-w-sm shadow-lg">
          <div className="flex items-center mb-2">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              securityScore > 80 ? 'bg-green-500' : 
              securityScore > 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <h4 className="text-white font-semibold">Auditoria de Segurança</h4>
            <button 
              onClick={() => setSecurityScore(100)}
              className="ml-auto text-slate-400 hover:text-slate-300 text-sm"
            >
              ×
            </button>
          </div>
          
          <div className="text-sm text-slate-300">
            <p>Score: <span className={
              securityScore > 80 ? 'text-green-400' : 
              securityScore > 60 ? 'text-yellow-400' : 'text-red-400'
            }>{securityScore}/100</span></p>
            
            {threatsDetected.length > 0 && (
              <ul className="mt-2 space-y-1">
                {threatsDetected.map((threat, index) => (
                  <li key={index} className="flex items-center text-xs">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    {threat}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Botão de teste (apenas desenvolvimento) */}
          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={simulateTransaction}
              className="mt-3 text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded border border-slate-600"
            >
              Testar Notificação
            </button>
          )}
        </div>
      )}
    </>
  )
}