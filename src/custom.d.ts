// src/custom.d.ts

// Este é o crachá VIP. Ele adiciona a palavra 'w3m-button' ao dicionário do TypeScript/React.
declare namespace JSX {
  interface IntrinsicElements {
    'w3m-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}