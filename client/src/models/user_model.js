import { createContext } from "react";
import { get_cart } from "./cart_model";

//due to react state bullshitery, this can only be modified in react components. So these functions only worry about communication w server
export const user_context = createContext(null);

export class User{
    constructor(token, data, cart) {
        this.token = token;
        this.data = data;
        this.cart = cart;
      }
}

export async function register(name,phone,email,address,password){
    //return true or error string
    return true
}

export async function login(email,pass){
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

export async function logout(){
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


export async function get_user_data(token){
    //returns user object from backend if successful, undefined otherwise
    if(token){
        return (await(await fetch("./user.json")).json()).user
    }else{
        return undefined
    }
}

