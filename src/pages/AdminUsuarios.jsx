import { useEffect, useState } from 'react';
import {
    Alert,
    Form,
    Spinner
} from 'react-bootstrap';

import { opcionesRegiones, regionesComunas } from '../data/regionesComunas';
import { useTituloPagina } from '../hooks/useTituloPagina';
import FormularioEdicionUsuario from '../components/organisms/FormularioEdicionUsuario';
import ModalConfirmarDesactivacion from '../components/organisms/ModalConfirmarDesactivacion';
import TablaUsuarios from '../components/organisms/TablaUsuarios';
import { obtenerUsuario } from '../services/authService';
import {
    actualizarUsuario,
    desactivarUsuario,
    listarUsuarios,
    obtenerPerfilUsuario,
    reactivarUsuario
} from '../services/usuarioService';
import { normalizarRUN, validarRUNChileno } from '../utils/validacionesRegistro';

const ROLES = ['CLIENTE', 'VENDEDOR', 'ADMINISTRADOR'];
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SOLO_LETRAS = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

function mapearUsuario(usuario) {
    const estado = String(usuario.estado || '').toUpperCase();
    let activo = null;

    if (typeof usuario.activo === 'boolean') {
        activo = usuario.activo;
    } else if (usuario.activo === 1 || usuario.activo === 0) {
        activo = usuario.activo === 1;
    } else if (['ACTIVO', 'ACTIVE'].includes(estado)) {
        activo = true;
    } else if (['INACTIVO', 'INACTIVE', 'DESACTIVADO'].includes(estado)) {
        activo = false;
    }

    return {
        id: usuario.id ?? usuario.id_usuario,
        nombre: usuario.nombre || '',
        apellido: usuario.apellido || '',
        email: usuario.email || usuario.correo || '',
        run: usuario.run || '',
        region: usuario.region || '',
        comuna: usuario.comuna || '',
        direccion: usuario.direccion || '',
        rol: usuario.rol || '',
        activo
    };
}

function esMismoUsuario(usuario, usuarioActual) {
    if (!usuario || !usuarioActual) {
        return false;
    }

    const idActual = usuarioActual.id ?? usuarioActual.id_usuario;
    if (usuario.id !== undefined && idActual !== undefined && idActual !== null) {
        return String(usuario.id) === String(idActual);
    }

    const emailActual = usuarioActual.email || usuarioActual.correo;
    return Boolean(emailActual) &&
        usuario.email.toLowerCase() === String(emailActual).toLowerCase();
}

function validarDatos(datos, esPropiaCuenta) {
    const errores = {};
    const nombre = datos.nombre.trim();
    const apellido = datos.apellido.trim();
    const email = datos.email.trim();
    const direccion = datos.direccion.trim();

    if (nombre.length < 2 || nombre.length > 50 || !SOLO_LETRAS.test(nombre)) {
        errores.nombre = 'Ingresa un nombre válido de 2 a 50 caracteres.';
    }

    if (apellido.length < 2 || apellido.length > 100 || !SOLO_LETRAS.test(apellido)) {
        errores.apellido = 'Ingresa un apellido válido de 2 a 100 caracteres.';
    }

    if (email.length > 100 || !EMAIL_VALIDO.test(email)) {
        errores.email = 'Ingresa un correo electrónico válido.';
    }

    if (!validarRUNChileno(datos.run)) {
        errores.run = 'Ingresa un RUN chileno válido.';
    }

    if (!Object.hasOwn(regionesComunas, datos.region)) {
        errores.region = 'Selecciona una región.';
    }

    if (!regionesComunas[datos.region]?.includes(datos.comuna)) {
        errores.comuna = 'Selecciona una comuna válida para la región.';
    }

    if (direccion.length < 8 || direccion.length > 300) {
        errores.direccion = 'Ingresa una dirección de 8 a 300 caracteres.';
    } else if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/.test(direccion) ||
        (!/\d/.test(direccion) && !/\bs\s*\/\s*n\b/i.test(direccion))) {
        errores.direccion = 'La dirección debe incluir una calle y número o s/n.';
    }

    if (!esPropiaCuenta && !ROLES.includes(datos.rol)) {
        errores.rol = 'Selecciona un rol válido.';
    }

    return errores;
}

function crearDatosFormulario(usuario) {
    return {
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        run: usuario.run,
        region: usuario.region,
        comuna: usuario.comuna,
        direccion: usuario.direccion,
        rol: usuario.rol
    };
}

