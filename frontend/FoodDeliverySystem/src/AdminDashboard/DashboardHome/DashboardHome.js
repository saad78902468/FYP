import React, { useState } from 'react';
import { FaPlus, FaList, FaTags, FaClipboardList } from 'react-icons/fa';
import { motion } from 'framer-motion';

const DashboardHome = ({ onItemClick }) => {
  const [activeItem, setActiveItem] = useState("dashboard");

  const handleItemClick = (item) => {
    setActiveItem(item);
    onItemClick(item);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black mt-5 md:mt-0">
      <motion.div
        className="w-full max-w-5xl px-6 py-8 text-center rounded-lg shadow-lg bg-gradient-to-br from-yellow-400 to-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="text-3xl md:text-5xl font-extrabold text-black mb-6"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          Welcome Back, Admin!
        </motion.div>

        <motion.div
          className="text-xl text-yellow-900 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Manage your platform with ease and control.
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {[
            { icon: <FaPlus className="text-6xl" />, label: "Add Product", name: "addproducts" },
            { icon: <FaList className="text-6xl" />, label: "Product List", name: "products" },
            { icon: <FaTags className="text-6xl" />, label: "Categories", name: "categories" },
            { icon: <FaClipboardList className="text-6xl" />, label: "Order List", name: "orders" },
          ].map(({ icon, label, name }) => (
            <motion.div
              key={name}
              className="bg-yellow-100 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center text-black hover:scale-105 transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleItemClick(name)}
            >
              {icon}
              <span className="mt-2 text-sm font-medium">{label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardHome;
