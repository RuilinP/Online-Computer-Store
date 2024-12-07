import React, { createContext, useState, useEffect } from "react";
import { get_cart } from "./cart_model";


export const user_context = createContext();

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            fetch("https://computers.ruilin.moe/api/users/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    const loggedInUser = data.users.find(
                        (user) => user.email === "rpeng25@uwo.ca" // Replace with dynamic logic
                    );
                    if (loggedInUser) {
                        setUser(loggedInUser);
                    }
                })
                .catch((error) => console.error("Error restoring user context:", error));
        }
    }, []);

    return (
        <user_context.Provider value={{ user, setUser }}>
            {children}
        </user_context.Provider>
    );
};

export class User {
    constructor(token, data, cart) {
        this.token = token;
        this.data = data;
        this.cart = cart;
    }
}

export async function register(name, phone, email, address, password, role = "buyer") {
    try {
        const response = await fetch("https://computers.ruilin.moe/api/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                phone,
                email,
                address,
                password,
                role,
            }),
        });

        console.log(JSON.stringify({
            name,
            phone,
            email,
            address,
            password,
            role,
        }));

        if (response.ok) {
            const data = await response.json();
            return true;
        } else {
            const error = await response.json();
            return error.message || "Registration failed";
        }
    } catch (error) {
        console.error("Error during registration:", error);
        return "An error occurred while registering.";
    }
}


export async function login(email, pass) {
    //returns token if sucessfull, or undefined if unsuccessful
    if (!email || !pass) {
        return undefined;
    }
    try {
        const response = await fetch("https://computers.ruilin.moe/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password: pass }),
        });

        if (response.ok) {
            const data = await response.json();
            return data.token;
        } else {
            console.error("Login failed:", response.statusText);
            return undefined;
        }
    } catch (error) {
        console.error("Error during login:", error);
        return undefined;
    }
}

export async function logout() {
    //clearing of user data isn't done here, but you can contact server if you need to
    // return nothing
}

export async function get_user(token, userId) {

    if (!token || !userId) {
        return undefined;
    }

    try {
        const response = await fetch(`https://computers.ruilin.moe/api/users/${userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            const cart = await get_cart();
            return new User(token, data, cart);
        } else {
            console.error("Failed to fetch user data:", response.statusText);
            return undefined;
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        return undefined;
    }
}


export async function get_user_data(token) {
    //returns user object from backend if successful, undefined otherwise
    if (token) {
        return (await (await fetch("./user.json")).json()).user
    } else {
        return undefined
    }
}
