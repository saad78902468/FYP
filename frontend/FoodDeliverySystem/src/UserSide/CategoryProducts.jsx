import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCartPlus } from 'react-icons/fa';
import Cart from './Cart/Cart';
import { Button } from "react-bootstrap";
import {jwtDecode} from "jwt-decode";

const CategoryProducts = () => {
    const [productsByCategory, setProductsByCategory] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [showCart, setShowCart] = useState(false);

    // ✅ Fetch Products
    useEffect(() => {
        axios.get('http://localhost:3005/products')
            .then(response => {
                const grouped = response.data.reduce((acc, product) => {
                    const existing = acc.find(c => c.category === product.category);
                    const newProduct = {
                        name: product.name,
                        price: product.price,
                        _id: product._id,
                        image: product.image,
                        description: product.description,
                    };
                    if (existing) {
                        existing.products.push(newProduct);
                    } else {
                        acc.push({ category: product.category, products: [newProduct] });
                    }
                    return acc;
                }, []);
                setProductsByCategory(grouped);

                // ✅ Initialize quantity state for each product
                const initialQuantities = {};
                response.data.forEach(product => {
                    initialQuantities[product._id] = 1;
                });
                setQuantities(initialQuantities);
            })
            .catch(error => {
                console.error("Error fetching products:", error);
            });
    }, []);

    const toggleCartCanvas = () => {
        setShowCart(!showCart);
    };

    const handleAddToBasket = async (product) => {
        try {
            const token = localStorage.getItem("FoodCustomerToken");
            if (!token) {
                alert("Please login to add items to your basket.");
                return;
            }
    
            // Decode token to get userId
            const decoded = jwtDecode(token);
            const userId = decoded.userId || decoded._id || decoded.id; // Adjust depending on your token payload
    console.log(userId)
            const payload = {
                product_id: product._id,
                userId: userId,
                quantity: quantities[product._id],
            };
    
            // Send POST request to add-to-cart API
            const res = await axios.post('http://localhost:3005/cart/add-Prouct-to-cart', payload);
    
            if (res.status === 200 || res.status === 201) {
                alert(`${product.name} added to basket successfully!`);
            } else {
                alert("Failed to add to basket.");
            }
        } catch (error) {
            console.error("Error adding to basket:", error);
            alert("An error occurred while adding to basket.");
        }
    };
    

    const increaseQuantity = (productId) => {
        setQuantities(prev => ({
            ...prev,
            [productId]: prev[productId] + 1
        }));
    };

    const decreaseQuantity = (productId) => {
        setQuantities(prev => ({
            ...prev,
            [productId]: prev[productId] > 1 ? prev[productId] - 1 : 1
        }));
    };

    const handleCategoryChange = (event) => {
        const selectedCategory = event.target.value;
        const section = document.getElementById(selectedCategory);
        if (section) section.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="container-fluid" style={{ backgroundColor: "#121212", color: "#fff" }}>
            <div className="row">
                {/* Sidebar */}
                <div className="col-md-12 bg-dark text-light shadow p-3">
                    <h5 className="mb-3 text-warning">Categories</h5>

                    <div className="flex  gap-3">
                        <select
                            className="form-select"
                            style={{ backgroundColor: "#333", color: "#fff", borderColor: "#FFD700" }}
                            onChange={handleCategoryChange}
                        >
                            <option value="">Select Category</option>
                            {productsByCategory.map(({ category }) => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>

                        <button
                            className="btn btn-warning d-flex align-items-center justify-content-center gap-2"
                            onClick={toggleCartCanvas}
                            style={{textWrap:"nowrap"}}
                        >
                            <FaCartPlus /> View Cart
                        </button>
                    </div>
                </div>

                {/* Products */}
                <div className="col-md-12 ">
                    {productsByCategory.map(({ category, products }) => (
                        <div key={category} id={category} >
                            <h3 className="text-capitalize text-3xl mt-4 mb-3 " style={{ color: "#FFD700" }}>{category}</h3>
                            <div className="row ">
                                {products.map(product => (
                                    <div key={product._id} className="col-md-3 mb-4">
                                        <div
                                            className="card h-100"
                                            style={{
                                                border: "1px solid #FFD700",
                                                backgroundColor: "#222",
                                                color: "#fff",
                                                borderRadius: "12px",
                                                boxShadow: "0 4px 20px rgba(255, 215, 0, 0.1)",
                                                transition: "transform 0.3s"
                                            }}
                                        >
                                            <img
                                                src={`http://localhost:3005/${product.image}`}
                                                className="card-img-top"
                                                alt={product.name}
                                                style={{ height: '200px', objectFit: 'cover', borderTopLeftRadius: "12px", borderTopRightRadius: "12px" }}
                                            />
                                            <div className="card-body d-flex flex-column">
                                                <h5 className="card-title text-warning">{product.name}</h5>
                                                <p className="card-text text-light" style={{ fontSize: "14px" }}>{product.description}</p>
                                                <h6 className="text-warning">Rs. {product.price}</h6>
                                                <div className="d-flex align-items-center mb-2 mt-2">
                                                    <button className="btn btn-outline-warning btn-sm" onClick={() => decreaseQuantity(product._id)}>-</button>
                                                    <span className="mx-3">{quantities[product._id]}</span>
                                                    <button className="btn btn-outline-warning btn-sm" onClick={() => increaseQuantity(product._id)}>+</button>
                                                </div>
                                                <Button variant="warning" onClick={() => handleAddToBasket(product)} className="mt-auto">
                                                    Add to Basket
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cart Component */}
            <Cart showCart={showCart} toggleCartCanvas={toggleCartCanvas} />
        </div>
    );
};

export default CategoryProducts;