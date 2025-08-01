'use client';

// Define os tipos de propriedades que nosso componente vai receber
type UiMessageCardProps = {
  message: string | null;
  type: 'success' | 'error' | 'info' | null;
};

// Mapeamento dos tipos para as classes de estilo do TailwindCSS
const typeStyles = {
  success: {
    bg: 'bg-green-900/50',
    border: 'border-green-500',
    text: 'text-green-300',
    title: 'Sucesso!',
  },
  error: {
    bg: 'bg-red-900/50',
    border: 'border-red-500',
    text: 'text-red-300',
    title: 'Ocorreu um Erro',
  },
  info: {
    bg: 'bg-sky-900/50',
    border: 'border-sky-500',
    text: 'text-sky-300',
    title: 'Aviso',
  },
};

// O componente em si, agora exportado corretamente
export const UiMessageCard = ({ message, type }: UiMessageCardProps) => {
  // Se não tiver mensagem ou tipo, não renderiza nada
  if (!message || !type) {
    return null;
  }

  const styles = typeStyles[type];

  return (
    <div
      className={`w-full p-4 rounded-md border ${styles.bg} ${styles.border}`}
      role="alert"
    >
      <h4 className={`font-bold ${styles.text}`}>{styles.title}</h4>
      <p className={`mt-1 text-sm ${styles.text}`}>{message}</p>
    </div>
  );
};