function AdminUsuarios() {
    useTituloPagina('Gestión de usuarios');

    const usuarioActual = obtenerUsuario();
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [filtroRol, setFiltroRol] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');
    const [usuarioEdicion, setUsuarioEdicion] = useState(null);
    const [datos, setDatos] = useState(null);
    const [errores, setErrores] = useState({});
    const [mostrarEdicion, setMostrarEdicion] = useState(false);
    const [cargandoDetalle, setCargandoDetalle] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [usuarioDesactivacion, setUsuarioDesactivacion] = useState(null);
    const [desactivando, setDesactivando] = useState(false);
    const [usuarioReactivacion, setUsuarioReactivacion] = useState(null);
    const [reactivando, setReactivando] = useState(false);
    const comunas = datos ? regionesComunas[datos.region] || [] : [];
    const propiaCuenta = esMismoUsuario(usuarioEdicion, usuarioActual);

    useEffect(function() {
        let activo = true;

        listarUsuarios()
            .then(function(respuesta) {
                if (activo) {
                    setUsuarios(respuesta.usuarios.map(mapearUsuario));
                }
            })
            .catch(function(errorPeticion) {
                if (activo) {
                    setError(errorPeticion.message);
                }
            })
            .finally(function() {
                if (activo) {
                    setCargando(false);
                }
            });

        return function() {
            activo = false;
        };
    }, []);

    function manejarCambio(evento) {
        const { name, value } = evento.target;
        setDatos(function(datosActuales) {
            const nuevosDatos = { ...datosActuales, [name]: value };

            if (name === 'region' && !regionesComunas[value]?.includes(datosActuales.comuna)) {
                nuevosDatos.comuna = '';
            }

            return nuevosDatos;
        });
        setErrores(function(erroresActuales) {
            const nuevosErrores = { ...erroresActuales, [name]: '' };
            if (name === 'region') {
                nuevosErrores.comuna = '';
            }
            return nuevosErrores;
        });
        setError('');
        setMensaje('');
    }

    async function abrirEdicion(usuario) {
        if (usuario.activo !== true) {
            return;
        }

        setUsuarioEdicion(usuario);
        setDatos(null);
        setErrores({});
        setError('');
        setMensaje('');
        setMostrarEdicion(true);
        setCargandoDetalle(true);

        try {
            const detalle = await obtenerPerfilUsuario(usuario.id);
            setDatos(crearDatosFormulario(mapearUsuario(detalle)));
        } catch (errorPeticion) {
            setError(errorPeticion.message);
        } finally {
            setCargandoDetalle(false);
        }
    }

    async function guardarCambios(evento) {
        evento.preventDefault();
        if (
            guardando ||
            !datos ||
            !usuarioEdicion ||
            usuarioEdicion.activo !== true
        ) {
            return;
        }

        const nuevosErrores = validarDatos(datos, propiaCuenta);
        setErrores(nuevosErrores);
        setError('');

        if (Object.keys(nuevosErrores).length > 0) {
            return;
        }

        setGuardando(true);
        try {
            const datosActualizacion = {
                nombre: datos.nombre.trim(),
                apellido: datos.apellido.trim(),
                email: datos.email.trim(),
                run: normalizarRUN(datos.run),
                region: datos.region,
                comuna: datos.comuna,
                direccion: datos.direccion.trim()
            };
            if (!propiaCuenta) {
                datosActualizacion.rol = datos.rol;
            }

            const respuesta = await actualizarUsuario(usuarioEdicion.id, datosActualizacion);
            setUsuarios(function(anteriores) {
                return anteriores.map(function(usuario) {
                    return String(usuario.id) === String(usuarioEdicion.id)
                        ? { ...usuario, ...datosActualizacion }
                        : usuario;
                });
            });
            setMostrarEdicion(false);
            setMensaje(respuesta.mensaje);
            setUsuarioEdicion(null);
        } catch (errorPeticion) {
            setError(errorPeticion.message);
        } finally {
            setGuardando(false);
        }
    }

    async function confirmarDesactivacion() {
        if (
            !usuarioDesactivacion ||
            usuarioDesactivacion.activo !== true ||
            desactivando
        ) {
            return;
        }

        if (esMismoUsuario(usuarioDesactivacion, usuarioActual)) {
            setError('No puedes desactivar tu propia cuenta de administrador.');
            setUsuarioDesactivacion(null);
            return;
        }

        setDesactivando(true);
        setError('');
        setMensaje('');
        try {
            const respuesta = await desactivarUsuario(usuarioDesactivacion.id);
            setUsuarios(function(anteriores) {
                return anteriores.map(function(usuario) {
                    return String(usuario.id) === String(usuarioDesactivacion.id)
                        ? { ...usuario, activo: false }
                        : usuario;
                });
            });
            setMensaje(respuesta.mensaje);
            setUsuarioDesactivacion(null);
        } catch (errorPeticion) {
            setError(errorPeticion.message);
        } finally {
            setDesactivando(false);
        }
    }

    async function confirmarReactivacion() {
        if (
            !usuarioReactivacion ||
            usuarioReactivacion.activo !== false ||
            reactivando
        ) {
            return;
        }

        setReactivando(true);
        setError('');
        setMensaje('');
        try {
            const respuesta = await reactivarUsuario(usuarioReactivacion.id);
            const mensajeExito = respuesta.mensaje || 'Usuario reactivado correctamente.';

            setUsuarios(function(anteriores) {
                return anteriores.map(function(usuario) {
                    return String(usuario.id) === String(usuarioReactivacion.id)
                        ? { ...usuario, activo: true }
                        : usuario;
                });
            });
            setMensaje(mensajeExito);
            setUsuarioReactivacion(null);

            try {
                const actualizacion = await listarUsuarios();
                setUsuarios(actualizacion.usuarios.map(mapearUsuario));
            } catch (errorActualizacion) {
                setError(
                    `El usuario fue reactivado, pero no se pudo actualizar la lista: ${errorActualizacion.message}`
                );
            }
        } catch (errorPeticion) {
            setError(errorPeticion.message);
        } finally {
            setReactivando(false);
        }
    }

    const usuariosFiltrados = usuarios.filter(function(usuario) {
        const consulta = busqueda.trim().toLowerCase();
        const coincideBusqueda = `${usuario.nombre} ${usuario.apellido} ${usuario.email}`
            .toLowerCase()
            .includes(consulta);
        const coincideRol = !filtroRol || usuario.rol === filtroRol;
        const coincideEstado = !filtroEstado ||
            (filtroEstado === 'activo' && usuario.activo === true) ||
            (filtroEstado === 'inactivo' && usuario.activo === false);

        return coincideBusqueda && coincideRol && coincideEstado;
    });

    return (
        <section className="py-5">
            <h1 className="fw-bold mb-3">Gestión de usuarios</h1>
            <p className="text-muted mb-4">
                Consulta y administra las cuentas registradas en Sonido Vivo.
            </p>

            {mensaje && <Alert variant="success" role="status">{mensaje}</Alert>}
            {error && !mostrarEdicion && !usuarioDesactivacion && !usuarioReactivacion && (
                <Alert variant="danger" role="alert">{error}</Alert>
            )}

            <div className="row g-3 mb-4">
                <Form.Group className="col-md-6" controlId="buscarUsuario">
                    <Form.Label>Buscar por nombre o correo</Form.Label>
                    <Form.Control
                        aria-label="Buscar por nombre o correo"
                        value={busqueda}
                        onChange={(evento) => setBusqueda(evento.target.value)}
                    />
                </Form.Group>
                <Form.Group className="col-md-3" controlId="filtrarRol">
                    <Form.Label>Filtrar por rol</Form.Label>
                    <Form.Select
                        aria-label="Filtrar por rol"
                        value={filtroRol}
                        onChange={(evento) => setFiltroRol(evento.target.value)}
                    >
                        <option value="">Todos los roles</option>
                        {ROLES.map((rol) => <option key={rol} value={rol}>{rol}</option>)}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="col-md-3" controlId="filtrarEstado">
                    <Form.Label>Filtrar por estado</Form.Label>
                    <Form.Select
                        aria-label="Filtrar por estado"
                        value={filtroEstado}
                        onChange={(evento) => setFiltroEstado(evento.target.value)}
                    >
                        <option value="">Todos los estados</option>
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                    </Form.Select>
                </Form.Group>
            </div>

            {cargando ? (
                <div className="d-flex align-items-center gap-2 py-4" role="status">
                    <Spinner animation="border" size="sm" />
                    <span>Cargando usuarios...</span>
                </div>
            ) : error && usuarios.length === 0 ? null : usuariosFiltrados.length === 0 ? (
                <Alert variant="info">
                    {usuarios.length === 0
                        ? 'No hay usuarios registrados.'
                        : 'No se encontraron usuarios con esos filtros.'}
                </Alert>
            ) : (
                <TablaUsuarios
                    usuarios={usuariosFiltrados}
                    esUsuarioActual={(usuario) => esMismoUsuario(usuario, usuarioActual)}
                    onEditar={abrirEdicion}
                    onDesactivar={(usuario) => {
                        if (usuario.activo === true && !esMismoUsuario(usuario, usuarioActual)) {
                            setError('');
                            setMensaje('');
                            setUsuarioDesactivacion(usuario);
                        }
                    }}
                    onReactivar={(usuario) => {
                        if (usuario.activo === false) {
                            setError('');
                            setMensaje('');
                            setUsuarioReactivacion(usuario);
                        }
                    }}
                />
            )}

            <FormularioEdicionUsuario
                mostrar={mostrarEdicion}
                datos={datos}
                errores={errores}
                opcionesRegiones={opcionesRegiones}
                comunas={comunas}
                roles={ROLES}
                esPropiaCuenta={propiaCuenta}
                cargandoDetalle={cargandoDetalle}
                guardando={guardando}
                error={error}
                onCambio={manejarCambio}
                onGuardar={guardarCambios}
                onCancelar={() => !guardando && setMostrarEdicion(false)}
            />
            <ModalConfirmarDesactivacion
                usuario={usuarioDesactivacion}
                accion="desactivar"
                procesando={desactivando}
                error={error}
                onCancelar={() => !desactivando && setUsuarioDesactivacion(null)}
                onConfirmar={confirmarDesactivacion}
            />
            <ModalConfirmarDesactivacion
                usuario={usuarioReactivacion}
                accion="reactivar"
                procesando={reactivando}
                error={error}
                onCancelar={() => !reactivando && setUsuarioReactivacion(null)}
                onConfirmar={confirmarReactivacion}
            />
        </section>
    );
}

export default AdminUsuarios;
