'use client';

import { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const navItems = ["Home", "TV Shows", "Movies", "New & Popular", "My List"];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);

  // handle scroll background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // get user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-3 text-sm transition-colors duration-500 md:px-10 ${
        isScrolled
          ? "bg-black/90 shadow-lg shadow-black/40"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent"
      }`}
    >
      {/* LEFT SIDE */}
      <div className="flex items-center gap-8">
        {/* Logo */}
        <div className="text-2xl font-extrabold tracking-tight text-red-600">
          MovieFlix
        </div>

        {/* Menu */}
        <nav className="hidden gap-4 text-sm text-zinc-200 md:flex">
          {navItems.map((item) => (
            <button
              key={item}
              className="text-sm font-medium text-zinc-300 hover:text-white"
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <button
          className="rounded-full bg-black/40 p-2 text-zinc-200 hover:bg-zinc-700/80 hover:text-white"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>

        {/* Kids */}
        <div className="hidden md:flex">
          <span className="text-sm text-zinc-200 hover:text-white">
            Kids
          </span>
        </div>

        {/* USER NAME */}
        {user && (
          <span className="hidden md:block text-sm text-white">
            {user.userName}
          </span>
        )}

        {/* Avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-red-600 text-xs font-semibold uppercase text-white">
          {user?.userName?.[0] || "U"}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-sm text-zinc-300 hover:text-white"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
