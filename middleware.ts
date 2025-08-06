import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // Adicione todos os idiomas que você suporta
  locales: ['pt', 'en'],

  // Se a localidade não estiver na URL, este será o idioma padrão
  defaultLocale: 'pt'
});

export const config = {
  // Ignora os caminhos que não precisam de tradução
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};