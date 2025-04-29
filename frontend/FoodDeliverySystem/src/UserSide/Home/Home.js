import React, { useState, useEffect } from "react";
import slide1 from "../../Assets/cover.jpg"
import CategoryProducts from "../CategoryProducts";
import { motion } from 'framer-motion';

const FirstSection = () => {
    const images = [slide1];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div
            className="relative w-full flex items-center justify-center bg-cover bg-center transition-all duration-500"
            style={{
                backgroundImage: `url(${images[currentIndex]})`,
                height: "100vh",
            }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-70 z-0" />

            <div className="absolute z-10 text-center px-6 py-8 rounded-lg shadow-2xl"
                style={{ maxWidth: "90%", top: "50%", transform: "translateY(-50%)" }}>
                
                <motion.div
                    className="text-5xl md:text-8xl font-extrabold text-yellow-400 drop-shadow-lg"
                    initial={{ y: -200, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 60 }}
                >
                    FOODIE FLY
                </motion.div>

                <p className="mt-4 text-lg md:text-2xl text-white font-medium drop-shadow-md">
                    Taste the Speed, Love the Flavor!
                </p>
            </div>
        </div>
    );
};

const Home = () => {
    return (
        <>
            <div style={{ backgroundColor: "#fafafa" }}>
                <FirstSection />
            </div>
            <CategoryProducts />
        </>
    );
};

export default Home;
