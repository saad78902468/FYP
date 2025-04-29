import React, { useState, useEffect } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import burgerImage from "../../Assets/cart-1 (2).jpg";
import burgerImage3 from "../../Assets/cart-1 (3).jpg";

const Cart = ({ showCart, toggleCartCanvas }) => {
  const [open, setOpen] = useState(true);
  const [cartProducts, setCartProducts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("FoodCustomerToken");
        if (!token) return;

        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const response = await axios.get(`http://localhost:3005/cart/get-cart/${userId}`);
        const cartData = response.data;

        setCartProducts(cartData.products || []);
        setTotalAmount(cartData.sub_total || 0);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    if (showCart) {
      fetchCart();
    }
  }, [showCart]);

  if (!showCart) return null;

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-gray-900/75" />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel className="w-screen max-w-md bg-white shadow-xl rounded-l-lg">
              <div className="flex flex-col h-full overflow-y-auto">
                <div className="p-6 bg-red-500 text-white flex justify-between items-center">
                  <DialogTitle className="text-lg font-semibold">Your Cart</DialogTitle>
                  <button onClick={toggleCartCanvas} className="text-white hover:text-gray-200">
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <ul className="divide-y divide-gray-200">
                    {cartProducts.map((item) => (
                      <li key={item._id} className="flex py-4 items-center">
                        <img
                          src={burgerImage}
                          alt={item.product_ID?.name}
                          className="w-16 h-16 rounded-lg border"
                        />
                        <div className="ml-4 flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{item.product_ID?.name}</h3>
                          <p className="text-sm text-gray-600">{item.product_ID?.category}</p>
                          <p className="font-semibold text-red-500">${item.product_ID?.price} x {item.quantity}</p>
                        </div>
                        {/* <button className="text-sm text-red-500 font-semibold hover:text-red-700">Remove</button> */}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6 border-t border-gray-200">
                  <div className="flex justify-between text-lg font-semibold">
                    <p>Total</p>
                    <p>${totalAmount}</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Shipping and taxes calculated at checkout.</p>
                  <Link to="/checkout">
                    <button
                      className={`mt-4 w-full py-3 rounded-lg text-lg font-semibold 
      ${totalAmount === 0
                          ? "bg-gray-400 cursor-not-allowed text-white"
                          : "bg-red-500 hover:bg-red-600 text-white"
                        }`}
                      disabled={totalAmount === 0}
                    >
                      Checkout
                    </button>
                  </Link>

                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default Cart;