'use client'

import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import NavbarTop from "@/components/NavbarTop";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import { initializeBoards } from "@/redux/slices/BoardSlice";
import { Loader2 } from "lucide-react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const { toast } = useToast();

  async function fetchBoards(page: number) {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/board", { 
        params: {
          page,
        },
      });
      if (res.status !== 200) {
        toast({
          title: "Error fetching boards",
          description: res.data.message,
          variant: "destructive",
        });
      }
      const payload = {
        boards: res.data.boards,
        columns: res.data.columns,
        tasks: res.data.tasks,
      };
      console.log(payload);
      dispatch(initializeBoards(payload));
    } catch (error) {
      console.log(error);
      toast({
        title: "Error fetching boards",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchBoards(1);
  }, []);

  return (
    <html lang="en">
      <head></head>
      <body className="h-screen">
        <div className="flex w-full h-screen ">
          <div className="w-[250px] p-4 bg-[#D9FFEC]">
            <Sidebar />
          </div>

          <div className="w-[calc(100%-250px)] h-full bg-white">
            <NavbarTop />
            <div className="h-[calc(100%-100px)] w-full">
              {isLoading ? (
                <div className="w-full h-full flex justify-center items-center">
                  <Loader2 className="animate-spin" />
                </div>
              ) : (
                children
              )}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
