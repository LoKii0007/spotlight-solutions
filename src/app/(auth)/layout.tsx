import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spotlight solutions",
  description: "Spotlight solutions",
};

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <head>
//       </head>
//       <body className='w-[100vw]'>
//         {children}
//       </body>
//     </html>
//   );
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}
