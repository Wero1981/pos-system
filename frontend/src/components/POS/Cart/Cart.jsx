import React from "react";
import CartItem from "./CartItem";

function Cart({ cartItems, onRemoveItem, onUpdateQuantity }) {
    return (
        <ul className="list-group">
            {cartItems.length === 0 && (
                <li className="list-group-item text-center">El carrito está vacío</li>
            )}
            {cartItems.map((item, index) => (
                <CartItem
                    key={index}
                    item={item}
                    onRemoveItem={onRemoveItem}
                    onUpdateQuantity={onUpdateQuantity}
                />
            ))}
        </ul>
    );
}

export default Cart;
