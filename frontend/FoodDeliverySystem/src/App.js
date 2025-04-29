import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
// import Home from "./pages/Home.js";
import AppRouter from "./AppRouter.js";
// import Home_V1 from "./components/homev4.js";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </>
  );
}
