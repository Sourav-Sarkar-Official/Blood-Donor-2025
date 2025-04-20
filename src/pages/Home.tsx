
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/main-layout";
import { Heart, Search, AlertCircle, Users } from "lucide-react";

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blood-50 to-white py-20 md:py-28">
        <div className="absolute inset-0 pattern-dots pattern-blood-100 pattern-bg-white pattern-size-4 opacity-10"></div>
        <div className="container flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Saving Lives Through <span className="text-primary">Blood Donation</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Connect with blood donors in real-time and help save lives. 
              BloodConnect brings donors and recipients together when it matters most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  <Heart className="mr-2 h-5 w-5" />
                  Register as Donor
                </Button>
              </Link>
              <Link to="/find">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Search className="mr-2 h-5 w-5" />
                  Find Donor
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative w-full max-w-md">
            <div className="aspect-square bg-blood-500/30 rounded-full absolute -right-20 -top-20 blur-3xl"></div>
            <div className="aspect-square bg-blood-600/20 rounded-full absolute -left-20 -bottom-20 blur-3xl"></div>
            <img 
              src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
              alt="Blood Donation" 
              className="relative z-10 w-full h-auto rounded-xl shadow-xl object-cover"
            />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <h2 className="text-3xl font-bold">Why Choose BloodConnect?</h2>
            <p className="text-muted-foreground">Our platform provides everything you need for quick and efficient blood donation coordination.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-background rounded-xl p-6 shadow-sm border transition-all hover:shadow-md">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Availability</h3>
              <p className="text-muted-foreground">Track available donors in real-time, filter by blood group and location for immediate assistance.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-background rounded-xl p-6 shadow-sm border transition-all hover:shadow-md">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Emergency Requests</h3>
              <p className="text-muted-foreground">Create urgent blood requests with location tracking to find the nearest available donors in emergencies.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-background rounded-xl p-6 shadow-sm border transition-all hover:shadow-md">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Support</h3>
              <p className="text-muted-foreground">Join our community of donors, connect with others, and help save lives through the gift of blood donation.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/90 to-primary">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto space-y-6 text-white">
            <h2 className="text-3xl font-bold">Ready to Make a Difference?</h2>
            <p className="text-xl opacity-90">Your donation can save up to three lives. Register now as a donor or find available donors near you.</p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
              <Link to="/register">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto text-primary hover:text-primary">
                  Register as Donor
                </Button>
              </Link>
              <Link to="/emergency">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent text-white border-white hover:bg-white/10">
                  Emergency Request
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
