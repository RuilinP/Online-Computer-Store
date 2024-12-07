import React, { useEffect, useState, useContext } from "react";
import { User, user_context } from "../models/user_model";
import { get_cart, update_cart, remove_item } from "../models/cart_model";

const Cart = () => {
    const { user } = useContext(user_context);
    const [cart, setCart] = useState(null);
    const [totals, setTotals] = useState({ subtotal: 0, tax: 0, shippingFees: 0, total: 0 });
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        const fetchCart = async () => {
            if (!token) return;
            try {
                const fetchedCart = await get_cart(token);
                setCart(fetchedCart);
                calculateTotals(fetchedCart);
            } catch (error) {
                console.error("Error fetching cart:", error);
            }
        };

        fetchCart();
    }, [token]);

    const calculateTotals = (cart) => {
        if (!cart) return;
        const { subtotal, tax, shippingFees, total } = cart;
        setTotals({ subtotal, tax, shippingFees, total });
    };

    const handleQuantityChange = async (computer_id, newQuantity) => {
        if (!cart) return;

        const updatedItems = cart.items.map((item) =>
            item.computer_id === computer_id
                ? { computer_id, quantity: newQuantity }
                : { computer_id: item.computer_id, quantity: item.quantity }
        );

        try {
            await update_cart(token, updatedItems);
            const updatedCart = await get_cart(token);
            setCart(updatedCart);
            calculateTotals(updatedCart);
        } catch (error) {
            alert(error.message || "Failed to update quantity.");
            console.error("Error updating cart:", error);
        }
    };

    const handleRemoveItem = async (computer_id) => {
        try {
            await remove_item(token, computer_id);
            const updatedCart = await get_cart(token);
            setCart(updatedCart);
            calculateTotals(updatedCart);
        } catch (error) {
            alert(error.message || "Failed to remove item.");
            console.error("Error removing item:", error);
        }
    };

    const handleCheckout = async () => {
        try {
            const response = await fetch("https://computers.ruilin.moe/api/carts/checkout", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const result = await response.json();
                alert(`Checkout successful!`);
                setCart(null); // Clear the cart on successful checkout
            } else {
                const error = await response.json();
                alert(error.message || "Checkout failed.");
            }
        } catch (error) {
            console.error("Error during checkout:", error);
            alert("An error occurred during checkout.");
        }
    };

    if (!user) return <p>Please log in to view your cart.</p>;
    if (!cart) return <p>Your cart is empty.</p>;

    return (
        <div className="cart">
            <h2>Your Cart</h2>
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.items.map((item) => (
                        <tr key={item.computer_id}>
                            <td>{item.name}</td>
                            <td>${item.price.toFixed(2)}</td>
                            <td>
                                <button
                                    onClick={() => handleQuantityChange(item.computer_id, item.quantity + 1)}
                                    disabled={item.quantity >= item.stock} // Disable increment above stock
                                >
                                    +
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(item.computer_id, item.quantity - 1)}
                                    disabled={item.quantity <= 1} // Prevent decrement below 1
                                >
                                    -
                                </button>
                            </td>
                            <td>${(item.quantity * item.price).toFixed(2)}</td>
                            <td>
                                <button onClick={() => handleRemoveItem(item.computer_id)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="cart-totals">
                <h3>Cart Summary</h3>
                <p>Subtotal: ${totals.subtotal.toFixed(2)}</p>
                <p>Tax: ${totals.tax.toFixed(2)}</p>
                <p>Shipping Fees: ${totals.shippingFees.toFixed(2)}</p>
                <h3>Total: ${totals.total.toFixed(2)}</h3>
                <button onClick={handleCheckout}>Checkout</button>
            </div>
        </div>
    );
};

export default Cart;
