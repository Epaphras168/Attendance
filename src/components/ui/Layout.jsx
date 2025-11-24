import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  LogOutIcon,
  UsersIcon,
  BarChart2Icon,
  HomeIcon,
  ScanIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";

const Layout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems =
    currentUser?.role === "admin"
      ? [
          { path: "/admin", label: "Dashboard", icon: <HomeIcon className="w-5 h-5" /> },
          { path: "/manage-students", label: "Manage Students", icon: <UsersIcon className="w-5 h-5" /> },
          { path: "/attendance-scanner", label: "Scan Attendance", icon: <ScanIcon className="w-5 h-5" /> },
          { path: "/reports", label: "Reports", icon: <BarChart2Icon className="w-5 h-5" /> },
        ]
      : [
          { path: "/teacher", label: "Dashboard", icon: <HomeIcon className="w-5 h-5" /> },
          { path: "/attendance-scanner", label: "Scan Attendance", icon: <ScanIcon className="w-5 h-5" /> },
          { path: "/reports", label: "Reports", icon: <BarChart2Icon className="w-5 h-5" /> },
        ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar (desktop) */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow bg-gray-800 pt-5 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-white font-bold text-xl truncate">Attendance System</h1>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.path);
                    setMobileOpen(false);
                  }}
                  className={`${
                    location.pathname === item.path
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md truncate`}
                >
                  <div className="mr-3 flex-shrink-0">{item.icon}</div>
                  <span className="truncate">{item.label}</span>
                </a>
              ))}
            </nav>
          </div>
          <div className="flex flex-col items-center p-4">
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:bg-gray-700 hover:text-white group flex justify-center items-center px-2 py-2 text-sm font-medium rounded-md w-full mb-4"
            >
              <LogOutIcon className="mr-2 w-5 h-5" />
              Logout
            </button>
            <div className="flex items-center space-x-3">
              {!currentUser?.profileImg ? (
                <UsersIcon className="w-10 h-10 text-gray-600 border-2 border-white rounded-full" />
              ) : (
                <img
                  src={currentUser.profileImg}
                  alt={currentUser.username}
                  className="w-10 h-10 border-2 border-white rounded-full object-cover"
                />
              )}
              <div className="flex flex-col truncate">
                <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
                <p className="text-xs font-medium text-blue-200 capitalize truncate">{currentUser.username}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setMobileOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <XIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center px-4">
                <h1 className="text-white font-bold text-xl truncate">Attendance System</h1>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navItems.map((item) => (
                  <a
                    key={item.path}
                    href={item.path}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.path);
                      setMobileOpen(false);
                    }}
                    className={`${
                      location.pathname === item.path
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md truncate`}
                  >
                    <div className="mr-3 flex-shrink-0">{item.icon}</div>
                    <span className="truncate">{item.label}</span>
                  </a>
                ))}
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-base font-medium rounded-md w-full"
                >
                  <LogOutIcon className="mr-3 w-5 h-5" />
                  Logout
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:pl-64 overflow-x-hidden">
        {/* Mobile Header */}
        <div className="sticky top-0 z-10 md:hidden flex items-center justify-between bg-gray-100 px-4 py-2 shadow w-full">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="text-gray-500 hover:text-gray-900 focus:outline-none"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <h2 className="text-lg font-bold truncate w-3/4">Attendance System</h2>
        </div>

        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
