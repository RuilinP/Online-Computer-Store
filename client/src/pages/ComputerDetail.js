import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { get_computer_by_id } from "../models/computers_model";
import "./Computers/ComputerDetail.css";

function ComputerDetail() {
    const { id } = useParams(); // Get computer ID from the route params
    const [computer, setComputer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComputerDetails = async () => {
            try {
                const response = await get_computer_by_id(id);
                if (response.computer) {
                    setComputer(response.computer);
                } else {
                    console.error("Computer not found");
                }
            } catch (error) {
                console.error("Error fetching computer details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchComputerDetails();
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!computer) {
        return <p>Computer not found.</p>;
    }

    return (
        <div className="computer-detail">
            <div id="content">
                <div className="carousel">
                    {computer.images.map((image) => (
                        <img
                            key={image.image_id}
                            src={`https://computers.ruilin.moe${image.image_path}`}
                            alt={`${computer.name}`}
                        />
                    ))}
                </div>
                <div className="description">
                    <h1 id="title">{computer.name}</h1>
                    <p>Model: {computer.model}</p>
                    <p>Category: {computer.category}</p>
                    <p>Address: {computer.address}</p>
                    <p>
                        ★★★★☆ {computer.popularity ? (computer.popularity / 20).toFixed(1) : "N/A"} ({computer.popularity ? `${computer.popularity} Reviews` : "No Reviews Yet"})
                    </p>
                    <p>Manufacturer: {computer.manufacturer}</p>
                    <p>Release Date: {new Date(computer.releaseDate).toDateString()}</p>
                    <p>Price: <span id="price">${computer.price.toFixed(2)} USD (tax)</span></p>
                    <p>This product is sold and shipped by <a href="#">Alumni House</a>.</p>
                </div>
                <div className="buy">
                    <button className="buttonb">Buy now</button>
                    <button className="buttona">Add to cart</button>
                </div>
            </div>
    
            <div id="specifications">
                <h2>Specifications</h2>
                <ul>
                    {computer.specification.split(", ").map((spec, index) => (
                        <li key={index}>{spec}</li>
                    ))}
                </ul>
            </div>
    
            <div id="details">
                <h2>Additional Details</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Product ID</th>
                            <td>{computer.stockCode}</td>
                        </tr>
                        <tr>
                            <th>Category</th>
                            <td>
                                <a href="#">{computer.category}</a>
                            </td>
                        </tr>
                        <tr>
                            <th>Address</th>
                            <td>{computer.address}</td>
                        </tr>
                        <tr>
                            <th>Manufacturer</th>
                            <td>{computer.manufacturer}</td>
                        </tr>
                        <tr>
                            <th>Release Date</th>
                            <td>{new Date(computer.releaseDate).toDateString()}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
    
            <div id="content2">
                <h2>Details</h2>
                <p>This product is sold assuming the above conditions. We cannot accept any questions, returns, or complaints, so please be aware of this before purchasing.</p>
            </div>
    
            <div className="footer">
                <p>
                    <a href="#"><span>About us</span></a>
                    <a href="#"><span>Privacy policy</span></a>
                    <a href="#"><span>FAQ</span></a>
                    <a href="#"><span>Shipping</span></a>
                </p>
                <p className="copyright">© 2000-2024 Ruilin Tech Inc.</p>
                <h1>RuilinTech</h1>
            </div>
        </div>
    );
    
}

export default ComputerDetail;
