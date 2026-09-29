function Etiqueta({ texto, variante = "secondary" }) {
  return (
    <span className={`badge bg-${variante} rounded-pill px-3 py-2`}>
      {texto}
    </span>
  );
}

export default Etiqueta;