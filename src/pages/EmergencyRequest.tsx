
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { DonorMap } from "@/components/donor-map";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { bloodGroups, generateDummyDonors, getNearbyDonors, Donor } from "@/utils/donors";
import { useGeolocation } from "@/hooks/useGeolocation";
import { BloodDropLoader } from "@/components/ui/blood-drop-loader";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle, Phone, MapPin } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";

export default function EmergencyRequest() {
  const { coordinates, address, loading, error } = useGeolocation();
  
  const [bloodGroup, setBloodGroup] = useState("");
  const [radius, setRadius] = useState(10);
  const [allDonors, setAllDonors] = useState<Donor[]>([]);
  const [nearbyDonors, setNearbyDonors] = useState<Donor[]>([]);
  const [patientName, setPatientName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [hospital, setHospital] = useState("");
  const [hospitalError, setHospitalError] = useState(false);
  
  useEffect(() => {
    if (coordinates) {
      const donors = generateDummyDonors(coordinates.latitude, coordinates.longitude, 30);
      setAllDonors(donors);
      
      const nearby = getNearbyDonors(
        donors, 
        coordinates.latitude, 
        coordinates.longitude, 
        "", 
        radius
      );
      setNearbyDonors(nearby);
    }
  }, [coordinates, radius]);
  
  useEffect(() => {
    if (coordinates && allDonors.length > 0) {
      const nearby = getNearbyDonors(
        allDonors, 
        coordinates.latitude, 
        coordinates.longitude, 
        bloodGroup || undefined, 
        radius
      );
      setNearbyDonors(nearby);
      
      toast({
        title: `${nearby.length} donors found nearby`,
        description: `Within ${radius} km${bloodGroup ? ` with blood group ${bloodGroup}` : ""}`,
      });
    }
  }, [bloodGroup, radius, coordinates, allDonors]);
  
  const handleContactDonor = (phoneNumber: string) => {
    toast({
      title: "Connecting to donor",
      description: `${phoneNumber}`,
      variant: "default",
    });
  };
  
  const handleCreateRequest = () => {
    // Validate required fields
    if (!patientName) {
      toast({
        title: "Missing information",
        description: "Please provide patient name",
        variant: "destructive",
      });
      return;
    }
    
    if (!contactNumber) {
      toast({
        title: "Missing information",
        description: "Please provide contact number",
        variant: "destructive",
      });
      return;
    }
    
    if (!hospital) {
      setHospitalError(true);
      toast({
        title: "Missing information",
        description: "Please provide hospital name - this is required for emergency requests",
        variant: "destructive",
      });
      return;
    }
    
    setHospitalError(false);
    
    toast({
      title: "Emergency request created",
      description: "Notifying all nearby donors. You will be contacted shortly.",
      variant: "default",
    });
  };
  
  return (
    <MainLayout>
      <div className="py-10 max-w-6xl mx-auto">
        <BackButton className="mb-4" />
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide text-white transition duration-200 bg-primary rounded-lg hover:bg-primary/90 mb-4">
            <AlertCircle className="mr-2 h-5 w-5" />
            Emergency Blood Request
          </div>
          <h1 className="text-3xl font-bold mb-3">Find Donors Near You</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Looking for blood donors in an emergency? We'll help you find available donors in your area right now.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-card rounded-xl shadow-sm border p-6 lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Emergency Details</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name*</Label>
                <Input 
                  id="patientName"
                  placeholder="Enter patient name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className={!patientName ? "border-red-300" : ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number*</Label>
                <Input 
                  id="contactNumber"
                  placeholder="Enter your contact number"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className={!contactNumber ? "border-red-300" : ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hospital">Hospital Name*</Label>
                <Input 
                  id="hospital"
                  placeholder="Enter hospital name"
                  value={hospital}
                  onChange={(e) => {
                    setHospital(e.target.value);
                    if (e.target.value) setHospitalError(false);
                  }}
                  className={hospitalError ? "border-red-300" : ""}
                />
                {hospitalError && (
                  <p className="text-xs text-red-500">Hospital name is required for emergency requests</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Required Blood Group</Label>
                <Select onValueChange={setBloodGroup}>
                  <SelectTrigger id="bloodGroup">
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    {bloodGroups.map((group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="radius">Search Radius: {radius} km</Label>
                </div>
                <Slider
                  id="radius"
                  min={1}
                  max={20}
                  step={1}
                  value={[radius]}
                  onValueChange={(value) => setRadius(value[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 km</span>
                  <span>10 km</span>
                  <span>20 km</span>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleCreateRequest}
                disabled={loading || !coordinates}
              >
                <Phone className="mr-2 h-4 w-4" />
                Create Emergency Request
              </Button>
              
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>Location error: {error}</span>
                  </div>
                  <p className="mt-1 text-xs">Please enter your location manually.</p>
                </div>
              )}
              
              {address && !loading && (
                <div className="p-3 rounded-lg bg-accent text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>Your location: {address.formatted}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl shadow-sm border p-6 h-full">
              <h2 className="text-xl font-semibold mb-4">Live Donor Map</h2>
              
              {loading ? (
                <div className="flex items-center justify-center h-[400px]">
                  <BloodDropLoader />
                </div>
              ) : !coordinates ? (
                <div className="flex items-center justify-center h-[400px] bg-accent/50 rounded-lg">
                  <div className="text-center p-6">
                    <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Unable to access your location.</p>
                    <p className="text-sm mt-2">Please allow location access or enter your location manually.</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-2 flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Showing {nearbyDonors.length} donors within {radius} km
                    </span>
                    
                    {bloodGroup && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        Blood Group: {bloodGroup}
                      </span>
                    )}
                  </div>
                  
                  <DonorMap 
                    userLocation={[coordinates.latitude, coordinates.longitude]}
                    donors={nearbyDonors}
                    radiusInKm={radius}
                    onCallDonor={handleContactDonor}
                  />
                </>
              )}
            </div>
          </div>
        </div>
        
        {nearbyDonors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-card rounded-xl shadow-sm border p-6 text-center">
              <p className="text-4xl font-bold text-primary">{nearbyDonors.length}</p>
              <p className="text-sm font-medium">Available Donors</p>
            </div>
            
            <div className="bg-card rounded-xl shadow-sm border p-6 text-center">
              <p className="text-4xl font-bold text-primary">{bloodGroup || "All"}</p>
              <p className="text-sm font-medium">Blood Group</p>
            </div>
            
            <div className="bg-card rounded-xl shadow-sm border p-6 text-center">
              <p className="text-4xl font-bold text-primary">{radius} km</p>
              <p className="text-sm font-medium">Search Radius</p>
            </div>
          </div>
        )}
        
        <div className="bg-accent/50 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold mb-2">Emergency Guidelines</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
              <span>Fill in the emergency details and specify the required blood group.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
              <span>View available donors on the map and their contact information.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
              <span>Click "Contact Donor" to initiate communication with donors.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
              <span>Create an emergency request to notify all nearby donors simultaneously.</span>
            </li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
}
