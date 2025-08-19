// Caminho: middleware.ts (na raiz do projeto)

import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // Adicione aqui TODOS os idiomas que sua aplicação suporta
  // Exemplo: ['pt-BR', 'en', 'es']
  locales: ['pt-BR', 'en'],

  // Este é o idioma que será usado se o navegador do usuário
  // não tiver uma preferência que combine com a sua lista.
  defaultLocale: 'pt-BR'
});

export const config = {
  // A mágica acontece aqui. Esta configuração diz ao middleware
  // para rodar em TODAS as rotas, exceto aquelas que já são
  // arquivos estáticos ou internas do Next.js.
  // Ele vai capturar a rota '/' e redirecionar.
  matcher: ['/((?!api|_next|.*\\..*).*)']
};