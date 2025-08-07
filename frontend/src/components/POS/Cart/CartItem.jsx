import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function CartItem({ item, onRemoveItem, onUpdateQuantity }) {
    return (
        <li className="list-group-item d-flex justify-content-between align-items-center">
            <div>
                {item.name} - ${item.price.toFixed(2)}
                <div className="mt-2">
                    <button 
                        className="btn btn-sm btn-outline-secondary me-2" 
                        onClick={() => onUpdateQuantity(item, item.quantity - 1)}
                    >-</button>
                    <span>{item.quantity}</span>
                    <button 
                        className="btn btn-sm btn-outline-secondary ms-2" 
                        onClick={() => onUpdateQuantity(item, item.quantity + 1)}
                    >+</button>
                    <button 
                        className="btn btn-sm btn-outline-danger ms-2" 
                        onClick={() => onRemoveItem(item)}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            </div>
        </li>
    );
}

export default CartItem;
