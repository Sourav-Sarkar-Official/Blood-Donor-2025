
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DonorCard } from "@/components/donor-card";
import { DonorMap } from "@/components/donor-map";
import { bloodGroups, generateDummyDonors, Donor } from "@/utils/donors";
import { useGeolocation } from "@/hooks/useGeolocation";
import { BloodDropLoader } from "@/components/ui/blood-drop-loader";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, Dialog } from "@/components/ui/dialog";
import { Search, MapPin, Filter, ChevronDown } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { BackButton } from "@/components/ui/back-button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

export default function FindDonor() {
  const { coordinates, address, loading } = useGeolocation();
  
  const [searchParams, setSearchParams] = useState({
    bloodGroup: "",
    city: "",
    state: "",
    availability: true,
  });
  
  const [allDonors, setAllDonors] = useState<Donor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Generate dummy donors when the component loads
  useEffect(() => {
    if (coordinates) {
      const dummyDonors = generateDummyDonors(coordinates.latitude, coordinates.longitude, 50);
      setAllDonors(dummyDonors);
      setFilteredDonors(dummyDonors);
    }
  }, [coordinates]);
  
  // Handle input changes
  const handleInputChange = (key: keyof typeof searchParams, value: string | boolean) => {
    setSearchParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  
  // Apply filters
  const applyFilters = () => {
    const filtered = allDonors.filter((donor) => {
      const matchesBloodGroup = !searchParams.bloodGroup || donor.bloodGroup === searchParams.bloodGroup;
      const matchesCity = !searchParams.city || donor.city.toLowerCase().includes(searchParams.city.toLowerCase());
      const matchesState = !searchParams.state || donor.state.toLowerCase().includes(searchParams.state.toLowerCase());
      const matchesAvailability = !searchParams.availability || donor.isAvailable;
      
      return matchesBloodGroup && matchesCity && matchesState && matchesAvailability;
    });
    
    setFilteredDonors(filtered);
    setIsFilterOpen(false);
    
    if (filtered.length === 0) {
      toast({
        title: "No donors found",
        description: "Try broadening your search criteria",
        variant: "destructive",
      });
    } else {
      toast({
        title: `${filtered.length} donors found`,
        description: "Showing available donors matching your criteria",
      });
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchParams({
      bloodGroup: "",
      city: "",
      state: "",
      availability: true,
    });
    setFilteredDonors(allDonors);
    setIsFilterOpen(false);
    
    toast({
      title: "Filters reset",
      description: "Showing all donors",
    });
  };
  
  // Handle view on map
  const handleViewOnMap = (donor: Donor) => {
    setSelectedDonor(donor);
    setMapDialogOpen(true);
  };
  
  // Handle contacting a donor
  const handleContactDonor = (phoneNumber: string) => {
    toast({
      title: "Contact initiated",
      description: `Connecting to donor at ${phoneNumber}`,
    });
  };
  
  return (
    <MainLayout>
      <div className="py-10 max-w-6xl mx-auto">
        <BackButton className="mb-4" />
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">Find Blood Donors</h1>
          <p className="text-muted-foreground">Search for available blood donors in your area.</p>
        </div>
        
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Filter Donors
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-medium">Filter Options</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="mobileBloodGroup">Blood Group</Label>
                    <Select 
                      onValueChange={(value) => handleInputChange("bloodGroup", value)}
                      value={searchParams.bloodGroup}
                    >
                      <SelectTrigger id="mobileBloodGroup">
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
                  
                  <div>
                    <Label htmlFor="mobileCity">City</Label>
                    <Input 
                      id="mobileCity"
                      placeholder="Enter city name"
                      value={searchParams.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="mobileState">State</Label>
                    <Input 
                      id="mobileState"
                      placeholder="Enter state name"
                      value={searchParams.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="mobileAvailability" 
                      checked={searchParams.availability}
                      onCheckedChange={(checked) => 
                        handleInputChange("availability", checked === true)
                      }
                    />
                    <label
                      htmlFor="mobileAvailability"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Available donors only
                    </label>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={applyFilters} className="flex-1">Apply Filters</Button>
                    <Button variant="outline" onClick={resetFilters}>Reset</Button>
                  </div>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Desktop Filter Panel */}
          <div className="hidden lg:block">
            <div className="bg-card rounded-xl shadow-sm border p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Filter Donors</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select 
                    onValueChange={(value) => handleInputChange("bloodGroup", value)}
                    value={searchParams.bloodGroup}
                  >
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
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city"
                    placeholder="Enter city name"
                    value={searchParams.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input 
                    id="state"
                    placeholder="Enter state name"
                    value={searchParams.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="availability" 
                    checked={searchParams.availability}
                    onCheckedChange={(checked) => 
                      handleInputChange("availability", checked === true)
                    }
                  />
                  <label
                    htmlFor="availability"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Available donors only
                  </label>
                </div>
                
                <div className="pt-4 space-y-2">
                  <Button onClick={applyFilters} className="w-full">Apply Filters</Button>
                  <Button variant="outline" onClick={resetFilters} className="w-full">Reset Filters</Button>
                </div>
              </div>
              
              {address && !loading && (
                <div className="mt-6 p-3 rounded-lg bg-accent text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>Your location: {address.formatted}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Results Section */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center py-12">
                <BloodDropLoader />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Available Donors</h2>
                  <span className="text-sm text-muted-foreground">
                    Showing {filteredDonors.length} results
                  </span>
                </div>
                
                {filteredDonors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {filteredDonors.map((donor) => (
                      <DonorCard 
                        key={donor.id} 
                        donor={donor} 
                        onViewMap={handleViewOnMap} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border rounded-lg bg-background">
                    <p className="text-muted-foreground">No donors found matching your criteria.</p>
                    <p className="text-sm mt-2">Try searching with different parameters.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Map Dialog */}
        <Dialog open={mapDialogOpen} onOpenChange={setMapDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Donor Location</DialogTitle>
              {selectedDonor && (
                <DialogDescription>
                  Viewing location for donor {selectedDonor.name} ({selectedDonor.bloodGroup})
                </DialogDescription>
              )}
            </DialogHeader>
            
            {selectedDonor && coordinates && (
              <DonorMap 
                userLocation={[coordinates.latitude, coordinates.longitude]}
                donors={[selectedDonor]}
                onCallDonor={handleContactDonor}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
