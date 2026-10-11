import {
    createContext,
    useContext,
    useEffect,
    useState
} from 'react';

import { useCatalogo } from './CatalogoContext';

const CarritoContext = createContext(null);

const CLAVE = 'sonido_vivo_carrito';

export function CarritoProvider({ children }) {
    const { productos } = useCatalogo();

    const [carrito, setCarrito] = useState(() => {
        try {
            const guardado = JSON.parse(
                localStorage.getItem(CLAVE) || '[]'
            );

            return Array.isArray(guardado) ? guardado : [];
        } catch {
            return [];
        }
    });

    // Guardar el carrito cada vez que cambie
    useEffect(() => {
        localStorage.setItem(CLAVE, JSON.stringify(carrito));
    }, [carrito]);

    // Agregar un producto al carrito
    function agregarAlCarrito(producto) {
        if (!producto || Number(producto.stock) <= 0) {
            return;
        }

        setCarrito(actual => {
            const existente = actual.find(
                item => item.id === producto.id
            );

            if (existente) {
                return actual.map(item =>
                    item.id === producto.id
                        ? {
                            ...item,
                            cantidad: Math.min(
                                item.cantidad + 1,
                                Number(producto.stock)
                            )
                        }
                        : item
                );
            }

            return [
                ...actual,
                { id: producto.id, cantidad: 1 }
            ];
        });
    }

    // Quitar un producto
    function eliminarDelCarrito(id) {
        setCarrito(actual =>
            actual.filter(item => item.id !== Number(id))
        );
    }

    // Cambiar la cantidad
    function actualizarCantidad(id, cantidad) {
        const producto = productos.find(
            p => p.id === Number(id)
        );

        if (!producto) return;

        const nuevaCantidad = Math.max(
            0,
            Math.min(
                Number(cantidad) || 0,
                Number(producto.stock)
            )
        );

        setCarrito(actual =>
            nuevaCantidad === 0
                ? actual.filter(item => item.id !== Number(id))
                : actual.map(item =>
                    item.id === Number(id)
                        ? { ...item, cantidad: nuevaCantidad }
                        : item
                )
        );
    }

    // Vaciar carrito
    function vaciarCarrito() {
        setCarrito([]);
    }

    // Obtener información actualizada del catálogo
    const productosCarrito = carrito
        .map(item => {
            const producto = productos.find(
                p => p.id === item.id
            );

            if (!producto || Number(producto.stock) <= 0) {
                return null;
            }

            return {
                ...producto,
                cantidad: Math.min(
                    item.cantidad,
                    Number(producto.stock)
                )
            };
        })
        .filter(Boolean);

    const total = productosCarrito.reduce(
        (suma, producto) =>
            suma + producto.precio * producto.cantidad,
        0
    );

    const cantidadTotal = productosCarrito.reduce(
        (suma, producto) => suma + producto.cantidad,
        0
    );

    return (
        <CarritoContext.Provider
            value={{
                carrito: productosCarrito,
                agregarAlCarrito,
                eliminarDelCarrito,
                actualizarCantidad,
                vaciarCarrito,
                total,
                cantidadTotal
            }}
        >
            {children}
        </CarritoContext.Provider>
    );
}

export function useCarrito() {
    const contexto = useContext(CarritoContext);

    if (!contexto) {
        throw new Error(
            'useCarrito debe usarse dentro de CarritoProvider'
        );
    }

    return contexto;
}
