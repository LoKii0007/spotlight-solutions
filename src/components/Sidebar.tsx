"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CommonModal from "./CommonModal";
import { SidebarMenu } from "../utils/data";
import { signOut } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
const Sidebar = ({}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeView, setActiveView] = useState(SidebarMenu[0].route);
  const router = useRouter();
  const {toast} = useToast();

  function handleView(data: string) {
    const route = data.toLowerCase();
    setActiveView(route);
    router.push(`/${route}`);
  }
  
  async function handleSignOut() {
    try {
      await signOut(); 
  
      toast({
        title: "Signed out successfully",
        variant: "default",
      });
  
      router.push("/login"); // Redirect after sign-out
    } catch (error:any) {
      toast({
        title: "Error signing out",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  }
  

  return (
    <>
      <div className="sidebar-wrapper w-full flex flex-col py-1 items-center justify-between h-full gap-2 ">
        <div className="sidebar-top w-full ">
          <div
            onClick={() => handleView("home")}
            className="logo flex items-center hover:cursor-pointer gap-2 pb-10 w-full justify-center"
          >
            {/* <img className="h-8" src="/logo-2.png" alt="logo" /> */}
            <div className="text-[20px] font-bold justify-center items-center flex-col hidden lg:flex">
              Spotlight <br />{" "}
              <span className="text-[10px]">strategic solutions</span>
            </div>
          </div>

          {SidebarMenu?.slice(0, SidebarMenu.length - 1).map((data, index) => (
            <button
              key={index}
              onClick={() => handleView(data.route)}
              className={` ${
                activeView === data.route
                  ? " text-black font-semibold"
                  : "text-[#737791] font-medium"
              } text-[15.78px] rounded-[14px] flex gap-[14px] items-center py-3 px-5 w-full`}
            >
              <div className="icon scale-75 ">{data.icon}</div>
              <div className="hidden lg:block">{data.label}</div>
            </button>
          ))}
        </div>

        <div className="sidebar-bottom pb-6 w-full ">
          {SidebarMenu?.slice(SidebarMenu.length - 1, SidebarMenu.length).map(
            (data, index) => (
              <button
                key={index}
                onClick={() => handleView(data.route)}
                className={` ${
                  activeView === data.route
                    ? "text-black font-semibold"
                    : "text-[#737791] font-medium"
                } text-[15.78px] rounded-[14px] flex gap-[14px] items-center py-3 px-5 w-full`}
              >
                <div className="icon scale-75">{data.icon}</div>
                <div className="hidden lg:block">{data.label}</div>
              </button>
            )
          )}
          <button
            onClick={() => setModalOpen(true)}
            className={`text-[#737791] font-medium text-[15.78px] rounded-[14px] flex gap-[14px] items-center py-[14px] px-5 w-full`}
          >
            <div className={` stroke-none icon scale-75`}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_22_73)">
                  <path
                    d="M11.5 16C11.1022 16 10.7206 16.158 10.4393 16.4393C10.158 16.7206 10 17.1022 10 17.5V18.3C10 19.0161 9.71554 19.7028 9.20919 20.2092C8.70284 20.7155 8.01609 21 7.3 21H5.7C4.98392 21 4.29716 20.7155 3.79081 20.2092C3.28446 19.7028 3 19.0161 3 18.3V5.7C3 4.98392 3.28446 4.29716 3.79081 3.79081C4.29716 3.28446 4.98392 3 5.7 3H7.3C8.01609 3 8.70284 3.28446 9.20919 3.79081C9.71554 4.29716 10 4.98392 10 5.7V6.5C10 6.89782 10.158 7.27936 10.4393 7.56066C10.7206 7.84196 11.1022 8 11.5 8C11.8978 8 12.2794 7.84196 12.5607 7.56066C12.842 7.27936 13 6.89782 13 6.5V5.7C12.9984 4.18875 12.3974 2.73986 11.3288 1.67125C10.2601 0.602632 8.81125 0.00158828 7.3 0L5.7 0C4.18875 0.00158828 2.73986 0.602632 1.67125 1.67125C0.602632 2.73986 0.00158828 4.18875 0 5.7L0 18.3C0.00158828 19.8112 0.602632 21.2601 1.67125 22.3288C2.73986 23.3974 4.18875 23.9984 5.7 24H7.3C8.81125 23.9984 10.2601 23.3974 11.3288 22.3288C12.3974 21.2601 12.9984 19.8112 13 18.3V17.5C13 17.1022 12.842 16.7206 12.5607 16.4393C12.2794 16.158 11.8978 16 11.5 16Z"
                    fill="black"
                  />
                  <path
                    d="M22.561 9.525L17.975 4.939C17.8357 4.79974 17.6703 4.68928 17.4882 4.61393C17.3062 4.53859 17.1111 4.49983 16.9141 4.49988C16.7171 4.49992 16.5221 4.53877 16.3401 4.6142C16.1581 4.68963 15.9928 4.80017 15.8535 4.9395C15.5722 5.2209 15.4143 5.6025 15.4144 6.00036C15.4144 6.19736 15.4533 6.39242 15.5287 6.57441C15.6041 6.75639 15.7147 6.92174 15.854 7.061L19.265 10.472L7 10.5C6.60218 10.5 6.22064 10.658 5.93934 10.9393C5.65804 11.2206 5.5 11.6022 5.5 12C5.5 12.3978 5.65804 12.7794 5.93934 13.0607C6.22064 13.342 6.60218 13.5 7 13.5L19.318 13.472L15.851 16.939C15.5696 17.2203 15.4115 17.6018 15.4114 17.9997C15.4113 18.3975 15.5692 18.7791 15.8505 19.0605C16.1318 19.3419 16.5133 19.5 16.9111 19.5001C17.309 19.5002 17.6906 19.3423 17.972 19.061L22.558 14.475C23.2136 13.8184 23.5821 12.9285 23.5827 12.0006C23.5832 11.0727 23.2158 10.1824 22.561 9.525Z"
                    fill="black"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_22_73">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className="hidden lg:block">Sign out</div>
          </button>
          <CommonModal
            open={modalOpen}
            setOpen={setModalOpen}
            buttonText="Sign out"
            title="Sign out"
            description="Are you sure you want to sign out?"
            handleAction={handleSignOut}
          />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
