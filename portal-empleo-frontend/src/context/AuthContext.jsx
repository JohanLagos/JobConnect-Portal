import { createContext, useEffect, useState } from "react";
import api from "../api/jobconnect.api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    const cargarUsuario = async () => {
        try {
        const res = await api.get("/perfil-usuario/");
        setUsuario(res.data.usuario);
        } catch (error) {
        setUsuario(null);
        }finally {
            setLoading(false); // 👈 importante: termina carga
        }
    };

    const cerrarSesion = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setUsuario(null);
    };

    useEffect(() => {
        const token = localStorage.getItem("access");
        if (token) {
            cargarUsuario();
        }else {
            setLoading(false); // 👈 si no hay token, tampoco esperamos
        }
    }, []);

    return (
        <AuthContext.Provider value={{ usuario, setUsuario, cerrarSesion, cargarUsuario, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
