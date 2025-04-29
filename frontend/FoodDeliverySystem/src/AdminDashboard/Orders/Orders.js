import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [show, setShow] = useState(false);
    const [selectedOrderData, setSelectedOrderData] = useState({});
    const [expandedRow, setExpandedRow] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterOption, setFilterOption] = useState("");

    // ✅ Fetch real orders
    useEffect(() => {
        axios.get("http://localhost:3005/order/get-orders-list") // Replace with your real API
            .then(res => {
                const processedOrders = res.data.map(order => {
                    const total = order.products.reduce((sum, p) => {
                        if (p.product_ID && p.product_ID.price) {
                            return sum + p.product_ID.price * p.quantity;
                        }
                        return sum;
                    }, 0);
                    return {
                        ...order,
                        price: total,
                        total_with_tip: total, // If you have tip logic, update here
                        instructions: order.address_id?.instructions || ""
                    };
                });
                setOrders(processedOrders);
            })
            .catch(err => {
                console.error("Error fetching orders:", err);
                alert("Failed to fetch orders");
            });
    }, []);

    const handleShow = (order) => {
        setSelectedOrderData(order);
        setShow(true);
    };

    const handleClose = () => setShow(false);

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text("INVOICE", 105, 20, { align: "center" });

        doc.setFontSize(12);
        doc.text(`Order ID: ${selectedOrderData._id}`, 20, 40);
        doc.text(`Total: $${selectedOrderData.price}`, 20, 50);
        doc.text(`Total With Tip: $${selectedOrderData.total_with_tip}`, 20, 60);

        const tableColumn = ["Product Name", "Quantity"];
        const tableRows = selectedOrderData.products.map((product) => [
            product.product_ID?.name || "Deleted Product",
            product.quantity,
        ]);

        doc.autoTable({
            startY: 80,
            head: [tableColumn],
            body: tableRows,
            theme: "grid",
        });

        doc.text("Thank you for your order!", 105, doc.lastAutoTable.finalY + 10, { align: "center" });
        doc.save(`${selectedOrderData._id}.pdf`);
    };

    const handleToggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    const filteredOrders = orders.filter((order) => {
        if (!searchTerm) return true;
        if (filterOption === "city") {
            return order.address_id?.city?.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return true;
    });

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="md:p-5 md:mx-5 p-1 bg-black text-yellow-400 shadow-lg rounded-lg md:mt-0" style={{ marginTop: "100px" }}>
        <h2 className="text-yellow-400 font-bold text-xl mb-4">Orders List</h2>
    
        <div className="bg-black shadow-lg p-3 rounded overflow-auto md:overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead className="bg-yellow-400 text-black">
                    <tr>
                        <th className="p-3">Select</th>
                        <th className="p-3">Order ID</th>
                        <th className="p-3">City</th>
                        <th className="p-3">Total</th>
                        <th className="p-3">Total with Tip</th>
                        <th className="p-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentOrders.map((order) => (
                        <React.Fragment key={order._id}>
                            <tr className="hover:bg-yellow-900 border-b border-yellow-700">
                                <td className="p-3">
                                    <button
                                        className="text-yellow-400 font-bold"
                                        onClick={() => handleToggleRow(order._id)}
                                    >
                                        {expandedRow === order._id ? "-" : "+"}
                                    </button>
                                </td>
                                <td className="p-3">{order._id}</td>
                                <td className="p-3">{order.address_id?.city || "N/A"}</td>
                                <td className="p-3">${order.price}</td>
                                <td className="p-3">${order.total_with_tip}</td>
                                <td className="p-3 text-right">
                                    <i
                                        className="fas fa-file-download text-yellow-300 cursor-pointer mr-3"
                                        onClick={() => handleShow(order)}
                                    ></i>
                                </td>
                            </tr>
    
                            {expandedRow === order._id && (
                                <>
                                    <tr>
                                        <td colSpan="1"><b>Address</b></td>
                                        <td colSpan="5">
                                            <p>
                                                {order.address_id?.house_no && `House No: ${order.address_id.house_no}, `}
                                                {order.address_id?.street && `Street: ${order.address_id.street}, `}
                                                {order.address_id?.city && `City: ${order.address_id.city}`}
                                            </p>
                                        </td>
                                    </tr>
    
                                    <tr>
                                        <td colSpan="1"><b>INSTRUCTIONS</b></td>
                                        <td colSpan="5"><p>{order.instructions || "None"}</p></td>
                                    </tr>
    
                                    <tr>
                                        <td colSpan="6">
                                            <table className="table w-full text-yellow-400">
                                                <thead className="bg-yellow-400 text-black">
                                                    <tr>
                                                        <th>Product Name</th>
                                                        <th>Quantity</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {order.products.map((product, index) => (
                                                        <tr key={index} className="border-b border-yellow-600">
                                                            <td>{product.product_ID?.name || "Deleted Product"}</td>
                                                            <td>{product.quantity}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    
        <div className="flex justify-between mt-5">
            <button
                className="bg-yellow-400 text-black py-2 px-4 rounded hover:bg-yellow-500"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Previous
            </button>
            <button
                className="bg-yellow-400 text-black py-2 px-4 rounded hover:bg-yellow-500"
                onClick={() => paginate(currentPage + 1)}
                disabled={indexOfLastOrder >= filteredOrders.length}
            >
                Next
            </button>
        </div>
    
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton className="bg-dark text-yellow-400">
                <Modal.Title>Download Invoice</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-black text-yellow-400">
                Are you sure you want to download the invoice?
            </Modal.Body>
            <Modal.Footer className="bg-dark">
                <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button variant="warning" onClick={() => { handleDownloadPDF(); handleClose(); }}>
                    Download
                </Button>
            </Modal.Footer>
        </Modal>
    </div>
    
    );
    
}