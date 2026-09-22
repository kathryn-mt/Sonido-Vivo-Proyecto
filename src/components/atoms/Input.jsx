import { Form } from "react-bootstrap";

function Input(props) {
  return (
    <Form.Control
      type={props.type || "text"}
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
    />
  );
}

export default Input;