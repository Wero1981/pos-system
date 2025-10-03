import React, { useState } from "react";
import { ListGroup, Button } from "react-bootstrap"; // ✅ CORREGIR: react-bootstrap no reactstrap
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faFolder, faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const CategoriaItem = ({ 
    categoria, 
    categoriaFilter, 
    onCategoriaSelect, 
    loadingCategoria, // ✅ CORREGIR: nombre correcto del prop
    nivel = 0,
    onCrearSubcategoria // ✅ AGREGAR: prop función
}) => {
    const [expanded, setExpanded] = useState(false);
    const tieneSubcategorias = categoria.subcategorias && categoria.subcategorias.length > 0;

    const handleToggle = (e) => {
        e.stopPropagation();
        setExpanded(!expanded);
    };

    const isActive = categoriaFilter === categoria.id.toString();
    const paddingLeft = nivel * 20;

    return (
        <>  
            <ListGroup.Item
                action
                active={isActive}
                onClick={() => onCategoriaSelect(categoria.id.toString())}
                disabled={loadingCategoria}
                className="d-flex justify-content-between align-items-center"
                style={{ paddingLeft: `${paddingLeft + 16}px`, cursor: 'pointer' }}
            >
                <span className="d-flex align-items-center">    
                    {nivel === 0 && tieneSubcategorias && (
                        <span 
                            onClick={handleToggle}
                            style={{ cursor: 'pointer', marginRight: '8px' }}
                            title={expanded ? "Ocultar subcategorías" : "Mostrar subcategorías"}
                        >
                            <FontAwesomeIcon icon={expanded ? faChevronDown : faChevronRight} />
                        </span>
                    )}
                    
                    {nivel === 0 ? (
                        <FontAwesomeIcon 
                            icon={expanded ? faFolderOpen : faFolder} 
                            style={{ marginRight: '8px', color: '#ffc107' }} 
                        />
                    ) : (
                        <span style={{ marginRight: '8px', color: '#6c757d' }}>
                            {'\u2514\u2500'} {/* └─ */}
                        </span>
                    )}
                    
                    {categoria.nombre}
                </span>

                <div className="d-flex align-items-center gap-2">
                    {categoria.productos_count > 0 && (
                        <span className="badge bg-secondary">
                            {categoria.productos_count}
                        </span>
                    )}
                    
                    {/* ✅ CORREGIR: Usar prop correctamente */}
                    {nivel === 0 && onCrearSubcategoria && (
                        <Button
                            size="sm"
                            variant="outline-success"
                            onClick={(e) => {
                                e.stopPropagation();
                                onCrearSubcategoria(categoria.id);
                            }}
                            title="Crear subcategoría"
                        >
                            +
                        </Button>
                    )}
                </div>
            </ListGroup.Item>
            
            {/* ✅ Subcategorías */}
            {expanded && tieneSubcategorias && (
                <>
                    {categoria.subcategorias.map((subcategoria) => (
                        <CategoriaItem
                            key={subcategoria.id}
                            categoria={subcategoria}
                            categoriaFilter={categoriaFilter}
                            onCategoriaSelect={onCategoriaSelect}
                            loadingCategoria={loadingCategoria}
                            nivel={nivel + 1}
                            onCrearSubcategoria={onCrearSubcategoria}
                        />
                    ))}
                </>
            )}
        </>
    );
};

// ✅ AGREGAR: Export por defecto
export default CategoriaItem;