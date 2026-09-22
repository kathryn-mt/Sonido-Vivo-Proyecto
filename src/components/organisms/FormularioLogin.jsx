import { Container, Row, Col, Card } from "react-bootstrap";
import CampoConLabel from "../molecules/CampoConLabel.jsx";
import Boton from "../atoms/Boton.jsx";

function FormularioLogin({ onLogin }) {
    return (
        <Container className="mt-5">
          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6}>
               <Card className="p-4 shadow">
                <h2 className="text-center mb-4">Sonido Vivo</h2>
                <p className="text-center mb-4">Inicia sesión para continuar</p>

                <CampoConLabel
                  label="Correo electrónico"
                  type="email"
                  placeholder="tu_@correo.com"
                /> 

                <CampoConLabel
                  label="Contraseña"
                  type="password"
                  placeholder="********"
                />

                <div className="mt-3">
                    <Boton
                      texto="Ingresar"
                      variante="primary"
                      onClick={onLogin}
                    />
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
    );
}

export default FormularioLogin;
          
              
            

        
        

