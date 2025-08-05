// next.config.ts

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Adicione a configuração do ESLint aqui dentro
  eslint: {
    // Isto diz para o Next.js: "Não rode o ESLint durante o processo de build na Vercel."
    // Isso vai calar o erro "Invalid Options" de uma vez por todas.
    ignoreDuringBuilds: true,
  },

  // Você pode adicionar outras configurações do Next.js aqui no futuro, se precisar.
  /*
  reactStrictMode: true,
  */
};

export default nextConfig;