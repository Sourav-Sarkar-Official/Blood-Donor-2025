
import React from "react";
import { Header } from "./header";
import { Footer } from "./footer";

interface MainLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export function MainLayout({ children, fullWidth = false }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className={fullWidth ? "w-full" : "container mx-auto px-4"}>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
