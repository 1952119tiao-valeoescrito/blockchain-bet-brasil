import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Web3Provider } from '@/components/Web3Provider'
import { SecurityAudit } from '@/components/SecurityAudit'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Blockchain Bet Brasil - BBB da Web3',
  description: 'Plataforma de investimento e entretenimento gamificado com sistema Todo Mundo Ganha',
  keywords: 'blockchain, aposta, investimento, web3, bbb',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        <Web3Provider>
          <SecurityAudit />
          {children}
        </Web3Provider>
      </body>
    </html>
  )
}
