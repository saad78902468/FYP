import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
// import { toast } from "react-toastify"; // If using toast for feedback
import burgerImage from "../../Assets/cart-1 (2).jpg";

const CompleteOrder = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const userId = searchParams.get("user_id");
    const addressId = searchParams.get("address_id");

    const [products, setProducts] = useState([]);
    const [address, setAddress] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const shipping = 200;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cartRes, addressRes] = await Promise.all([
                    axios.get(`http://localhost:3005/cart/get-cart/${userId}`),
                    axios.get(`http://localhost:3005/address/get-address/${userId}`)
                ]);

                setProducts(cartRes.data.products);
                setAddress(addressRes.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setIsLoading(false);
            }
        };

        if (userId && addressId) {
            fetchData();
        }
    }, [userId, addressId]);

    const subtotal = products.reduce(
        (total, product) => total + (product.product_ID?.price || 0) * product.quantity,
        0
    );
    const totalAmount = subtotal + shipping;

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleConfirmOrder = async () => {
        const filteredProducts = products
            .filter(p => p.product_ID && p.product_ID._id)
            .map(p => ({
                product_ID: p.product_ID._id,
                quantity: p.quantity
            }));

        const orderData = {
            user_id: userId,
            address_id: addressId,
            products: filteredProducts
        };

        setIsSubmitting(true);
console.log(orderData.user_id)
        try {
            const res = await axios.post("http://localhost:3005/order/create-order", orderData);
            alert("Order confirmed");
            navigate("/orderconfirm");
        } catch (err) {
            console.error("Order error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };



    if (isLoading) return <p className="text-center my-5">Loading...</p>;

    return (
        <div className="py-12 max-w-7xl mx-auto rounded-lg row">
            {/* Address */}
            <div className="col-md-6 bg-white shadow-lg rounded-lg p-4">
                <h5 className="text-xl font-semibold mb-4">Delivery Address</h5>
                {address ? (
                    <div className="p-4 rounded-lg bg-danger bg-opacity-50">
                        <h6 className="font-semibold">Home</h6>
                        <p className="m-0 py-1">
                            {address.house_no}, {address.street}, {address.city}, {address.postcode}
                        </p>
                        <hr />
                        <h6 className="font-semibold">Instruction for Delivery Boy</h6>
                        <p className="m-0 py-1">{address.instructions}</p>
                    </div>
                ) : (
                    <p>No address found.</p>
                )}
            </div>

            {/* Order Summary */}
            <div className="col-md-1"></div>
            <div className="col-md-5 bg-white shadow-lg rounded-lg p-4">
                <h5 className="text-xl font-semibold mb-4">Order Summary</h5>
                <ul className="overflow-auto" style={{ maxHeight: "300px" }}>
                    {products.map((product) => (
                        <li key={product._id} className="d-flex justify-content-between align-items-center mb-2">
                            <div className="d-flex align-items-center">
                                <img
                                    className="w-20 h-20 object-cover rounded-md me-3"
                                    src={burgerImage}
                                    alt={product.product_ID?.name}
                                />
                                <div>
                                    <h6 className="fw-medium">{product.product_ID?.name}</h6>
                                    <p className="text-muted m-0">Quantity: {product.quantity}</p>
                                </div>
                            </div>
                            <h6 className="fw-bold">Rs. {product.product_ID?.price * product.quantity}</h6>
                        </li>
                    ))}
                </ul>
                <div className="border-top pt-3">
                    <div className="d-flex justify-content-between">
                        <p className="fw-medium">Subtotal</p>
                        <p>Rs. {subtotal}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <p className="fw-medium">Service Charge</p>
                        <p>Rs. {shipping}</p>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between fw-bold">
                        <p>Total</p>
                        <p>Rs. {totalAmount}</p>
                    </div>
                </div>

                <button
                    className="btn btn-danger w-100 mt-4"
                    onClick={handleConfirmOrder}
                    disabled={isSubmitting} // Disable when submitting
                >
                    {isSubmitting ? "Please Wait..." : "Confirm Order"}
                </button>

            </div>
        </div>
    );
};

export default CompleteOrder;