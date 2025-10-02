// File: src/components/layout/Layout.jsx (Updated)

import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar"; // ADDED: Import the Sidebar

const Layout = () => {
  return (
    // CHANGED: The main container now uses flexbox to create the sidebar layout
    <div className="flex h-screen bg-gray-100">
      <Sidebar /> {/* ADDED: The Sidebar component is now part of the layout */}
      {/* This div will contain the header and the main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        {/* The main content area is now scrollable */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
            <Outlet /> {/* Renders the current page */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
