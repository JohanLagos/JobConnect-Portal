import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function RutaProtegida({ children, rolRequerido = null }) {
    const { usuario, loading } = useContext(AuthContext);

    if (loading) return <p>Cargando...</p>; // 👈 mientras se valida

    if (!usuario) {
        return <Navigate to="/login" />;
    }

    if (rolRequerido && usuario.rol !== rolRequerido) {
        return <Navigate to="/" />;
    }

    return children;
}

export default RutaProtegida;
