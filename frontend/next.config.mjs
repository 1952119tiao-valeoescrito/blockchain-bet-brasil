// Caminho: /next.config.mjs
import createNextIntlPlugin from 'next-intl/plugin';

// O plugin `next-intl` precisa saber onde encontrar nosso arquivo de configuração de i18n
const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Você pode adicionar outras configurações do Next.js aqui no futuro.
  // Por exemplo, para otimização de imagens externas:
  /// images: {
//   remotePatterns: [
//     {
//       protocol: 'https',
//       hostname: 'example.com',
//     },
//   ],
// },

  // Ignorar erros de ESLint durante o build de produção.
  // Útil para acelerar o deploy enquanto você ainda está polindo o código.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

// Exportamos a configuração "envelopada" pelo plugin do next-intl
export default withNextIntl(nextConfig);