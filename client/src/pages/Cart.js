import { Link, Navigate } from 'react-router-dom';
import { User, user_context } from "../models/user_model";
import { useContext } from "react";
import { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import { checkout, clear_cart, get_cart, remove_item } from '../models/cart_model';
import Button from 'react-bootstrap/Button';

import "./Cart/cart.css"

function EmptyCart(){
	return <div className='empty'>
		<p>Looks like your cart is empty.</p>
		<Link to="/">Back to Shopping!</Link>
	</div>
}



function Cart() {
    const [cart, setCart] = useState(null); // Local state for cart
    const { user } = useContext(user_context); // Access user context

    useEffect(() => {
        const fetchCart = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) return;

            try {
                const fetchedCart = await get_cart(token);
                setCart(fetchedCart); // Update local cart state
            } catch (error) {
                console.error("Error fetching cart:", error);
            }
        };

        fetchCart();
    }, []);

    if (!user) {
        return <p>Please log in to view your cart.</p>;
    }

    if (!cart) {
        return <p>Loading your cart...</p>;
    }

    return (
        <div>
            <h2>Your Cart</h2>
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.items.map((item) => (
                        <tr key={item.computer_id}>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>${item.price.toFixed(2)}</td>
                            <td>${(item.quantity * item.price).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <p>Subtotal: ${cart.subtotal.toFixed(2)}</p>
                <p>Tax: ${cart.tax.toFixed(2)}</p>
                <p>Shipping Fees: ${cart.shippingFees.toFixed(2)}</p>
                <h3>Total: ${cart.total.toFixed(2)}</h3>
            </div>
        </div>
    );
}

  
  export default Cart;