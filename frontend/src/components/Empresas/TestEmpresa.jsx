import React, {use, useEffec, useEffect, useState} from "react";
import axios from "axios";
import { Container, Table, Alert } from "react-bootstrap";

const TestEmpresa = () => {
    const [empresas, setEmpresas] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No estás autenticado. Por favor, inicia sesión.');
            return;
        }

        axios.get('http://localhost:8000/empresas/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((res) => setEmpresas(res.data))
        .catch(() => setError('Error al cargar las empresas.'));
    }, []);

    return (
        <Container className="mt-5">
            <h3>Empresa</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>RFC</th>
                        <th>Teléfono</th>
                        <th>Correo Electrónico</th>
                        <th>Dirección</th>
                    </tr>
                </thead>
                <tbody>
                    {empresas.map((empresa) => (
                        <tr key={empresa.id}>
                            <td>{empresa.id}</td>
                            <td>{empresa.nombre}</td>
                            <td>{empresa.rfc}</td>
                            <td>{empresa.telefono}</td>
                            <td>{empresa.correo_electronico}</td>
                            <td>{empresa.direccion}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default TestEmpresa;

            