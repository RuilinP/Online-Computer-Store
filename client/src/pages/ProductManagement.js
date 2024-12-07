import { useState, useEffect } from "react";
import { get_computers, update_computer, create_computer, delete_computer } from "../models/computers_model";
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

    const handleCreateNew = () => {
        setSelectedComputer({
            model: "",
            name: "",
            category: "",
            address: "",
            specification: "",
            manufacturer: "",
            releaseDate: "",
            price: "",
        });
    };

    const handleDeleteComputer = async () => {
        if (!selectedComputer || !selectedComputer.computer_id) {
            alert("No product selected to delete!");
            return;
        }
    
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }
    
        try {
            await delete_computer(selectedComputer.computer_id);
            alert("Computer deleted successfully!");
            fetchComputers();
            setSelectedComputer(null);
        } catch (error) {
            console.error("Error deleting computer:", error);
            alert("Failed to delete the computer.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedComputer((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();

            const excludedFields = ["popularity"];
            Object.keys(selectedComputer).forEach((key) => {
                if (!excludedFields.includes(key)) {
                    formData.append(key, selectedComputer[key]);
                }
            });

            const fileInput = e.target.elements.images;
            if (fileInput?.files.length > 0) {
                Array.from(fileInput.files).forEach((file) => {
                    formData.append("images", file);
                });
            }

            if (selectedComputer.computer_id) {
                await update_computer(selectedComputer.computer_id, formData);
                alert("Computer updated successfully!");
            } else {
                await create_computer(formData);
                alert("New computer created successfully!");
            }

            fetchComputers();
            setSelectedComputer(null);
        } catch (error) {
            console.error("Error submitting computer:", error);
            alert("Failed to submit the computer.");
        }
    };

    useEffect(() => {
        fetchComputers();
    }, []);

    return (
        <div className="product-manager">
            <div className="product-list">
                <h2>Products</h2>
                <button onClick={handleCreateNew}>+ New Computer</button>
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
                <h2>{selectedComputer?.computer_id ? "Update Product" : "Create New Product"}</h2>
                {selectedComputer ? (
                    <form onSubmit={handleSubmit}>
                        <label>
                            Model:
                            <input
                                type="text"
                                name="model"
                                value={selectedComputer.model}
                                onChange={handleInputChange}
                            />
                        </label>
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
                            Address:
                            <input
                                type="text"
                                name="address"
                                value={selectedComputer.address}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Specification:
                            <textarea
                                name="specification"
                                value={selectedComputer.specification}
                                onChange={handleInputChange}
                            ></textarea>
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
                                value={selectedComputer.releaseDate ? selectedComputer.releaseDate.split("T")[0] : ""}
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
                             Stock:
                        <input
                                type="number"
                        name="stock"
                        value={selectedComputer.stock || ""}
                        onChange={handleInputChange}
                        />
                        </label>

                        <label>
                            Images:
                            <input type="file" name="images" multiple />
                        </label>
                        <button type="submit">
                            {selectedComputer.computer_id ? "Update" : "Create"}
                        </button>
                        {selectedComputer?.computer_id && (
                        <button
                            type="button"
                            onClick={handleDeleteComputer}
                            style={{ backgroundColor: "red", color: "white", marginTop: "10px" }}>
                            Delete Product
                        </button>
)}

                    </form>
                ) : (
                    <p>Select a product or click "New Computer" to get started.</p>
                )}
            </div>
        </div>
    );
}

export default ProductManager;
