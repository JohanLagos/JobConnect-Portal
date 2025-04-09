import { useEffect, useState } from "react";
import api from "../api/jobconnect.api";

function DashboardCandidato() {
    const [vacantes, setVacantes] = useState([]);
    const [postulaciones, setPostulaciones] = useState([]);
    const [mensaje, setMensaje] = useState("");

    const getVacantes = async () => {
        try {
            const res = await api.get("/vacantes/");
            setVacantes(res.data);
        } catch (err) {
            console.error("Error al cargar vacantes", err);
        }
    };

    const getPostulaciones = async () => {
        try {
            const res = await api.get("/mis-postulaciones/");
            setPostulaciones(res.data);
        } catch (err) {
            console.error("Error al cargar tus postulaciones", err);
        }
    };

    const cancelarPostulacion = async (id) => {
        const confirmar = confirm("¿Seguro que deseas cancelar esta postulación?");
        if (!confirmar) return;
    
        try {
            await api.delete(`/postulaciones/${id}/`);
            setMensaje("Postulación cancelada correctamente.");
            getPostulaciones();
        } catch (err) {
            console.error("Error al cancelar la postulación", err);
            setMensaje("No se pudo cancelar la postulación.");
        }
    };    

    useEffect(() => {
        getVacantes();
        getPostulaciones();
    }, []);

    const postularse = async (id) => {
        try {
            await api.post("/postulaciones/", { vacante: id });
            setMensaje("Te has postulado correctamente.");
            getVacantes();
            getPostulaciones();
        } catch (err) {
            setMensaje(err.response?.data?.non_field_errors?.[0] || "Ya estás postulado.");
        }
    };

    return (
        <div>
            <h2>Vacantes Disponibles</h2>
            {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}

            {vacantes.length === 0 ? (
                <p>No hay vacantes disponibles.</p>
            ) : (
                <ul>
                    {vacantes.map((v) => (
                        <li key={v.id} style={{ marginBottom: "1rem" }}>
                            <strong>{v.titulo}</strong> - {v.ubicacion} <br />
                            {v.descripcion} <br />
                            <button onClick={() => postularse(v.id)}>Postularme</button>
                        </li>
                    ))}
                </ul>
            )}

            <hr />

            <h2>Mis Postulaciones</h2>
            {postulaciones.length === 0 ? (
                <p>No te has postulado a ninguna vacante aún.</p>
            ) : (
                <ul>
                    {postulaciones.map((p) => (
                        <li key={p.id} style={{ marginBottom: "1rem" }}>
                            <strong>{p.vacante?.titulo}</strong> — {p.vacante.ubicacion}
                            <br />
                            <em>Estado:</em> <strong>{p.estado}</strong>
                            <br />
                            <small>Postulado el: {new Date(p.fecha_postulacion).toLocaleDateString()}</small>
                            <br />
                            <button onClick={() => cancelarPostulacion(p.id)} style={{ color: "red" }}>Cancelar Postulación</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default DashboardCandidato;
