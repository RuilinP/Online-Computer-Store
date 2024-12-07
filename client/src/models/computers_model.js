//TODO, replace local access w backend access
import axios from "axios";

export const create_computer = async (formData) => {
    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
    };

    for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }

    const response = await axios.post(
        "https://computers.ruilin.moe/api/computers/",
        formData,
        config
    );
    return response.data;
};


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


export function get_image_urls_by_computer_id(id) {
    //return url's for all images associated with this computer
    return [""]
}

export const update_computer = async (id, formData) => {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            throw new Error("User is not authenticated. No token found.");
        }

        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        const response = await fetch(`https://computers.ruilin.moe/api/computers/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Error updating computer: ${response.statusText}`);
        }

        const data = await response.json();
        return data.computer;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
