import { useState, useContext } from "react";
import api from "../api/jobconnect.api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { cargarUsuario } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            // Obtener los tokens
            const response = await api.post("/login/", {
                username,
                password,
            });

            const { access, refresh } = response.data;
            localStorage.setItem("access", access);
            localStorage.setItem("refresh", refresh);

            await cargarUsuario(); // 👈 Esto actualiza el Navbar

            // Obtener datos del usuario autenticado
            const userRes = await api.get("/perfil-usuario/");
            const rol = userRes.data.usuario.rol;

            if (rol === "candidato") {
                navigate("/candidato");
            } else if (rol === "reclutador") {
                navigate("/reclutador");
            } else {
                setError("Rol no válido.");
            }
        } catch (err) {
            setError("Credenciales inválidas o usuario no activo.");
            console.error(err.response?.data);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <div style={{ width: "100%", maxWidth: "400px", padding: "2rem", border: "1px solid #ccc", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
                <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Iniciar sesión</h2>
        
                {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
        
                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <input
                        type="text"
                        placeholder="Usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ padding: "0.5rem", fontSize: "1rem" }}
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ padding: "0.5rem", fontSize: "1rem" }}
                    />
                    <button
                        type="submit"
                        disabled={!username || !password || loading}
                        style={{
                        padding: "0.5rem",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: loading ? "not-allowed" : "pointer",
                        opacity: loading ? 0.6 : 1,
                        }}
                    >
                        {loading ? "Ingresando..." : "Ingresar"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
