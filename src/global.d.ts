// Em: src/global.d.ts

// Adicionamos a linha abaixo para dizer ao inspetor de código (ESLint)
// para ignorar o erro do 'any' apenas nesta linha específica.
// É a solução mais rápida e segura para o build passar.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare namespace JSX {
  interface IntrinsicElements {
    'w3m-button': any;
  }
}