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
        <div>
            

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
                    <p id="title">{computer.name}</p>
                    <p>★★★★☆ {computer.popularity / 20} ({computer.popularity} Reviews)</p>
                    <p>This product is sold and shipped by <a href="#">Alumni House</a>.</p>
                    <p>New <span id="price">${computer.price.toFixed(2)} USD (tax)</span></p>
                </div>
                <div className="buy">
                    <button className="buttonb">Buy now</button>
                    <button className="buttona">Add to cart</button>
                </div>
            </div>

            <table>
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
            </table>

            <div id="content2">
                <p><span>Details</span></p>
                <p>This product is sold assuming the above conditions. We cannot accept any questions, returns, or complaints, so please be aware of this before purchasing.</p>
                <p>Specification:</p>
                <ul>
                    {computer.specification.split(", ").map((spec, index) => (
                        <li key={index}>{spec}</li>
                    ))}
                </ul>
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
