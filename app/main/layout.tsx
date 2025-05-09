export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{
      border: '2px dashed #28a745', // Verde para destacar
      padding: '1rem',
      margin: '1rem',
      backgroundColor: '#f0fff0' // Um fundo levemente verde
    }}>
      <p style={{ marginTop: 0, color: 'darkgreen', fontWeight: 'bold', textAlign: 'center' }}>
        Layout Específico do Grupo (main)
      </p>
      {children}
    </div>
  );
}