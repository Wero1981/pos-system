import React, { useState } from 'react';
// import axios from 'axios';


function LoginForm ({onLogin }){
    
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const procesarDatos = e => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }))
    }

    const hadleSubmit = (e) =>{
        e.preventDefault();
        console.log('Enviando credenciales', formData.username, formData.password);
        
    }

    return(
        <div className='container mt-5'>
            <h2>Iniciar sesión</h2>
            <form onSubmit={hadleSubmit}>
                <div className='mb-3'>
                    <label>Usuario</label>
                    <input 
                        type="text" 
                        className='form-control'
                        name="username"
                        value={formData.username}
                        onChange={procesarDatos}
                        />
                </div>
                <div className='mb-3'>
                    <label>Contraseña</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        name="password"
                        value={formData.password}
                        onChange={procesarDatos}
                        />
                </div>
                <button className='btn btn-primary' type="submit">Entrar</button>
            </form>
        </div>
    )
}

export default LoginForm;