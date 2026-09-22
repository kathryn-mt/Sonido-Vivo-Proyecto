import { Container } from "react-bootstrap";

function LayoutPrincipal({ children }) {
  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      {children}
    </Container>
  );
}

export default LayoutPrincipal;
