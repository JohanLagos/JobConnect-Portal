import { useState, useEffect } from "react";
import api from "../api/jobconnect.api";
import FormularioVacante from "../components/FormularioVacante";
import MisVacantes from "../components/MisVacantes";
import PostuladosPorVacante from "../components/PostuladosPorVacante";

function DashboardReclutador() {
    const [vacantes, setVacantes] = useState([]);
    const [expandida, setExpandida] = useState(null);

    const fetchVacantes = async () => {
        try {
            const res = await api.get("/vacantes/");
            setVacantes(res.data);
        } catch (err) {
            console.error("Error al cargar vacantes", err);
        }
    };
    
    useEffect(() => {
        fetchVacantes();
    }, []);

    return (
        <div>
            <h2>Panel del Reclutador</h2>
            {/* Formulario para publicar nueva vacante */}
            <FormularioVacante onVacanteCreada={fetchVacantes} />
            <hr />

            {/* Lista de vacantes del reclutador */}
            <h3>Mis Vacantes</h3>
            <MisVacantes 
                vacantes={vacantes}
                onActualizar={fetchVacantes}
                expandida={expandida}
                setExpandida={setExpandida}
            />

            {/* Mostrar postulados si hay vacante expandida */}
            {expandida && (
                <div style={{ marginTop: "1rem", paddingLeft: "1rem", borderLeft: "2px solid #ccc" }}>
                    <PostuladosPorVacante vacanteId={expandida} />
                </div>
            )}
        </div>
    );
}

export default DashboardReclutador;  