import React, { useState, useEffect } from 'react';
import LoginForm from './components/Auth/Login';
import Register from './components/Auth/Register';
import PuntoVenta from './components/POS/PuntoVenta';
import ConfiguracionEmpresaModal from './components/POS/ConfiguracionEmpresaModal';
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';

function App (){
  const [autenticado, setAutenticado] = useState(false);
  const [empresaConfigurada, setEmpresaConfigurada] = useState(false);

  useEffect (() => {
    const token = localStorage.getItem('access');
    if(token) setAutenticado(true)
  }, []);

  useEffect (() => {
    if(autenticado){
      verificarConfiguracionEmpresa();
    }
  }, [autenticado])

  const verificarConfiguracionEmpresa = async () => {
    try {
      //todo: Implementar la lógica para verificar si la empresa está configurada
      const configurada = false; // Simulación de verificación
      setEmpresaConfigurada(configurada);
    } catch (error) {
      console.error('Error al verificar la configuración de la empresa:', error);
      setEmpresaConfigurada(false);
    }
  };
    return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={autenticado ? <Navigate to="/pos" /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={<LoginForm onLogin={() => setAutenticado(true)} />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/pos"
          element={
            autenticado ? (
              empresaConfigurada ? (
                <PuntoVenta />
              ) : (
                <ConfiguracionEmpresaModal />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );

}


export default App;
