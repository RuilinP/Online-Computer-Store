import { createContext } from "react";

//due to react state bullshitery, this can only be modified in react components. So these functions only worry about communication w server
export const user_context = createContext(null);

export class User{
    constructor(token, data, cart) {
        this.token = token;
        this.data = data;
        this.cart = cart;
      }
}

export async function login(email,pass){
    //returns token if sucessfull, or undefined if unsuccessful

    if (!pass){
        return false
    }else{
        return "fake_token"
    }
}

export async function logout(){
    //clearing of user data isn't done here, but you can contact server if you need to
    // return nothing
}

export async function get_user(token){
    //return instance of User class (above) is sucessful undefined otherwise
    if(token){
        let data = (await(await fetch("./user.json")).json).user
        let cart = await(await fetch("./cart.json")).json
        return new User(token, data, cart)
    }else{
        return undefined
    }
}

export async function get_user_data(token){
    //returns user object from backend if successful, undefined otherwise
    if(token){
        return (await(await fetch("./user.json")).json).user
    }else{
        return undefined
    }
}

export async function get_cart(token){

}