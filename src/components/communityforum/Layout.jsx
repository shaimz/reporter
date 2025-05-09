import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { RxHamburgerMenu, RxCrossCircled } from 'react-icons/rx';

import 'tailwindcss/tailwind.css';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className='flex flex-row min-h-screen overflow-hidden overflow-x-hidden'>

            {/* Sidebar */}
            <div className={`xl:w-[22%] bg-white ${isSidebarOpen ? 'block' : 'hidden'} lg:block overflow-hidden`}>
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className='w-full lg:w-[78%] bg-zinc-800 text-dark'>

                {/* Hamburger Menu */}
                <div className='text-lg lg:hidden fixed left-8 mt-6 cursor-pointer'
                    onClick={toggleSidebar}>
                    {!isSidebarOpen ?

                        <RxHamburgerMenu />
                        :
                        <RxCrossCircled />
                    }

                </div>

                {/* Page Content */}
                {children}

            </div>

        </div>
    );
};

export default Layout;
