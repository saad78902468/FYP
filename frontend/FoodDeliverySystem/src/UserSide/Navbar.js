import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Cart from './Cart/Cart'; // Still here in case you need it
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "../Assets/logo.jpg";

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav
        className={`p-4 sticky top-0 z-50 transition-colors duration-300 ${isScrolled ? "shadow-md" : ""}`}
        style={{ backgroundColor: "#FFD700", color: "#000" }}
      >
        <div className="container mx-auto flex justify-between items-center">
          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden text-2xl"
            style={{ color: "#000" }}
          >
            {isMobileMenuOpen ? '✖' : '☰'}
          </button>

          {/* Logo */}
          <Link to="/" className="text-xl font-bold flex items-center gap-2" style={{ color: "#000" }}>
            Logo
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex justify-center space-x-8">
            <Link to="/home" className="text-lg font-semibold hover:underline" style={{ color: "#000" }}>
              Menu
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 space-y-4">
            <Link to="/home" className="block text-lg font-semibold" style={{ color: "#000" }}>
              Menu
            </Link>
          </div>
        )}
      </nav>

      <Cart showCart={false} toggleCartCanvas={() => {}} /> {/* Cart kept but disabled */}
    </>
  );
};

export default Navbar;