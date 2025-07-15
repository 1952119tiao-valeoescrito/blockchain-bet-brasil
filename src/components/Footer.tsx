// src/components/Footer.tsx

import Link from 'next/link';

// A CORREÇÃO ESTÁ AQUI: O 'default' voltou para casa!
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