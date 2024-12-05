//TODO, replace local access w backend access


export async function get_computers(search = undefined){
    let computers = await(await fetch('http://localhost:3001/api/computers')).json()
    if ((typeof search === 'string' || search instanceof String)&& search){
        //valid string with stuff in it
        console.log("Search Attempted")
    }
    console.log(computers)
    return computers.computers
}

export async function get_computer_by_id(id) {
    const response = await fetch(`http://localhost:3001/api/computers/${id}`);
    if (!response.ok) {
        console.error(`Failed to fetch computer with ID ${id}: ${response.statusText}`);
        return undefined;
    }
    const computer = await response.json();
    return computer; // Assuming the server responds with a single computer object
}


export function get_image_urls_by_computer_id(id){
    //return url's for all images associated with this computer
    return [""]
}
