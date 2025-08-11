import React, { useState, useEffect } from 'react';
import LoginForm from './components/Auth/Login';
import Register from './components/Auth/Register';
import PuntoVenta from './components/POS/PuntoVenta';
import ConfiguracionEmpresaModal from './components/POS/ConfiguracionEmpresaModal';
import {Route, Routes, Navigate, useNavigate} from 'react-router-dom';

function App (){
  const [autenticado, setAutenticado] = useState(false);
  const [empresaConfigurada, setEmpresaConfigurada] = useState(false);
  const navigate = useNavigate();

  useEffect (() => {
    const token = localStorage.getItem('access');
    if(token) setAutenticado(true)
  }, []);

  useEffect (() => {
    if(autenticado){
      verificarConfiguracionEmpresa();
      navigate('/pos');
    }
  }, [autenticado, navigate]);

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

  const onConfiguracionComplete = () => {
    setEmpresaConfigurada(true);
    navigate('/pos');
  };


  const onRegisterSuccess = () => {
    navigate('/login');
  };
    return (

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
          element={<Register onRegisterSuccess={ onRegisterSuccess } />}
        />
        <Route
          path="/pos"
          element={
            autenticado ? (
              empresaConfigurada ? (
                <PuntoVenta />
              ) : (
                <ConfiguracionEmpresaModal onConfiguracionComplete={onConfiguracionComplete} />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
  
  );

}


export default App;
