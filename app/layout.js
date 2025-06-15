// app/layout.js
import "./globals.css";
import { Inter } from "next/font/google";
import ClientProviders from "@/components/ClientProviders";
import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Wealth",
  description: "One stop finance platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 text-gray-900 antialiased`}>
        <ClientProviders>
          <Header className="bg-white shadow" />
          <main>{children}</main>
        </ClientProviders>
      </body>
    </html>
  );
}
