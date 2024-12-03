//TODO, replace local access w backend access


export async function get_computers(search = null){
    let computers = await(await fetch('./computers.json')).json()
    if (!!search){
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

    return null
    //TODO, replace with server call
}