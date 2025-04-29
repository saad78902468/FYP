import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-yellow-400 text-black py-10 shadow-lg">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* First Column */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-black">Shop</h2>
            <ul className="space-y-2">
              <li><Link to="#" className="hover:text-gray-900">Menu</Link></li>
              <li><Link to="#" className="hover:text-gray-900">Order Now</Link></li>
              <li><Link to="#" className="hover:text-gray-900">Special Offers</Link></li>
              <li><Link to="#" className="hover:text-gray-900">Contact Us</Link></li>
            </ul>
          </div>

          {/* Second Column */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-black">Customer Service</h2>
            <ul className="space-y-2">
              <li><Link to="#" className="hover:text-gray-900">FAQ</Link></li>
              <li><Link to="#" className="hover:text-gray-900">Returns & Exchanges</Link></li>
              <li><Link to="#" className="hover:text-gray-900">Shipping Info</Link></li>
            </ul>
          </div>

          {/* Third Column */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-black">About Us</h2>
            <ul className="space-y-2">
              <li><Link to="#" className="hover:text-gray-900">Our Story</Link></li>
              <li><Link to="#" className="hover:text-gray-900">Careers</Link></li>
              <li><Link to="#" className="hover:text-gray-900">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-gray-900">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Fourth Column */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-black">Follow Us</h2>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-gray-900">Facebook</a></li>
              <li><a href="#" className="hover:text-gray-900">Instagram</a></li>
              <li><a href="#" className="hover:text-gray-900">Twitter</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 text-center text-sm border-t border-black pt-6">
          © {new Date().getFullYear()} All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;