// src/components/Footer.tsx - VERSÃO FINAL E CORRETA

import Link from 'next/link';

// A única 'mágica' aqui é garantir o 'export default'. O resto do seu código já estava perfeito.
export default function Footer() {
    const currentYear = new Date().getFullYear();
  
    return (
      <footer className="w-full bg-slate-800 p-4">
        <div className="container mx-auto text-center text-slate-400">
            <p>© {currentYear} Blockchain Bet Brasil. Todos os direitos reservados.</p>
            
            <div className="mt-2 flex justify-center items-center gap-x-4 text-sm">
                <Link href="/termos-de-uso" className="hover:text-white hover:underline transition-colors">
                    Termos de Uso
                </Link>
                <span className="text-slate-500">|</span>
                <Link href="/politica-de-privacidade" className="hover:text-white hover:underline transition-colors">
                    Política de Privacidade
                </Link>
            </div>
        </div>
      </footer>
    );
}