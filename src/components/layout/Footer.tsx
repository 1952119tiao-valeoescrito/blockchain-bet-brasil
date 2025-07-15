// src/components/layout/Footer.tsx

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full mt-auto bg-gray-800 border-t border-gray-700">
      <div className="container mx-auto py-4 text-center text-gray-400 text-sm">
        © {currentYear} Blockchain BetBrasil. Todos os direitos reservados.
      </div>
    </footer>
  );
}