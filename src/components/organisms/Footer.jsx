import { Container } from "react-bootstrap";

function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <Container className="text-center">
        <p className="mb-0 small">
          © 2026 Sonido Vivo - Viña del Mar. Todos los derechos reservados.
        </p>
        <small className="text-muted">
          Proyecto DSY1104 · Desarrollo Full Stack II
        </small>
      </Container>
    </footer>
  );
}

export default Footer;