import React, { useEffect, useState } from 'react';
import DashBoardNavbar from '../DashboardNavbar/DashboardNavbar';
import AddProducts from '../AddProducts/AddProducts.js';
import Orders from '../Orders/Orders.js';
import Products from '../Products/Products.js';
import Customers from '../Customers/Customers.js';
import DashboardHome from '../DashboardHome/DashboardHome.js';
import Categories from '../Categories.js'

export default function Dashboard() {


    const [selectedComponent, setSelectedComponent] = useState('dashboard'); // Set default selected component to 'dashboard'

    const handleMenuItemClick = (item) => {
        setSelectedComponent(item);
    };

    return (
        <div className="container-fluid m-0  vh-100 bg-black">
            <div className="row h-100">
                <div className="col-lg-2 col-md-2 p-0 ">
                    <DashBoardNavbar onItemClick={handleMenuItemClick} />
                </div>
                <div className="col-lg-10 col-md-10 p-0">
                    <div className=" m-3 ">

                            {selectedComponent === 'dashboard' && <DashboardHome  onItemClick={handleMenuItemClick} />}
                            {selectedComponent === 'addproducts' && <AddProducts />}
                            {selectedComponent === 'orders' && <Orders />}
                            {selectedComponent === 'products' && <Products />}
                            {selectedComponent === 'customers' && <Customers />}
                            {selectedComponent === 'categories' && <Categories />}
                            

                    </div>
                </div>
            </div>
        </div>
    );
}