// ARQUIVO: /src/components/Footer.tsx

import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full bg-slate-800 mt-auto">
      <div className="container mx-auto text-center p-4 text-slate-400">
        <p>© 2025 Blockchain Bet Brasil. Todos os direitos reservados.</p>
        <div className="mt-2">
          <Link href="/termos-de-uso" className="hover:text-emerald-400 transition-colors">Termos de Uso</Link>
          <span className="mx-2">|</span>
          <Link href="/politica-de-privacidade" className="hover:text-emerald-400 transition-colors">Política de Privacidade</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;