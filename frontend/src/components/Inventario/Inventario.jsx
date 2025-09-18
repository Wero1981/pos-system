import React from "react";
import ProductosServices from "../../services/InventarioServices";
import "datatables.net-dt/css/jquery.dataTables.css";
import $ from "jquery"; 
import "datatables.net";

function Inventario() {
    return(
        <div>
            <h2>Gestión de Inventario</h2>
            <p>Aquí puedes gestionar el inventario de productos.</p>
        </div>
    );
}

export default Inventario;