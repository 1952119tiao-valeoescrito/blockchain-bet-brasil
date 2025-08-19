'use client';

export function WelcomeScreen() {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center text-center" style={{ minHeight: '60vh' }}>
        <h1 className="text-4xl font-bold mb-4">
          Bem-vindo ao Blockchain Bet Brasil
        </h1>
        <p className="text-xl text-gray-400">
          Conecte sua carteira no canto superior direito para começar.
        </p>
    </div>
  );
}