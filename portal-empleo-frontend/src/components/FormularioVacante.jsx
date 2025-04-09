import { useState } from "react";
import api from "../api/jobconnect.api";

function FormularioVacante({ onVacanteCreada }) {
    const [formData, setFormData] = useState({
        titulo: "",
        descripcion: "",
        requisitos: "",
        ubicacion: "",
        tipo_contrato: "",
    });

    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMensaje("");

        try {
            const res = await api.post("/vacantes/", formData);
            // Solo mostrar mensaje si fue exitoso
            if (res.status === 201 || res.status === 200) {
                setMensaje("Vacante publicada con éxito");
                setFormData({
                    titulo: "",
                    descripcion: "",
                    requisitos: "",
                    ubicacion: "",
                    tipo_contrato: "",
                });

                if (onVacanteCreada) onVacanteCreada(res.data);
            }
        } catch (err) {
            console.error("Error al crear vacante:", err);
            setError("No se pudo publicar la vacante.");
        }
    };

    return (
        <div>
        <h3>Publicar nueva vacante</h3>

        {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
            <input type="text" name="titulo" placeholder="Título" value={formData.titulo} onChange={handleChange} required />
            <br />
            <textarea name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleChange} required />
            <br />
            <textarea name="requisitos" placeholder="Requisitos" value={formData.requisitos} onChange={handleChange} required />
            <br />
            <input type="text" name="ubicacion" placeholder="Ubicación" value={formData.ubicacion} onChange={handleChange} />
            <br />
            <input type="text" name="tipo_contrato" placeholder="Tipo de contrato" value={formData.tipo_contrato} onChange={handleChange} />
            <br />
            <button type="submit">Publicar vacante</button>
        </form>
        </div>
    );
}

export default FormularioVacante;
