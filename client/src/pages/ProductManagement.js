import { useState, useEffect } from "react";
import { get_computers, update_computer } from "../models/computers_model";
import "./ProductManager.css";

function ProductManager() {
    const [computers, setComputers] = useState([]);
    const [selectedComputer, setSelectedComputer] = useState(null);

    const fetchComputers = async () => {
        try {
            const result = await get_computers();
            setComputers(result);
        } catch (error) {
            console.error("Error fetching computers:", error);
        }
    };

    const handleSelectComputer = (computer) => {
        setSelectedComputer(computer);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedComputer((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
    
            const excludedFields = ["stock", "popularity"];
    
            Object.keys(selectedComputer).forEach((key) => {
                if (!excludedFields.includes(key) && selectedComputer[key] !== undefined && selectedComputer[key] !== null) {
                    formData.append(key, selectedComputer[key]);
                }
            });
    
            const fileInput = e.target.elements.images;
            if (fileInput?.files.length > 0) {
                Array.from(fileInput.files).forEach((file) => {
                    formData.append("images", file);
                });
            }
    
            console.log("FormData before PUT:");
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }
    
            const result = await update_computer(selectedComputer.computer_id, formData);
            alert("Computer updated successfully!");
            fetchComputers();
        } catch (error) {
            console.error("Error updating computer:", error);
            alert("Failed to update the computer.");
        }
    };
    
    

    useEffect(() => {
        fetchComputers();
    }, []);

    return (
        <div className="product-manager">
            <div className="product-list">
                <h2>Products</h2>
                {computers.map((computer) => (
                    <div
                        key={computer.computer_id}
                        className={`product-item ${selectedComputer?.computer_id === computer.computer_id ? "selected" : ""}`}
                        onClick={() => handleSelectComputer(computer)}
                    >
                        <h3>{computer.name}</h3>
                        <p>${computer.price.toFixed(2)}</p>
                    </div>
                ))}
            </div>
            <div className="product-form">
                <h2>Update Product</h2>
                {selectedComputer ? (
                    <form onSubmit={handleSubmit}>
                        <label>
                            Name:
                            <input
                                type="text"
                                name="name"
                                value={selectedComputer.name}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Category:
                            <input
                                type="text"
                                name="category"
                                value={selectedComputer.category}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Price:
                            <input
                                type="number"
                                name="price"
                                value={selectedComputer.price}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Address:
                            <input
                                type="text"
                                name="address"
                                value={selectedComputer.address}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Manufacturer:
                            <input
                                type="text"
                                name="manufacturer"
                                value={selectedComputer.manufacturer}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Release Date:
                            <input
                                type="date"
                                name="releaseDate"
                                value={selectedComputer.releaseDate.split("T")[0]}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Images:
                            <input type="file" name="images" multiple />
                        </label>
                        <button type="submit">Update</button>
                    </form>
                ) : (
                    <p>Select a product to update.</p>
                )}
            </div>
        </div>
    );
}

export default ProductManager;
