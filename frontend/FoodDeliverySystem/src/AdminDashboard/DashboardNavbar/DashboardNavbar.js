import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DashBoardNavbar({ onItemClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("food123");
    navigate("/admin/login");
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
    onItemClick(item);
    setIsOpen(false); // Close sidebar on mobile after selection
  };

  return (
    <>
      {/* Menu Button */}
      <button
        className="fixed top-4 left-4 z-10 bg-black text-yellow-400 p-3 rounded-lg md:hidden"
        onClick={handleToggle}
      >
        <i className="fas fa-bars text-lg"></i>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-black text-yellow-400 shadow-lg transition-transform duration-300 ease-in-out z-40 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:w-64`}
      >
        <div className="sidebar-header flex justify-between items-center p-4">
          <h5 className="w-full text-center text-xl bg-yellow-400 text-black py-2 px-4 rounded-md font-bold">
            Admin Menu
          </h5>

          {/* Close Button (Only for mobile) */}
          <button
            className="text-yellow-400 bg-black border border-yellow-400 rounded p-2 mx-2 hover:bg-yellow-500 hover:text-black transition-colors md:hidden"
            onClick={handleToggle}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <ul className="list-unstyled p-4 space-y-3">
          {[
            { name: "dashboard", icon: "fa-tachometer-alt", label: "Dashboard" },
            { name: "addproducts", icon: "fa-plus-square", label: "Add Product" },
            { name: "products", icon: "fa-box", label: "Products List" },
            { name: "orders", icon: "fa-clipboard-list", label: "Orders List" },
            { name: "categories", icon: "fa-tags", label: "Categories" },
          ].map((item) => (
            <li
              key={item.name}
              className={`flex items-center mb-3 rounded-lg p-2 cursor-pointer transition-all duration-300 
                ${
                  activeItem === item.name
                    ? "bg-yellow-300 text-black"
                    : "hover:bg-yellow-100 hover:text-black"
                }`}
              onClick={() => handleItemClick(item.name)}
            >
              <i className={`me-2 fas ${item.icon} text-lg`}></i>
              <span className="text-lg font-medium">{item.label}</span>
            </li>
          ))}
          <li
            className="flex items-center mb-3 cursor-pointer rounded-lg p-2 hover:bg-yellow-100 hover:text-black transition-all duration-300"
            onClick={handleLogout}
          >
            <i className="me-2 fas fa-sign-out-alt text-lg"></i>
            <span className="text-lg font-medium">Logout</span>
          </li>
        </ul>
      </div>

      {/* Background Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={handleToggle}
        ></div>
      )}
    </>
  );
}