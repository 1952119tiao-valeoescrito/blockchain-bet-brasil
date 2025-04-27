'use client'
import { WagmiConfig } from 'wagmi'
import { config } from '../wagmi.config'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <WagmiConfig config={config}>
        <body>{children}</body>
      </WagmiConfig>
    </html>
  )
}