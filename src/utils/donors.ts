
// Donor data management for the application
export type Donor = {
  id: string;
  name: string;
  bloodGroup: string;
  phoneNumber: string;
  alternativePhoneNumber?: string;
  email: string;
  city: string;
  state: string;
  pinCode?: string;
  profilePicture?: string;
  latitude: number;
  longitude: number;
  isAvailable: boolean;
};

export const bloodGroups = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
];

// Generate dummy donor data with locations spread around central coordinates
export const generateDummyDonors = (centerLat: number, centerLng: number, count: number = 20): Donor[] => {
  const donors: Donor[] = [];
  const cities = ["New Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad"];
  const states = ["Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "West Bengal", "Telangana"];
  
  for (let i = 0; i < count; i++) {
    // Generate random offset (-0.05 to 0.05 degrees, roughly 5km)
    const latOffset = (Math.random() - 0.5) * 0.1;
    const lngOffset = (Math.random() - 0.5) * 0.1;
    
    // Randomly select city and state
    const cityIndex = Math.floor(Math.random() * cities.length);
    
    donors.push({
      id: `donor-${i+1}`,
      name: `Donor ${i+1}`,
      bloodGroup: bloodGroups[Math.floor(Math.random() * bloodGroups.length)],
      phoneNumber: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      alternativePhoneNumber: Math.random() > 0.5 ? `+91${Math.floor(Math.random() * 9000000000) + 1000000000}` : undefined,
      email: `donor${i+1}@example.com`,
      city: cities[cityIndex],
      state: states[cityIndex],
      pinCode: `${Math.floor(Math.random() * 900000) + 100000}`,
      profilePicture: Math.random() > 0.7 ? `https://i.pravatar.cc/150?img=${i+1}` : undefined,
      latitude: centerLat + latOffset,
      longitude: centerLng + lngOffset,
      isAvailable: Math.random() > 0.3, // 70% donors are available
    });
  }
  
  return donors;
};

// Function to mask phone number for privacy
export const maskPhoneNumber = (phoneNumber: string): string => {
  return phoneNumber.replace(/(\+\d{2})(\d{6})(\d{4})/, '$1******$3');
};

// Get nearby donors based on blood group and location
export const getNearbyDonors = (
  donors: Donor[], 
  lat: number, 
  lng: number, 
  bloodGroup?: string, 
  radius: number = 10
): Donor[] => {
  // Calculate distance (in km) using Haversine formula
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };
  
  return donors.filter(donor => {
    // Check blood group if specified
    if (bloodGroup && bloodGroup !== "any" && donor.bloodGroup !== bloodGroup) return false;
    
    // Check if donor is available
    if (!donor.isAvailable) return false;
    
    // Check distance
    const distance = getDistance(lat, lng, donor.latitude, donor.longitude);
    return distance <= radius;
  });
};
