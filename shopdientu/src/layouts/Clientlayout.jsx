import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Header from './Header.jsx'; 
import Footer from './Footer.jsx';

function ClientLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1 p-4 md:p-8">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default ClientLayout;