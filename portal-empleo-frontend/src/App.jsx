import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardCandidato from "./pages/DashboardCandidato";
import DashboardReclutador from "./pages/DashboardReclutador";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import RutaProtegida from "./components/RutaProtegida";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Ruta protegida para candidatos */}
        <Route path="/candidato" element={
          <RutaProtegida rolRequerido="candidato">
              <DashboardCandidato />
          </RutaProtegida>} />

        {/* Ruta protegida para reclutadores */}
        <Route path="/reclutador" element={
          <RutaProtegida rolRequerido="reclutador">
              <DashboardReclutador />
          </RutaProtegida>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
