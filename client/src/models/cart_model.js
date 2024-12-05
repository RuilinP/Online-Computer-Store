export function add_item_to_cart(id, quantity = 1){
    console.log("Click")
    //TODO 
}

export async function get_cart(token){
    return await(await fetch("./cart.json")).json()
}