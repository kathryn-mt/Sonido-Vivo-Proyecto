import { Form } from 'react-bootstrap';
import Input from "../atoms/Input.jsx";

function CampoConLabel(props) {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{props.label}</Form.Label>
      <Input
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
      />
    </Form.Group>
  );
}

export default CampoConLabel;; 