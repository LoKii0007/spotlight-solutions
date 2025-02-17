"use client";

import React from "react";
import { SearchIcon, MailIcon, BellIcon, Settings } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";
import { useSelector } from "react-redux";

const Navbar = () => {

  const auth = useSelector((state: any) => state.auth);

  return (
    <nav className="flex items-center justify-between px-5 gap-4 bg-white shadow-md text-gray-700">
      <div className="flex items-center">
        {/* <img src="logo.png" alt="Logo" className="h-8 mr-4" /> */}
        spotlight solutions
      </div>
      <div className="flex items-center flex-grow ">
        <SearchIcon size={24} color="black" />
        <input
          type="text"
          placeholder="Search projects and clients"
          className="px-2 py-2 pb-1 focus:outline-none w-full border-0 font-base text-base "
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="p-5">
          <MailIcon size={24} color="black" />
        </button>
        <button className="p-5">
          <BellIcon size={24} color="black" />
        </button>
        <button className="p-5">
          <Settings size={24} color="black" />
        </button>
        <div className="flex items-center">
          {auth?.user}
          <ProfileDropdown />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
