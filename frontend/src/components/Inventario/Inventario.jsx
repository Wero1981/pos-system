import React, { useEffect, useState, useMemo } from "react";
import {
  Row, Col, ListGroup, Button, Modal, Form, InputGroup, Image, Spinner, Pagination
} from "react-bootstrap";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender
} from "@tanstack/react-table";
import InventarioServices from "../../services/InventarioServices";

const  PAGE_SIZE = 10;

function Inventario ({ initialSucursalId = null}){
    console.log("[INFO]Render Inventario")
    console.log("[DEBUG]initialSucursalId:", initialSucursalId);
    const [sucursales, setSucursales] = useState([]);
    const [sucursalSeleccionada, setSucursalSeleccionada] = useState(initialSucursalId);

    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [inventarios, setInventarios] = useState([]);
    const [loading, setLoading] = useState(false);

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
        imagen: null,
    });

    //Modal Crear Categoria
    const [showModalCategoria, setShowModalCategoria] = useState(false);
    const [formCategoria, setFormCategoria] = useState({
        nombre: "",
        descripcion: "",
    });

    //paginacion
    const [pageIndex, setPageIndex] = useState(0);

    //cargar sucursales, categorias, productos al inicio

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                const s = await InventarioServices.obtenerSucursales();
                setSucursales(s);
                if ( !sucursalSeleccionada && s.length > 0) {
                    setSucursalSeleccionada(s[0].id);
                }

                const cats = await InventarioServices.obtenerCategorias();
                setCategorias(cats);

                const prods = await InventarioServices.obtenerProductos();
                setProductos(prods);

            } catch (error) {
                console.error("Error al cargar datos:", error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [sucursalSeleccionada]);

    //cargar inventario cuando se selecciona una sucursal
    useEffect (() => {
        if(!sucursalSeleccionada){
            setInventarios([]);
            return;
        }

        const fetchInventario = async () => {
            setLoading(true);
            try {
                const invs = await InventarioServices.obtenerInventarioPorSucursal(sucursalSeleccionada);
                setInventarios(invs);
                setPageIndex(0); // resetear paginacion al cambiar sucursal
            } catch (error) {
                console.error("Error al cargar inventario:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInventario();
    }, [sucursalSeleccionada])

    //filtrar inventario por busqueda y categoria
    const dataFiltered = useMemo(() => {
        return inventarios.filter((inv) => {
            const prod = inv.prod || {};
            const matchCategoria = !categoriaFilter || (prod.categoria && prod.categoria.id === categoriaFilter);
            const matchBusqueda = !busqueda || prod.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                (prod.descripcion && prod.descripcion.toLowerCase().includes(busqueda.toLowerCase()));

            return matchCategoria && matchBusqueda;
        });
    }, [inventarios, busqueda, categoriaFilter]);

    // StockCell component for editing stock
    function StockCell({ inventario, onSave }) {
        const [editing, setEditing] = useState(false);
        const [stock, setStock] = useState(inventario.stock_actual);
        const [saving, setSaving] = useState(false);

        const handleSave = async () => {
            setSaving(true);
            await onSave(Number(stock));
            setSaving(false);
            setEditing(false);
        };

        useEffect(() => {
            setStock(inventario.stock_actual);
        }, [inventario.stock_actual]);

        return editing ? (
            <InputGroup size="sm">
                <Form.Control
                    type="number"
                    value={stock}
                    min={0}
                    onChange={e => setStock(e.target.value)}
                    disabled={saving}
                />
                <Button variant="success" size="sm" onClick={handleSave} disabled={saving}>
                    {saving ? <Spinner animation="border" size="sm" /> : "Guardar"}
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setEditing(false)} disabled={saving}>
                    Cancelar
                </Button>
            </InputGroup>
        ) : (
            <>
                {inventario.stock_actual}
                <Button variant="outline-primary" size="sm" className="ms-2" onClick={() => setEditing(true)}>
                    Editar
                </Button>
            </>
        );
    }
    //guardar categoria
    const handleGuardarCategoria = async () => {
        try {
            await InventarioServices.crearCategoria(formCategoria);
            const cats = await InventarioServices.obtenerCategorias();
            setCategorias(cats);
            setShowModalCategoria(false);
            setFormCategoria({ nombre: "", descripcion: "" });
        } catch (error) {
            console.error("Error al guardar categoria:", error);
        }
    }

    // Columnas: imagen, nombre, codigo, categoria, precio, stock editable, acciones
    const columnHelper = createColumnHelper();
    const columns = useMemo(() => [
        columnHelper.display({
            id: "imagen",
            header: "Imagen",
            cell: ({ row }) => {
                const prod = row.original.prod || {};
                const url = prod?.imagen || prod?.imagen_url || null;
                return url ? <Image src={url} alt={prod.nombre} thumbnail style={{ width: "50px", height: "50px", objectFit: "cover" }} /> : "No imagen";
            }
        }),
        columnHelper.accessor(row => row.producto.nombre, {
            id: "nombre",
            header: "Nombre",
        }),
        columnHelper.accessor(row => row.producto.codigo_barras || "", {
            id: "codigo",
            header: "Código",
        }),
        columnHelper.accessor(row => row.producto.categoria?.nombre || "", {
            id: "categoria",
            header: "Categoría",
        }),
        columnHelper.accessor(row => row.producto.precio_venta, {
            id: "precio",
            header: "Precio",
        }),
        columnHelper.display({
            id: "stock",
            header: "Stock",
            cell: ({ row }) => {
                const inv = row.original;
                return (
                    <StockCell inventario={inv} onSave={async (newStock) => {
                        // actualizar inventario y refrescar
                        await InventarioServices.actualizarInventario(inv.id, { stock_actual: newStock });
                        const refreshed = await InventarioServices.obtenerInventarioPorSucursal(sucursalSeleccionada);
                        setInventarios(refreshed);
                    }} />
                );
            }
        }),
        columnHelper.display({
            id: "acciones",
            header: "Acciones",
            cell: ({ row }) => {
                const prod = row.original.producto;
                return (
                    <>  
                        <Button size="sm" variant="warning" className="me-1" onClick={() => abrirModalEditarProducto(prod)}>Editar</Button>
                        <Button size="sm" variant="info" className="me-1" onClick={() => irDetalleProducto(prod.id)}>Ver</Button>
                    </>
                );
            }
        })
    ], [sucursalSeleccionada, columnHelper]);

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
        try {
            if (productoEditar) {
                // editar
                await InventarioServices.actualizarProducto(productoEditar.id, formProducto);
            } else {
                // crear
                await InventarioServices.crearProducto(formProducto);
            }
            // refrescar productos
            const prods = await InventarioServices.obtenerProductos();
            setProductos(prods);
            if(sucursalSeleccionada){
                const invs = await InventarioServices.obtenerInventarioPorSucursal(sucursalSeleccionada);
                setInventarios(invs);
            }
            setShowModal(false);
        } catch (error) {
            console.error("Error al guardar producto:", error);
        }
    }

    const irDetalleProducto = (productoId) => {
        alert("Ir a detalle de producto ID: " + productoId);
    };

    const totalPages = Math.max(1, Math.ceil(dataFiltered.length / PAGE_SIZE));
    const currentPage = pageIndex;

    return(
        <div>
           <Row className="mb-3">
                <Col md={4}>
                    <h5>Sucursales</h5>
                    {loading ? <Spinner animation="border" /> : (
                        <Form.Select value={sucursalSeleccionada || ""} onChange={e => setSucursalSeleccionada(Number(e.target.value))}>
                            <option value="">---Seleccione una sucursal---</option>
                            {sucursales.map(sucursal => (
                                <option key={sucursal.id} value={sucursal.id}>
                                    {sucursal.nombre}
                                </option>
                            ))}
                        </Form.Select>
                    )}

                    <hr />
                    <div>
                        <div className="d flex justify-content-between align-items-center mb-2">
                            <h6>Categorias</h6>
                            <button size="sm" onClick={() => setShowModalCategoria(true)}>+ Nueva Categoria</button>
                        </div>
                        <ListGroup>
                            <ListGroup.Item
                                action
                                active={!categoriaFilter} onClick={() => setCategoriaFilter(null)}>
                                Todas
                            </ListGroup.Item>
                            {categorias.map(cat => (
                                <ListGroup.Item
                                    key={cat.id}
                                    action
                                    active={categoriaFilter === cat.id}
                                    onClick={() => setCategoriaFilter(cat.id)}>
                                    {cat.nombre}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>

                    </div>
                </Col>
                <Col md={8}>
                    <div className="d-flex  mb-2">
                        <InputGroup>
                            <Form.Control
                                type="text"
                                placeholder="Buscar productos..."
                                value={busqueda}
                                onChange={e => setBusqueda(e.target.value)}
                            />
                        </InputGroup>
                        <Button variant="primary" onClick={abrirModalCrearProducto}>+ Nuevo Producto</Button>    
                    </div>
                    {loading ? <Spinner animation="border" /> : (
                        <>
                            <table className="table table-hover">
                                <thead>
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>
                                    ))}
                                    </tr>
                                ))}
                                </thead>
                                <tbody>
                                {table.getRowModel().rows.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE).map(row => (
                                    <tr key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                                    ))}
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                            {/* Pagination simple */}
                            <div className="d-flex justify-content-end">
                                <Pagination>
                                <Pagination.Prev disabled={currentPage === 0} onClick={() => setPageIndex(p => Math.max(0, p - 1))} />
                                {[...Array(totalPages)].map((_, i) => (
                                    <Pagination.Item key={i} active={i === currentPage} onClick={() => setPageIndex(i)}>{i + 1}</Pagination.Item>
                                ))}
                                <Pagination.Next disabled={currentPage + 1 >= totalPages} onClick={() => setPageIndex(p => Math.min(totalPages - 1, p + 1))} />
                                </Pagination>
                            </div>
                        </>
                    )}
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
                        <Form.Group className="mb-3">
                            <Form.Label>Precio de Venta</Form.Label>
                            <Form.Control type="number" value={formProducto.precio_venta} onChange={e => setFormProducto({...formProducto, precio_venta: Number(e.target.value)})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Costo</Form.Label>
                            <Form.Control type="number" value={formProducto.costo} onChange={e => setFormProducto({...formProducto, costo: Number(e.target.value)})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Categoría</Form.Label>
                            <Form.Select value={formProducto.categoria_id} onChange={e => setFormProducto({...formProducto, categoria_id: e.target.value})}>
                                <option value="">--Seleccione una categoría--</option>
                                {categorias.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Imagen</Form.Label>
                            <Form.Control type="file" onChange={e => setFormProducto({...formProducto, imagen: e.target.files[0]})} />
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
                            <Form.Control type="text" value={formCategoria.nombre} onChange={e => setFormCategoria({...formCategoria, nombre: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control as="textarea" rows={3} value={formCategoria.descripcion} onChange={e => setFormCategoria({...formCategoria, descripcion: e.target.value})} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModalCategoria(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={handleGuardarCategoria}>Guardar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Inventario;