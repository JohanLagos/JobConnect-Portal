import PostuladosPorVacante from "./PostuladosPorVacante";
import { useState } from "react";
import api from "../api/jobconnect.api";

function MisVacantes({ vacantes, onActualizar, expandida, setExpandida }) {
    const [modoEdicion, setModoEdicion] = useState(null);
    const [formEdit, setFormEdit] = useState({});

    const handleEliminar = async (id) => {
        const confirmar = confirm("¿Seguro que deseas eliminar esta vacante?");
        if (!confirmar) return;

        try {
            await api.delete(`/vacantes/${id}/`);
            onActualizar(); // ← Actualiza desde el padre
        } catch (err) {
            console.error("Error al eliminar", err);
        }
    };

    const iniciarEdicion = (vacante) => {
        setModoEdicion(vacante.id);
        setFormEdit(vacante);
    };

    const handleEditChange = (e) => {
        setFormEdit(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const guardarCambios = async () => {
        try {
            await api.put(`/vacantes/${modoEdicion}/`, formEdit);
            setModoEdicion(null);
            onActualizar(); // ← Actualiza desde el padre
        } catch (err) {
            console.error("Error al editar", err);
        }
    };

    return (
        <div>
            <h3>Mis Vacantes Publicadas</h3>
            {vacantes.length === 0 ? (
                <p>No has publicado ninguna vacante todavía.</p>
            ) : (
                <ul>
                    {vacantes.map((vacante) => (
                        <li key={vacante.id} style={{ marginBottom: "1rem" }}>
                            {modoEdicion === vacante.id ? (
                                <>
                                    <input
                                        type="text"
                                        name="titulo"
                                        value={formEdit.titulo}
                                        onChange={handleEditChange}
                                    />
                                    <br />
                                    <textarea
                                        name="descripcion"
                                        value={formEdit.descripcion}
                                        onChange={handleEditChange}
                                    />
                                    <br />
                                    <textarea
                                        name="requisitos"
                                        value={formEdit.requisitos}
                                        onChange={handleEditChange}
                                    />
                                    <br />
                                    <input
                                        type="text"
                                        name="ubicacion"
                                        value={formEdit.ubicacion}
                                        onChange={handleEditChange}
                                    />
                                    <br />
                                    <input
                                        type="text"
                                        name="tipo_contrato"
                                        value={formEdit.tipo_contrato}
                                        onChange={handleEditChange}
                                    />
                                    <br />
                                    <button onClick={guardarCambios}>Guardar</button>
                                    <button onClick={() => setModoEdicion(null)} style={{ marginLeft: "0.5rem" }}>
                                        Cancelar
                                    </button>
                                </>
                            ) : (
                                <>
                                    <strong>{vacante.titulo}</strong> - {vacante.ubicacion} <br />
                                    <em>{vacante.tipo_contrato}</em>
                                    <br />
                                    <button onClick={() => iniciarEdicion(vacante)}>Editar</button>
                                    <button onClick={() => handleEliminar(vacante.id)} style={{ marginLeft: "0.5rem" }}>
                                        Eliminar
                                    </button>
                                    <button onClick={() => setExpandida(expandida === vacante.id ? null : vacante.id)}>
                                        {expandida === vacante.id ? "Ocultar postulados" : "Ver postulados"}
                                    </button>

                                    {expandida === vacante.id && (
                                        <div style={{ marginTop: "1rem", paddingLeft: "1rem", borderLeft: "2px solid #ccc" }}>
                                            <PostuladosPorVacante vacanteId={vacante.id} />
                                        </div>
                                    )}
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default MisVacantes;
