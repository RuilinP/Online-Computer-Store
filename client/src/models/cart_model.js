export function add_item_to_cart(token, id, quantity = 1){
    console.log("Click")
    //TODO 
}

export async function get_cart(token){
    return await(await fetch("./cart.json")).json()
}

export async function update_cart(token, computer_id, quantity){
    return await(await fetch("./cart.json")).json()
    //return resultant cart or string containing error
}

export async function clear_cart(token){
    // clear the users active cart and return resultant cart

    return await(await fetch("./cart.json")).json()
}

export async function remove_item(token, computer_id){
    // remove item from active cart, return resultant cart
    return await(await fetch("./cart.json")).json()
}

export async function checkout(token){
    // checkout, return resultant cart or string w error message
    return await(await fetch("./cart.json")).json()
}