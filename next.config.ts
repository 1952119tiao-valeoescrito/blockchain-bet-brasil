import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Esta opção força o Next.js a compilar os pacotes listados,
   * resolvendo problemas de compatibilidade com o ecossistema Web3.
   */
  transpilePackages: ['wagmi', '@tanstack/react-query'],

  /**
   * Configuração customizada do Webpack para resolver problemas de módulos.
   */
  webpack: (config) => {
    // Adiciona uma regra para ignorar módulos que são desnecessários no frontend
    // mas que são importados por dependências (como o WalletConnect).
    // Isso evita o erro "Module not found: Can't resolve 'pino-pretty'".
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;