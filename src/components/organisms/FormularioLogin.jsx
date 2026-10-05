import { useState } from 'react';
import { Container, Row, Col, Card } from "react-bootstrap";
import CampoConLabel from "../molecules/CampoConLabel.jsx";
import Boton from "../atoms/Boton.jsx";
import { validarLogin } from '../../utils/validaciones.js';

function FormularioLogin({ onLogin }) {
  const [datos, setDatos] = useState({ email: '', password: '' });
  
  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    setDatos({ 
      ...datos, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = () => {
    const erroresValidacion = validarLogin(datos);
    
    if (Object.keys(erroresValidacion).length === 0) {

      onLogin(datos); 
    } else {

      setErrores(erroresValidacion);
    }
  };
    return (
        <Container className="mt-5">
          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6}>
               <Card className="p-4 shadow">
                <h2 className="text-center mb-4">Sonido Vivo</h2>
                <p className="text-center mb-4">Inicia sesión para continuar</p>

                <CampoConLabel
                  label="Correo electrónico"
                  name="email"   
                  type="email"
                  placeholder="tu_@correo.com"
                  value={datos.email}
                  onChange={handleChange} 
                  error={errores.email}  
                /> 

                <CampoConLabel
                  label="Contraseña"
                  name="password" 
                  type="password"
                  placeholder="********"
                  value={datos.password} 
                  onChange={handleChange} 
                  error={errores.password} 
                />

                <div className="mt-3">
                    <Boton
                      texto="Ingresar"
                      variante="primary"
                      onClick={handleSubmit}
                    />
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
    );
}

export default FormularioLogin;
          
              
            

        
        

