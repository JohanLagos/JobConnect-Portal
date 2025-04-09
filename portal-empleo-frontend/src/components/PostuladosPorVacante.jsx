import { useEffect, useState } from "react";
import api from "../api/jobconnect.api";

function PostuladosPorVacante({ vacanteId }) {
    const [postulados, setPostulados] = useState([]);
    const [perfilAbierto, setPerfilAbierto] = useState(null);

    const verPerfil = (id) => {
        setPerfilAbierto(perfilAbierto === id ? null : id);
    };

    const fetchPostulados = async () => {
        try {
        const res = await api.get(`/postulaciones-por-vacante/?vacante=${vacanteId}`);
        setPostulados(res.data);
        } catch (err) {
        console.error("Error al obtener postulados", err);
        }
    };

    useEffect(() => {
        fetchPostulados();
    }, [vacanteId]);

    const cambiarEstado = async (id, nuevoEstado) => {
        try {
            await api.patch(`/postulaciones/${id}/`, { estado: nuevoEstado });
            fetchPostulados(); // Refresca la lista
        } catch (err) {
            console.error("Error al cambiar estado", err);
        }
    };

    if (postulados.length === 0) return <p>No hay postulados para esta vacante.</p>;

    return (
        <ul>
            {postulados.map((p) => (
                <li key={p.id} style={{ marginBottom: "1.5rem" }}>
                <strong>{p.nombre} {p.apellido}</strong> — Estado:{" "}
                <select value={p.estado} onChange={(e) => cambiarEstado(p.id, e.target.value)}>
                    <option value="en revision">En revisión</option>
                    <option value="descartado">Descartado</option>
                    <option value="seleccionado">Seleccionado</option>
                </select>
                <br />
                <button onClick={() => verPerfil(p.id)}>
                    {perfilAbierto === p.id ? "Ocultar perfil" : "Ver perfil"}
                </button>

                {perfilAbierto === p.id && (
                    <div style={{ marginTop: "0.5rem", padding: "0.5rem", background: "#f2f2f2" }}>
                        <p><strong>Teléfono:</strong> {p.perfil_candidato?.telefono}</p>
                        <p><strong>Ciudad:</strong> {p.perfil_candidato?.ciudad}</p>
                        <p><strong>Formación:</strong> {p.perfil_candidato?.formacion}</p>
                        <p><strong>Experiencia:</strong> {p.perfil_candidato?.experiencia}</p>
                        <p><strong>Habilidades:</strong> {p.perfil_candidato?.habilidades}</p>
                    </div>
                )}
                </li>
            ))}
        </ul>
    );
}

export default PostuladosPorVacante;
