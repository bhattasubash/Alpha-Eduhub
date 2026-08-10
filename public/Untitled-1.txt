import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Inter is loaded via globals.css @import to avoid the Google Fonts
// network timeout that occurs in restricted/offline environments.

export const metadata: Metadata = {
  title: "Alpha Edu Hub - School Management Dashboard",
  description: "Alpha Edu Hub School Management System",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
        <ToastContainer position="bottom-right" theme="dark" />
      </body>
    </html>
  );
}
