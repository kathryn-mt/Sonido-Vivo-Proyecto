import { Form } from "react-bootstrap";

function Input(props) {
  return (
    <Form.Control
      name={props.name}
      type={props.type || "text"}
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
      isInvalid={!!props.error}
    />
  );
}

export default Input;