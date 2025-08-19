// src/app/[locale]/page.tsx

import HomePage from '@/app/HomePage'; // Usando o atalho mágico '@'// Importando o componente que acabamos de criar

export default function Page() {
  // A única responsabilidade deste arquivo é renderizar o componente da página principal.
  return <HomePage />;
}