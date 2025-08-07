import React, { useState } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";

function ProductSearch({ onSearch }) {
    const [query, setQuery] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <Form onSubmit={handleSearch} className="mb-3">
            <InputGroup>
                <Form.Control
                    type="text"
                    placeholder="Buscar productos..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Button type="submit" variant="outline-primary">Buscar</Button>
            </InputGroup>
        </Form>
    );
}

export default ProductSearch;
