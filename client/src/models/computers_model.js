//TODO, replace local access w backend access


export async function get_computers(search = undefined){
    let computers = await(await fetch('./computers.json')).json()
    if ((typeof search === 'string' || search instanceof String)&& search){
        //valid string with stuff in it
        console.log("Search Attempted")
    }
    console.log(computers)
    return computers.computers
}

export async function get_computer_by_id(id){
    let computers = (await(await fetch('./computers.json')).json()).computers
    for (const computer of computers){
        if (computer.computer_id === id){
            return computer
        }
    }

    return undefined
    //TODO, replace with server call
}

export function get_image_urls_by_computer_id(id){
    //return url's for all images associated with this computer
    return [""]
}
