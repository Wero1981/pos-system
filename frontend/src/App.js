import React, { useState, useEffect } from 'react';
import LoginForm from './components/Auth/Login';
import Register from './components/Auth/Register';
import PuntoVenta from './components/POS/PuntoVenta';
import Ventas from './components/Ventas/Ventas';
import Inventario from './components/Inventario/Inventario';
import Reportes from './components/Contabilidad/Reportes';
import Configuraciones from './components/Configuraciones/Configuraciones';
import ConfiguracionEmpresaModal from './components/POS/ConfiguracionEmpresaModal';
import { Route, Routes, Navigate, useNavigate, useLocation} from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';

function App (){
  const [autenticado, setAutenticado] = useState(false);
  //const [empresaConfigurada, setEmpresaConfigurada] = useState(false);
  const [dataEmpresa, setDataEmpresa] = useState({
    nombre: '',
    tipo_empresa: '',
    configurada: false,
    id: null
  });
  const [sucursales, setSucursales] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const onConfiguracionComplete = (empresa_configurada, empresa, sucursales) => {
    setDataEmpresa(prevData => ({
      ...prevData,
      configurada: empresa_configurada,
      ...empresa,
    }));
    setSucursales(sucursales);
    console.log("[DEBUG] Empresa configurada:", empresa_configurada);
    console.log("[DEBUG] Sucursales:", sucursales);
    setAutenticado(true);
    navigate('/pos');
  };
  const onConfiguracionCancelada = () => {
    setDataEmpresa({
      nombre: '',
      tipo_empresa: '',
      configurada: false,
      id: null
    });
    setAutenticado(false);
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  }


  const onRegisterSuccess = (empresaConfigurada) => {
    setDataEmpresa(prevData => ({
      ...prevData,
      configurada: empresaConfigurada
    }));
    setAutenticado(true);
    console.log("[DEBUG] Empresa configurada:", empresaConfigurada);
    navigate('/pos');
  };

  const onLogin = (empresa_configurada, empresa, sucursales) => {
    setAutenticado(true);
    setDataEmpresa(prevData => ({
      ...prevData,
      configurada: empresa_configurada,
      ...empresa,
    }));
    if(sucursales && sucursales.length > 0){
      setSucursales(sucursales);
    }
    console.log("[DEBUG] Empresa configurada:", empresa_configurada);
    console.log("[DEBUG] Sucursales:", sucursales);
  }
  /***
   * UsesEfect
   */
  //Validar token inicial (existencia y expiracion)
  useEffect (() => {
    const token = localStorage.getItem('access');
    if(token){
      try {
        const decoded = jwtDecode(token);
        const ahora = Date.now() / 1000; // Tiempo actual en segundos
        if (decoded.exp && decoded.exp > ahora) {
          setAutenticado(true);
        }else{
          setAutenticado(false);
          setDataEmpresa({
            nombre: '',
            tipo_empresa: '',
            configurada: false,
            id: null,
            sucursal_id: null
          });
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
        }

      } catch (error) {
        console.error('Error al decodificar el token:', error);
        setAutenticado(false);
        setDataEmpresa({
          nombre: '',
          tipo_empresa: '',
          configurada: false,
          id: null
        });
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
      }
    }else {
      console.log("[DEBUG] No se encontró token, redirigiendo a login");
      setAutenticado(false);
      setDataEmpresa({
        nombre: '',
        tipo_empresa: '',
        configurada: false,
        id: null
      });
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
    }
  }, []);

  useEffect (() => {
    if(autenticado){
      //console.log("[DEBUG] Usuario autenticado, verificando configuración de empresa...");
      if(dataEmpresa.configurada){
      }
      if(location.pathname === '/login' || location.pathname === '/register'){
        navigate('/pos');
      }     
    }
    else if(location.pathname !== '/register' && location.pathname !== '/login'){
      navigate('/login');
    }

  }, [autenticado, navigate, location, dataEmpresa]);

  //Interceptor de axios
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => {
       // console.log("INTERCEPTOR AXIOS", response);
        return response;
      },
      error => {
        if (error.response && error.response.status === 401) {
          // Manejar el error 401 (no autorizado)
          setAutenticado(false);
          setDataEmpresa({
            nombre: '',
            tipo_empresa: '',
            configurada: false,
            id: null
          });
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          if(location.pathname !== '/login' && location.pathname !== '/register'){
            navigate('/login');
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate, location]);

    return (

      <Routes>
        <Route
          path="/"
          element={autenticado ? <Navigate to="/pos" /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={<LoginForm onLogin={ onLogin } />}
        />
        <Route
          path="/register"
          element={<Register onRegisterSuccess={ onRegisterSuccess } />}
        />
        <Route
          path="/pos"
          element={
            autenticado ? (
              dataEmpresa.configurada ? (
                <PuntoVenta  dataEmpresa={dataEmpresa} />
              ) : (
                <ConfiguracionEmpresaModal 
                  onConfiguracionComplete={onConfiguracionComplete} 
                  onConfiguracionCancelada={onConfiguracionCancelada} 
                />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route path="ventas" element={<Ventas />} />
          <Route path="inventario" element={<Inventario />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="configuraciones" element={<Configuraciones />} />
          {/*opcional: ruta por defecto */}
          <Route index element={<Ventas />} />
        </Route>
        <Route
          path="*"
          element={<Navigate to={autenticado ? "/pos" : "/login"} />}
        />
      </Routes>
  
  );

}


export default App;
