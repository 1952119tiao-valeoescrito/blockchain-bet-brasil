// Importa o plugin do next-intl
import withNextIntl from 'next-intl/plugin';

// O plugin precisa saber onde está o seu arquivo de configuração de rotas e traduções.
const withNextIntlConfig = withNextIntl('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Você pode ter outras configurações aqui.
  // Elas serão mantidas.
};

// "Envelopamos" a sua configuração do Next.js com a configuração do next-intl.
// Isso faz a "apresentação oficial" entre os dois.
export default withNextIntlConfig(nextConfig);