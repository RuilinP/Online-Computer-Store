import { get_computers } from '../models/computers_model';
import { add_item_to_cart } from '../models/cart_model';
import { useState, useEffect } from 'react';
import { user_context } from '../models/user_model';
import { useContext } from 'react';
import "./Computers/Computers.css";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

function Computers() {
    let search = useParams()?.search || "";
    const { user } = useContext(user_context);

    const [data, setData] = useState();
    const [sort, setSort] = useState("");
    const [filter, setFilter] = useState({}); // Example: { category: "Laptop", price: [0, 1000] }

    const handleAddToCart = (id) => {
        if (!user) {
            alert("Please log in to add items to your cart.");
            return;
        }
        add_item_to_cart(user.token, id);
        alert("Added to cart.");
    };

    const fetchData = async () => {
        try {
            const params = {
                search,
                sort,
                filter: JSON.stringify(filter),
            };
            const result = await get_computers(params);
            setData(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSortChange = (e) => {
        setSort(e.target.value);
    };

    const handleFilterChange = (key, value) => {
        setFilter((prev) => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        fetchData();
    }, [search, sort, filter]);

    if (!data) {
        return <p>Loading...</p>;
    }

    const elements = data.map((computer) => {
        const id = computer.computer_id;
        const img_url = computer.images?.length
            ? `https://computers.ruilin.moe${computer.images[0].image_path}`
            : 'assets/default_image.png';
        return (
            <div className="product_tile" key={id}>
                <img src={img_url} alt="Product Image" />
                <Link to={`/computers/${id}`}>
                    <h2>{computer.name}</h2>
                </Link>
                <p>${computer.price.toFixed(2)} CAD</p>
                <button onClick={() => handleAddToCart(id)}>
                    Add To Cart
                    <img src="assets/shopping_cart_icon.svg" alt="Cart Icon" />
                </button>
            </div>
        );
    });

    return (
        <div>
            <div className="controls">
                <div>
                    <label>Sort By:</label>
                    <select onChange={handleSortChange}>
                        <option value="">None</option>
                        <option value="price:asc">Price: Low to High</option>
                        <option value="price:desc">Price: High to Low</option>
                        <option value="releaseDate:asc">Release Date: Oldest</option>
                        <option value="releaseDate:desc">Release Date: Newest</option>
                    </select>
                </div>
                <div>
                    <label>Category:</label>
                    <input
                        type="text"
                        placeholder="Enter category"
                        onChange={(e) => handleFilterChange("category", e.target.value)}
                    />
                </div>
                <div>
                    <label>Price Range:</label>
                    <input
                        type="number"
                        placeholder="Min"
                        onChange={(e) => handleFilterChange("price", [e.target.value, filter.price?.[1]])}
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        onChange={(e) => handleFilterChange("price", [filter.price?.[0], e.target.value])}
                    />
                </div>
            </div>
            <div className="display_area">{elements}</div>
        </div>
    );
}

export default Computers;
