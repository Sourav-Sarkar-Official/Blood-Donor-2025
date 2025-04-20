
import React from "react";
import { Link } from "react-router-dom";
import { Droplet, Heart, Instagram, Twitter, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full py-6 border-t bg-accent mt-auto">
      <div className="container grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Droplet className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">BloodConnect</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Connecting blood donors with those in need. Save lives with a simple donation.
          </p>
          <div className="flex gap-4 pt-2">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-sm mb-3 uppercase">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
            </li>
            <li>
              <Link to="/register" className="text-muted-foreground hover:text-primary transition-colors">Register as Donor</Link>
            </li>
            <li>
              <Link to="/find" className="text-muted-foreground hover:text-primary transition-colors">Find Donor</Link>
            </li>
            <li>
              <Link to="/emergency" className="text-muted-foreground hover:text-primary transition-colors">Emergency Request</Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium text-sm mb-3 uppercase">Contact</h3>
          <address className="text-sm text-muted-foreground not-italic space-y-2">
            <p>123 Blood Donation Street</p>
            <p>New Delhi, India</p>
            <p>Email: info@bloodconnect.org</p>
            <p>Phone: +91 123-456-7890</p>
          </address>
        </div>
      </div>
      
      <div className="container mt-8 pt-4 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} BloodConnect. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
