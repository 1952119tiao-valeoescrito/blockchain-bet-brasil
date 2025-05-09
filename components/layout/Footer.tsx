export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#222',
      color: 'white',
      padding: '1rem',
      textAlign: 'center',
      marginTop: 'auto',
    }}>
      <p>© {new Date().getFullYear()} BetBrasil. Todos os direitos reservados.</p>
    </footer>
  );
}