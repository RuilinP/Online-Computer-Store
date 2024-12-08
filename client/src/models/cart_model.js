export async function add_item_to_cart(token, computer_id, quantity = 1) {
    try {
        const response = await fetch("https://computers.ruilin.moe/api/carts/addItem", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ computer_id, quantity }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to add item to cart.");
        }

        return await response.json();
    } catch (error) {
        console.error("Error adding item to cart:", error);
        throw error;
    }
}



export async function get_cart(token) {
    try {
        const response = await fetch("https://computers.ruilin.moe/api/carts/view", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch cart.");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching cart:", error);
        throw error;
    }
}


export async function update_cart(token, items) {
    try {
        const response = await fetch("https://computers.ruilin.moe/api/carts/update", {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ items }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to update cart.");
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating cart:", error);
        throw error;
    }
}



export async function remove_item(token, computer_id) {
    try {
        const response = await fetch("https://computers.ruilin.moe/api/carts/removeItem", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ computer_id }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to remove item.");
        }

        return await response.json();
    } catch (error) {
        console.error("Error removing item:", error);
        throw error;
    }
}


export async function checkout(token) {
    // checkout, return resultant cart or string w error message
    return await (await fetch("./cart.json")).json()
}

export async function clear_cart(token) {
    try {
        const response = await fetch("https://computers.ruilin.moe/api/carts/clear", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to clear cart.");
        }

        return await response.json();
    } catch (error) {
        console.error("Error clearing cart:", error);
        throw error;
    }
}
