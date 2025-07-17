// tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  // AQUI ESTÁ A CORREÇÃO MAIS IMPORTANTE!
  // Garantimos que ele vai ler todos os arquivos necessários dentro da pasta 'src'.
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Suas extensões de tema, se houver, continuam aqui.
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
```**Por que isso funciona?** A propriedade `content` agora diz: "Tailwind, escaneie TODAS as pastas (`pages`, `components`, `app`) dentro de `src` em busca de qualquer arquivo que termine com `.js`, `.ts`, `.jsx`, ou `.tsx`."

#### **Passo 2: Garantir que a "Tinta" está Carregada (`globals.css`)**

Este é o suspeito número 2. Precisamos garantir que o seu arquivo CSS principal está importando o Tailwind corretamente.

1.  **Abra o arquivo `src/app/globals.css`.**
2.  **Verifique se as 3 linhas abaixo estão no TOPO do arquivo.** Muitas vezes, ao editar, elas podem ser apagadas sem querer.

**Seu `src/app/globals.css` deve começar assim:**

```css
/* src/app/globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Suas outras estilizações personalizadas, como o body, vêm DEPOIS */
body {
  background-color: #0f172a; /* um azul bem escuro (slate-900) */
  background-image: radial-gradient(circle at top, #1e293b, #0f172a);
  background-attachment: fixed;
  color: #d1d5db; /* Adicionando uma cor de texto padrão */
}

/* O resto do seu CSS, se houver... */