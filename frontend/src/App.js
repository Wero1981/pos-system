import React, { useState, useEffect } from 'react';
import LoginForm from './components/Auth/Login';
import PuntoVenta from './components/POS/PuntoVenta';
import ConfiguracionEmpresaModal from './components/POS/ConfiguracionEmpresaModal';

function App (){
  const [autenticado, setAutenticado] = useState(false);
  const [empresaConfigurada, setEmpresaConfigurada] = useState(false);

  useEffect (() => {
    const token = localStorage.getItem('acces');
    if(token) setAutenticado(true)
  }, []);

  const verificarConfiguracionEmpresa = async () =>{
    const configurada = true;
    setEmpresaConfigurada(configurada)
  }

  useEffect (() => {
    if(autenticado){
      verificarConfiguracionEmpresa();
    }
  }, [autenticado])

  if(!autenticado){
     return (
      <div>
        <LoginForm></LoginForm>
      </div>
    );

  }
   return (
      <>
        {/* Necesitas crear estos componentes o simularlos */}
        <PuntoVenta />
        {!empresaConfigurada && <ConfiguracionEmpresaModal />}
      </>
    );

}


export default App;
