import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import NavbarTop from "@/components/NavbarTop";
export const metadata: Metadata = {
  title: "Spotlight solutions",
  description: "Spotlight solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body className="h-screen">
        {/* <Navbar /> */}
        <div className="flex w-full h-screen ">
          <div className="w-[250px] p-4 bg-[#D9FFEC]">
            <Sidebar />
          </div>

          <div className="w-[calc(100%-250px)] h-full bg-white">
            <NavbarTop />
            <div className="h-[calc(100%-100px)] w-full">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
