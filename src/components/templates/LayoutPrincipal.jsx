import { Container } from "react-bootstrap";
import Navbar from "../organisms/Navbar";
import Footer from "../organisms/Footer";

function LayoutPrincipal({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
     
      <Navbar />
      
      <main className="flex-grow-1">
        <Container>
          {children}
        </Container>
      </main>

      <Footer />
    </div>
  );
}

export default LayoutPrincipal;