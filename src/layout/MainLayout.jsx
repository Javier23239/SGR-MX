import { useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* NAVBAR */}
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1">

        {/* SIDEBAR */}
        <Sidebar
          open={sidebarOpen}
          close={() => setSidebarOpen(false)}
        />

        {/* CONTENIDO */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default MainLayout;