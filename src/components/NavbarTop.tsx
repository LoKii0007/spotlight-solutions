"use client";

import React from "react";
import { usePathname } from "next/navigation";
import TimeZones from "./TimeZones";
const NavbarTop = () => {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-between bg-[#F3FFF9] px-8 py-4">
      <div className="nav-left capitalize text-2xl font-bold">
        {pathname.split("/")[1]}
      </div>
      <div className="nav-right flex items-center gap-4">
        <TimeZones />
      </div>
    </div>
  );
};

export default NavbarTop;
