import React, { useState } from 'react';
import { Form, Button, Alert, Container} from 'react-bootstrap';
import axios from 'axios';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const Login = () => {
    const [form, setForm] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const history = useHistory();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://127.0.0.1:8000/user/token/', form);
            localStorage.setItem('token', response.data.access);
            console.log('Token:', response.data.access);
            history.push('/'); // Redirect to home page after successful login
        } catch (err) {
            setError('Usuario o contraseña incorrectos');

        }
    };  

    return (
        <Container className="mt-5" style={{ maxWidth: '400px' }}>
            <h2 className="text-center mb-4">Iniciar Sesión</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username">
                    <Form.Label>Usuario</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ingrese su usuario"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Ingrese su contraseña"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 mt-3">
                    Iniciar Sesión
                </Button>
            </Form>
        </Container>
    );
};

export default Login;