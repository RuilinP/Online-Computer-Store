//TODO, replace local access w backend access


export const get_computers = async (params) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `https://computers.ruilin.moe/api/computers?${queryString}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching computers: ${response.statusText}`);
        }
        const data = await response.json();
        return data.computers;
    } catch (error) {
        console.error(error);
        return [];
    }
};


export async function get_computer_by_id(id) {
    const response = await fetch(`https://computers.ruilin.moe/api/computers/${id}`);
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
