// Caminho: /i18n.ts
import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async ({locale}) => {
  // Carrega as mensagens de tradução para o idioma (locale) solicitado.
  // O `default` é necessário porque o import dinâmico retorna um módulo.
  return {
    messages: (await import(`./src/messages/${locale}.json`)).default
  };
});