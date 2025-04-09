import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const { usuario, cerrarSesion } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        cerrarSesion();
        navigate("/login");
    };

    return (
        <nav style={{ display: "flex", justifyContent: "space-between", padding: "1rem", background: "#eee" }}>
            <Link to={"/"}>Portal de Empleo</Link>

            {!usuario && (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/registro">Registro</Link>
                </>
            )}

            {usuario?.rol === "reclutador" && (
                <Link to="/reclutador">Panel Reclutador</Link>
            )}

            {usuario?.rol === "candidato" && (
                <Link to="/candidato">Panel Candidato</Link>
            )}

            {usuario && (
                <>
                    <span>Hola, {usuario.first_name} ({usuario.rol})</span>
                    <button onClick={handleLogout}>Cerrar sesión</button>
                </>
            )}
        </nav>
    );
}

export default Navbar;
