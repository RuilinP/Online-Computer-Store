import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("authToken");
    const navigate = useNavigate();
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        const fetchOrdersAndUsers = async () => {
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

                const userPromises = data.orders.map((order) =>
                    fetch(`https://computers.ruilin.moe/api/users/${order.user_id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }).then((res) => res.json())
                );
                const userDetails = await Promise.all(userPromises);
                const userMap = {};
                userDetails.forEach((user) => {
                    userMap[user.user.id] = user.user; 
                });
                setUsers(userMap);

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchOrdersAndUsers();
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

    const toggleOrderDetails = (order_id) => {
        setExpandedOrder((prev) => (prev === order_id ? null : order_id));
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
                        <th>User Info</th>
                        <th>Total Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <>
                            <tr key={order.order_id}>
                                <td>{order.order_id}</td>
                                <td>
                                    {users[order.user_id] ? (
                                        <>
                                            <p>Name: {users[order.user_id].name}</p>
                                            <p>Email: {users[order.user_id].email}</p>
                                            <p>Phone: {users[order.user_id].phone}</p>
                                            <p>Address: {users[order.user_id].address}</p>
                                            <p>Order Created At: {new Date(order.createdAt).toLocaleString()}</p>
                                        </>
                                    ) : (
                                        "Loading user info..."
                                    )}
                                </td>
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
                                    <button onClick={() => toggleOrderDetails(order.order_id)}>
                                        {expandedOrder === order.order_id ? "Hide Details" : "Show Details"}
                                    </button>
                                </td>
                            </tr>
                            {expandedOrder === order.order_id && (
                                <tr>
                                    <td colSpan="5">
                                        <div className="order-details">
                                            <h4>Order Items</h4>
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Item Name</th>
                                                        <th>Price</th>
                                                        <th>Quantity</th>
                                                        <th>Subtotal</th>
                                                        <th>Stock</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {order.items.map((item) => (
                                                        <tr key={item.order_item_id}>
                                                            <td>{item.computer.name}</td>
                                                            <td>${item.price.toFixed(2)}</td>
                                                            <td>{item.quantity}</td>
                                                            <td>${(item.price * item.quantity).toFixed(2)}</td>
                                                            <td>{item.computer.stock}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderDashboard;
