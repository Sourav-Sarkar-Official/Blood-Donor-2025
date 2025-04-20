
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Droplet, Search, Home, AlertCircle } from "lucide-react";

export function Header() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <Link to="/" className="flex items-center gap-2">
          <Droplet className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold text-primary">BloodConnect</span>
        </Link>
        
        <nav className="ml-auto flex gap-2 items-center">
          <Link to="/">
            <Button 
              variant={isActive("/") ? "default" : "ghost"} 
              size="sm" 
              className={isActive("/") ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
          <Link to="/register">
            <Button 
              variant={isActive("/register") ? "default" : "ghost"} 
              size="sm"
              className={isActive("/register") ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}
            >
              <Heart className="h-4 w-4 mr-2" />
              Register
            </Button>
          </Link>
          <Link to="/find">
            <Button 
              variant={isActive("/find") ? "default" : "ghost"} 
              size="sm"
              className={isActive("/find") ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}
            >
              <Search className="h-4 w-4 mr-2" />
              Find Donor
            </Button>
          </Link>
          <Link to="/emergency">
            <Button 
              variant={isActive("/emergency") ? "default" : "ghost"} 
              size="sm" 
              className={isActive("/emergency") ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Emergency
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
