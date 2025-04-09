import { useState } from "react";
import api from "../api/jobconnect.api";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
    const [rol, setRol] = useState("");
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        telefono: "",
        ciudad: "",
        experiencia: "",
        formacion: "",
        habilidades: "",
        empresa: "",
        cargo: "",
        sitio_web: ""
    });

    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const payload = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            first_name: formData.first_name,
            last_name: formData.last_name,
            rol: rol
        };

        if (rol === "candidato") {
            payload.perfil_candidato = {
                telefono: formData.telefono,
                ciudad: formData.ciudad,
                experiencia: formData.experiencia,
                formacion: formData.formacion,
                habilidades: formData.habilidades,
            };
        } else if (rol === "reclutador") {
            payload.perfil_reclutador = {
                telefono: formData.telefono,
                empresa: formData.empresa,
                cargo: formData.cargo,
                sitio_web: formData.sitio_web,
            };
        }

        try {
            await api.post("registro/", payload);
            alert("Registro exitoso. Ahora puedes iniciar sesión.");
            navigate("/login");
        } catch (err) {
            setError("Ocurrió un error al registrarse.");
            console.error(err.response?.data);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "2rem" }}>
            <div style={{ width: "100%", maxWidth: "600px", padding: "2rem", border: "1px solid #ccc", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
                <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Registro</h2>
        
                {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
        
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <input type="text" name="username" placeholder="Usuario" onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Correo electrónico" onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />
                    <input type="text" name="first_name" placeholder="Nombre" onChange={handleChange} required />
                    <input type="text" name="last_name" placeholder="Apellido" onChange={handleChange} required />
            
                    <select value={rol} onChange={(e) => setRol(e.target.value)} required>
                        <option value="">Selecciona tu rol</option>
                        <option value="candidato">Candidato</option>
                        <option value="reclutador">Reclutador</option>
                    </select>
            
                    <input type="text" name="telefono" placeholder="Teléfono" onChange={handleChange} required />
            
                    {rol === "candidato" && (
                        <>
                        <h4>Datos como Candidato</h4>
                        <input type="text" name="ciudad" placeholder="Ciudad" onChange={handleChange} required />
                        <textarea name="experiencia" placeholder="Experiencia laboral" onChange={handleChange}></textarea>
                        <textarea name="formacion" placeholder="Formación académica" onChange={handleChange}></textarea>
                        <textarea name="habilidades" placeholder="Habilidades" onChange={handleChange}></textarea>
                        </>
                    )}
            
                    {rol === "reclutador" && (
                        <>
                        <h4>Datos como Reclutador</h4>
                        <input type="text" name="empresa" placeholder="Empresa" onChange={handleChange} required />
                        <input type="text" name="cargo" placeholder="Cargo" onChange={handleChange} required />
                        <input type="url" name="sitio_web" placeholder="Sitio web (opcional)" onChange={handleChange} />
                        </>
                    )}
            
                    <button
                        type="submit"
                        style={{
                        padding: "0.5rem",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "1rem",
                        cursor: "pointer",
                        }}
                    >
                        Registrarse
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;
