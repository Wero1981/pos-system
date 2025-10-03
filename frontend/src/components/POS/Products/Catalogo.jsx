import React, { useEffect, useState, useMemo } from "react";
import {
  Row, Col, ListGroup, Button, Modal, Form, InputGroup, Image, Spinner, Card, CardBody, CardHeader
} from "react-bootstrap";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder } from '@fortawesome/free-solid-svg-icons';   

import InventarioServices from "../../../services/InventarioServices";
import ProductosServicesCategorias from "../../../services/ProductoServices";
import BuscadorDeImagenes from "./BuscadorDeImagenes";
import CategoriaItem from "./categoriaItem";

const  PAGE_SIZE = 10;

function Catalogo (){
    console.log("[INFO]Render Catalogo")

    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoriasJerarquicas, setCategoriasJerarquicas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingCategoria, setLoadingCategoria] = useState(false);

    //busqueda y filtros
    const [busqueda, setBusqueda] = useState("");
    const [categoriaFilter, setCategoriaFilter] = useState("todas");

    //modal crear/editar producto
    const [showModal, setShowModal] = useState(false);
    const [productoEditar, setProductoEditar] = useState(null);
    const [formProducto, setFormProducto] = useState({
        nombre: "",
        descripcion: "",
        precio_venta: 0,
        costo: 0,
        categoria_id: "",
        unidad_medida: "pza",
        imagen_url: null,
    });

    //Estados para la busdqueda de imagenges
    const [showBuscadorImagenes, setShowBuscadorImagenes] = useState(false);
    const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
    const [previewImagenUrl, setPreviewImagenUrl] = useState("");

    //Modal Crear Categoria
    const [showModalCategoria, setShowModalCategoria] = useState(false);
    const [formCategoria, setFormCategoria] = useState({
        nombre: "",
        descripcion: "",
        categoria_padre: "",
    });

    //paginacion
    const [pageIndex, setPageIndex] = useState(0);

    //cargar sucursales, categorias, productos al inicio

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                const cats = await ProductosServicesCategorias.obtenerCategorias();
                setCategorias(cats);
                
                // Organizar en jerarquía
                const jerarquia = organizarCategoriasPorJerarquia(cats);
                setCategoriasJerarquicas(jerarquia);
                
                await cargarProductosPorCategoria("todas");
            } catch (error) {
                console.error("Error al cargar datos:", error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    /*
    *funcion recursiva para organizar categorias jerarquicamente
    */
    const organizarCategoriasPorJerarquia = (categorias) => {
        const principales = categorias.filter(cat => !cat.categoria_padre);
        const subcategorias = categorias.filter(cat => cat.categoria_padre);
        
        return principales.map(principal => ({
            ...principal,
            subcategorias: subcategorias.filter(sub => sub.categoria_padre === principal.id)
        }));
    };

    const cargarProductosPorCategoria = async (categoriaId) => {
        setLoadingCategoria(true);
        try {
            const productos = await ProductosServicesCategorias.obtenerProductosPorCategoria(categoriaId);
            setProductos(productos);
            console.log("[DEBUG] Productos cargados para categoría:", categoriaId, productos.length);
        } catch (error) {
            console.error("Error al cargar productos por categoría:", error);
        } finally {
            setLoadingCategoria(false);
        }
    };

    
    //filtrar inventario por busqueda y categoria
    const dataFiltered = useMemo(() => {
        if (!busqueda.trim()) {
            return productos;
        }
        
        const searchTerm = busqueda.toLowerCase().trim();
        return productos.filter(producto => 
            (producto.nombre && producto.nombre.toLowerCase().includes(searchTerm)) ||
            (producto.descripcion && producto.descripcion.toLowerCase().includes(searchTerm)) ||
            (producto.codigo_barras && producto.codigo_barras.toLowerCase().includes(searchTerm))
        );
    }, [productos, busqueda]);

    const crearSubcategoria = (categoriaPadreId) => {
        setFormCategoria({
            nombre: "",
            descripcion: "",
            categoria_padre: categoriaPadreId.toString()
        });
        setShowModalCategoria(true);
    };

    //guardar categoria
    const handleGuardarCategoria = async () => {
        try {
            console.log("[DEBUG] Guardar categoria:", formCategoria);
            
            const dataToSend = {
                nombre: formCategoria.nombre,
                descripcion: formCategoria.descripcion,
            };
            
            // ✅ AGREGAR: categoria_padre si existe
            if (formCategoria.categoria_padre) {
                dataToSend.categoria_padre = parseInt(formCategoria.categoria_padre);
            }
            
            await ProductosServicesCategorias.crearCategoria(dataToSend);
            
            // ✅ RECARGAR: Categorías y reorganizar jerarquía
            const cats = await ProductosServicesCategorias.obtenerCategorias();
            setCategorias(cats);
            
            const jerarquia = organizarCategoriasPorJerarquia(cats);
            setCategoriasJerarquicas(jerarquia);
            
            setShowModalCategoria(false);
            setFormCategoria({ nombre: "", descripcion: "", categoria_padre: "" });
            
            // ✅ RECARGAR productos si es necesario
            await cargarProductosPorCategoria(categoriaFilter);
            
        } catch (error) {
            console.error("Error al guardar categoria:", error);
            alert(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    // Columnas: imagen, nombre, codigo, categoria, precio, stock editable, acciones
    const columnHelper = createColumnHelper();
    const columns = useMemo(() => [
        columnHelper.display({
            id: "imagen",
            header: "Imagen",
            cell: ({ row }) => {
                const prod = row.original;
                const url = prod?.imagen || prod?.imagen_url || null;
                return url ? (
                    <Image 
                        src={url} 
                        alt={prod.nombre} 
                        thumbnail 
                        style={{ width: "50px", height: "50px", objectFit: "cover" }} 
                    />
                ) : "No imagen";
            }
        }),
        columnHelper.accessor('nombre', {
            id: "nombre",
            header: "Nombre",
        }),
        columnHelper.accessor('codigo_barras', {
            id: "codigo",
            header: "Código",
            cell: ({ getValue }) => getValue() || "Sin código"
        }),
        columnHelper.accessor('categoria_nombre', {
            id: "categoria",
            header: "Categoría",
            cell: ({ getValue }) => getValue() || "Sin categoría"
        }),
        columnHelper.accessor('precio_venta', {
            id: "precio",
            header: "Precio",
            cell: ({ getValue }) => `$${getValue()}`
        }),
        columnHelper.accessor('costo', {
            id: "costo",
            header: "Costo",
            cell: ({ getValue }) => getValue() ? `$${getValue()}` : "N/A"
        }),
        columnHelper.display({
            id: "acciones",
            header: "Acciones",
            cell: ({ row }) => {
                const prod = row.original;
                return (
                    <>  
                        <Button 
                            size="sm" 
                            variant="warning" 
                            className="me-1" 
                            onClick={() => abrirModalEditarProducto(prod)}
                        >
                            Editar
                        </Button>
                        <Button 
                            size="sm" 
                            variant="info" 
                            className="me-1" 
                            onClick={() => irDetalleProducto(prod.id)}
                        >
                            Ver
                        </Button>
                    </>
                );
            }
        })
    ], []);

    const table = useReactTable({
        data: dataFiltered,
        columns,
        pageCount: Math.ceil(dataFiltered.length / PAGE_SIZE),
        state: {
            pagination: { pageIndex },
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),                                                                                                                                             
    });

    //acciones
    const abrirModalEditarProducto = (producto) => {
        setProductoEditar(producto);
        setFormProducto({
            nombre: producto.nombre || "",
            descripcion: producto.descripcion || "",
            precio_venta: producto.precio_venta || 0,
            costo: producto.costo || 0,
            categoria_id: producto.categoria ? producto.categoria.id : "",
            imagen: null,
        });
        setShowModal(true);
    }

    const abrirModalCrearProducto = () => {
        setProductoEditar(null);
        setFormProducto({
            nombre: "",
            descripcion: "",
            precio_venta: 0,
            costo: 0,
            categoria_id: "",
            imagen: null,
        });
        setShowModal(true);
    }

   const hadleGuardarProducto = async () => {
        setLoading(true);
        try {
            if (productoEditar) {
                await InventarioServices.actualizarProducto(productoEditar.id, formProducto);
            } else {
                await InventarioServices.crearProducto(formProducto);
            }
            
            setShowModal(false);
            setFormProducto({
                nombre: "",
                descripcion: "",
                precio_venta: 0,
                costo: 0,
                categoria_id: "",
                imagen: null,
            });
            
            // ✅ RECARGAR: Productos de la categoría actual
            await cargarProductosPorCategoria(categoriaFilter);
            
        } catch (error) {
            console.error("Error al guardar producto:", error);
            alert(`Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const irDetalleProducto = (productoId) => {
        alert("Ir a detalle de producto ID: " + productoId);
    };

    const handleCategoriaFilter = async (categoriaId) => {
        console.log("[DEBUG] Cambiando a categoría:", categoriaId);
        setCategoriaFilter(categoriaId);
        setPageIndex(0);
        
        // Cargar productos de esa categoría del backend
        await cargarProductosPorCategoria(categoriaId);
    };

    const handleBusquedaChange = (e) => {
        const valor = e.target.value;
        setBusqueda(valor);
        setPageIndex(0);
        // No hay llamada al backend, solo filtrado local
    };

    const limpiarFiltros = async () => {
        setBusqueda("");
        setPageIndex(0);
        // Si ya estamos en "todas", solo limpiar búsqueda
        if (categoriaFilter === "todas") {
            // Los productos ya están cargados, solo se limpia la búsqueda
        } else {
            setCategoriaFilter("todas");
            await cargarProductosPorCategoria("todas");
        }
    };

    const handleSeleccionarImagen = (file, url) => {
        setImagenSeleccionada(file);
        setPreviewImagenUrl(url);
        setFormProducto({...formProducto, imagen: file});
        console.log("[DEBUG] Imagen seleccionada:", file);
    };

    const abrirBuscadorImagenes = () => {
        console.log("[DEBUG] Abrir buscador de imágenes para:", formProducto.nombre);
        setShowBuscadorImagenes(true);
    };

    const resetFormulario = () => {
        setFormProducto({
            nombre: "",
            descripcion: "",
            precio_venta: 0,
            costo: 0,
            categoria_id: "",
            imagen: null,
        });
        setImagenSeleccionada(null);
        setPreviewImagenUrl("");
    };



    const totalPages = Math.max(1, Math.ceil(dataFiltered.length / PAGE_SIZE));
    const currentPage = pageIndex;

    return(
        <div>
           <Row className="mb-3">
                <Col md={4}>
                    <Card>
                        <CardHeader className="d-flex justify-content-between align-items-center mb-2">
                            <h6>Categorías</h6>
                            {loadingCategoria && <Spinner animation="border" size="sm" />}
                        </CardHeader>
                        <button 
                            className="btn btn-link" 
                            onClick={() => setShowModalCategoria(true)}
                        >
                            + Nueva Categoría
                        </button>
                        <CardBody>
                            <ListGroup>
                                <ListGroup.Item
                                    action
                                    active={categoriaFilter === "todas"}
                                    onClick={() => handleCategoriaFilter("todas")}
                                    disabled={loadingCategoria}
                                    className="fw-bold"
                                >
                                    <FontAwesomeIcon icon={faFolder} />
                                    Todas las categorias
                                    <span className="badge bg-secondary float-end">{productos.length}</span>
                                    
                                    
                                </ListGroup.Item>
                                {categoriasJerarquicas.map(categoria => (
                                    <CategoriaItem
                                        key={categoria.id}
                                        categoria={categoria}
                                        categoriaFilter={categoriaFilter}
                                        onCategoriaSelect={handleCategoriaFilter}
                                        loadingCategoria={loadingCategoria}
                                        nivel={0}
                                        onCrearSubcategoria={crearSubcategoria} // ✅ PASAR función
                                    />
                                ))}
                            </ListGroup>
                        </CardBody>
                    </Card>
                </Col>
                
                <Col md={8}>
                    <Card>
                        <CardHeader className="d-flex mb-2">
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    placeholder="Buscar en categoría actual..."
                                    value={busqueda}
                                    onChange={handleBusquedaChange}
                                />
                                {busqueda && (
                                    <Button 
                                        variant="outline-secondary"
                                        onClick={() => setBusqueda("")}
                                    >
                                        ✕
                                    </Button>
                                )}
                            </InputGroup>
                            <Button 
                                variant="primary" 
                                style={{ width: "auto", marginLeft: "10px" }}
                                onClick={abrirModalCrearProducto}
                            >
                                + Nuevo
                            </Button>
                        </CardHeader>
                        
                        <CardBody>
                            {/*  MEJORAR: Información de estado */}
                            <div className="mb-2 text-muted small d-flex justify-content-between align-items-center">
                                <span>
                                    {dataFiltered.length} de {productos.length} productos
                                    {busqueda && ` • Búsqueda: "${busqueda}"`}
                                    {categoriaFilter !== "todas" && 
                                        ` • Categoría: ${categorias.find(c => c.id.toString() === categoriaFilter)?.nombre}`
                                    }
                                </span>
                                {(busqueda || categoriaFilter !== "todas") && (
                                    <Button 
                                        variant="link" 
                                        size="sm"
                                        onClick={limpiarFiltros}
                                    >
                                        Limpiar filtros
                                    </Button>
                                )}
                            </div>
                            
                            {loading || loadingCategoria ? (
                                <div className="text-center py-4">
                                    <Spinner animation="border" />
                                    <p>{loading ? "Cargando..." : "Cambiando categoría..."}</p>
                                </div>
                            ) : (
                                <>
                                    <table className="table table-hover">
                                        <thead>
                                            {table.getHeaderGroups().map(headerGroup => (
                                                <tr key={headerGroup.id}>
                                                    {headerGroup.headers.map(header => (
                                                        <th key={header.id}>
                                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                                        </th>
                                                    ))}
                                                </tr>
                                            ))}
                                        </thead>
                                        <tbody>
                                            {table.getRowModel().rows
                                                .slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)
                                                .map(row => (
                                                    <tr key={row.id}>
                                                        {row.getVisibleCells().map(cell => (
                                                            <td key={cell.id}>
                                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                    
                                    {dataFiltered.length === 0 && productos.length > 0 && (
                                        <div className="text-center py-4">
                                            <p>No se encontraron productos con "{busqueda}" en esta categoría.</p>
                                            <Button variant="link" onClick={() => setBusqueda("")}>
                                                Limpiar búsqueda
                                            </Button>
                                        </div>
                                    )}
                                    
                                    {productos.length === 0 && (
                                        <div className="text-center py-4">
                                            <p>No hay productos en esta categoría.</p>
                                        </div>
                                    )}
                                    
                                    {/* ... paginación igual ... */}
                                </>
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            {/* Modal Crear/Editar Producto */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{productoEditar ? "Editar Producto" : "Crear Producto"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" value={formProducto.nombre} onChange={e => setFormProducto({...formProducto, nombre: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control as="textarea" rows={3} value={formProducto.descripcion} onChange={e => setFormProducto({...formProducto, descripcion: e.target.value})} />
                        </Form.Group>
                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Precio de Venta</Form.Label>
                                    <Form.Control type="number" value={formProducto.precio_venta} onChange={e => setFormProducto({...formProducto, precio_venta: Number(e.target.value)})} />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Costo</Form.Label>
                                    <Form.Control type="number" value={formProducto.costo} onChange={e => setFormProducto({...formProducto, costo: Number(e.target.value)})} />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Unidad de Medida</Form.Label>
                                    <Form.Select 
                                        value={formProducto.unidad_medida} 
                                        onChange={e => setFormProducto({...formProducto, unidad_medida: e.target.value})}
                                    >
                                        <option value="">--Seleccione una unidad--</option>
                                        <option value="pza">Pieza (pza)</option>
                                        <option value="peso">Peso (peso)</option>
                                        <option value="lt">Litro (lt)</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Categoría</Form.Label>
                            <Form.Select value={formProducto.categoria_id} 
                                onChange={e => setFormProducto({...formProducto, categoria_id: e.target.value})}>
                                <option value="">--Seleccione una categoría--</option>
                                {categorias
                                    .filter(cat => !cat.categoria_padre)
                                    .map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            📁 {cat.nombre}
                                        </option>
                                    ))
                                }
                                {categorias
                                    .filter(cat => cat.categoria_padre)
                                    .map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            &nbsp;&nbsp;↳ {cat.nombre}
                                        </option>
                                    ))
                                }
                                {formProducto.categoria_id && (
                                    <Form.Text className="text-muted">
                                        {(() => {
                                            const catSeleccionada = categorias.find(c => c.id.toString() === formProducto.categoria_id);
                                            if (catSeleccionada?.categoria_padre) {
                                                const padre = categorias.find(c => c.id === catSeleccionada.categoria_padre);
                                                return `📂 ${padre?.nombre} > ${catSeleccionada.nombre}`;
                                            }
                                            return `📁 ${catSeleccionada?.nombre}`;
                                        })()}
                                    </Form.Text>
                                )}
        
                            </Form.Select>
                        </Form.Group>
                       
                         <Form.Group className="mb-3">
                            <Form.Label>Imagen del Producto</Form.Label>
                            
                            {/* Preview de imagen */}
                            {previewImagenUrl && (
                                <div className="mb-3">
                                    <Image 
                                        src={previewImagenUrl} 
                                        thumbnail 
                                        style={{ maxWidth: '200px', maxHeight: '200px' }}
                                    />
                                    <Button 
                                        variant="outline-danger" 
                                        size="sm" 
                                        className="ms-2"
                                        onClick={() => {
                                            setPreviewImagenUrl("");
                                            setImagenSeleccionada(null);
                                            setFormProducto({...formProducto, imagen: null});
                                        }}
                                    >
                                        ✕ Quitar
                                    </Button>
                                </div>
                            )}
                            
                            <div className="d-flex gap-2">
                                <Form.Control 
                                    type="file" 
                                    accept="image/*"
                                    onChange={e => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setFormProducto({...formProducto, imagen: file});
                                            setPreviewImagenUrl(URL.createObjectURL(file));
                                        }
                                    }} 
                                />
                                <Button 
                                    variant="outline-primary"
                                    onClick={abrirBuscadorImagenes}
                                    disabled={!formProducto.nombre.trim()}
                                >
                                    🔍 Buscar Online
                                </Button>
                            </div>
                            
                            {!formProducto.nombre.trim() && (
                                <Form.Text className="text-muted">
                                    Ingresa el nombre del producto para buscar imágenes online
                                </Form.Text>
                            )}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={hadleGuardarProducto}>Guardar</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Crear Categoria */}
            <Modal show={showModalCategoria} onHide={() => setShowModalCategoria(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Nueva Categoria</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={formCategoria.nombre} 
                                onChange={e => setFormCategoria({...formCategoria, nombre: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                value={formCategoria.descripcion} 
                                onChange={e => setFormCategoria({...formCategoria, descripcion: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Categoría Padre (opcional)</Form.Label>
                            <Form.Select 
                                value={formCategoria.categoria_padre || ""} 
                                onChange={e => setFormCategoria({...formCategoria, categoria_padre: e.target.value || null})}
                            >
                                <option value="">--Ninguna--</option>
                                {categorias.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                ))}
                            </Form.Select>
                            <Form.Text className="text-muted">
                                {formCategoria.categoria_padre ?
                                "Se creara como subcategoria" :
                                "Se creara como categoría principal"
                                }
                            </Form.Text>
                        </Form.Group>   
        
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => 
                        {
                            setShowModalCategoria(false)
                            setFormCategoria({ nombre: "", descripcion: "", categoria_padre: "" })

                        }
                        }>Cancelar</Button>
                    <Button variant="primary" onClick={handleGuardarCategoria}>
                        {formCategoria.categoria_padre ? "Crear Subcategoría" : "Crear Categoría"}
                    </Button>
                </Modal.Footer>
            </Modal>

             <BuscadorDeImagenes
                show={showBuscadorImagenes}
                onHide={() => setShowBuscadorImagenes(false)}
                onSelectImage={handleSeleccionarImagen}
                nombreProducto={formProducto.nombre}
            />

        </div>
    );
}

export default Catalogo;