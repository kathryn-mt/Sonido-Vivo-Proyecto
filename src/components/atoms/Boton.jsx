import { Button } from "react-bootstrap";

function Boton(props) {
  return (
    <Button 
    type={props.tipo || 'button'}
      variant={props.variante || "primary"} 
      onClick={props.onClick}
      className="w-100"
    >
      {props.texto}
    </Button>
  );
}

export default Boton;