// app/admin/page.tsx

import AdminPanel from "@/components/AdminPanel";

export default function AdminPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8">
          Painel de Administração - Blockchain BetBrasil
        </h1>
        <AdminPanel />
      </div>
    </main>
  );
}