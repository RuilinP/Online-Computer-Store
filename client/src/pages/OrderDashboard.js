import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./OrderDashboard.css";

const OrderDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("authToken");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch("https://computers.ruilin.moe/api/orders", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch orders");
                }
                const data = await response.json();
                setOrders(data.orders);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token]);

    const handleStatusChange = async (order_id, newStatus) => {
        try {
            const response = await fetch(`https://computers.ruilin.moe/api/orders/${order_id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ order_status: newStatus }),
            });
            if (!response.ok) {
                throw new Error("Failed to update order status");
            }
            const updatedOrder = await response.json();
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.order_id === order_id ? updatedOrder.order : order
                )
            );
            alert("Order status updated successfully.");
        } catch (err) {
            alert(err.message || "Failed to update order status.");
        }
    };

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="order-dashboard">
            <h2>Order Dashboard</h2>
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>User</th>
                        <th>Total Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.order_id}>
                            <td>{order.order_id}</td>
                            <td>{order.user_id}</td>
                            <td>${order.total_price.toFixed(2)}</td>
                            <td>{order.order_status}</td>
                            <td>
                                <select
                                    value={order.order_status}
                                    onChange={(e) =>
                                        handleStatusChange(order.order_id, e.target.value)
                                    }
                                >
                                    <option value="pending">Pending</option>
                                    <option value="completed">Completed</option>
                                    <option value="canceled">Canceled</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderDashboard;
