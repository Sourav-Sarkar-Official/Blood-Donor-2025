
import React, { useEffect, useState } from "react";
import { Donor } from "@/utils/donors";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BloodDropLoader } from "./ui/blood-drop-loader";

// We'll import leaflet dynamically since there are TypeScript issues
let L: any;
let ReactLeaflet: any;

interface DonorMapProps {
  userLocation: [number, number];
  donors: Donor[];
  radiusInKm?: number;
  onCallDonor?: (phoneNumber: string) => void;
}

export function DonorMap({ userLocation, donors, radiusInKm = 10, onCallDonor }: DonorMapProps) {
  const [loading, setLoading] = useState(true);
  const mapRef = React.useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);

  // Load Leaflet dynamically
  useEffect(() => {
    async function loadLeaflet() {
      try {
        // Import the CSS
        const leafletCSS = document.createElement('link');
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(leafletCSS);

        // Import the libraries
        L = await import('leaflet');
        
        // Initialize the map
        initializeMap();
        setLoading(false);
      } catch (error) {
        console.error("Error loading Leaflet:", error);
        setLoading(false);
      }
    }

    loadLeaflet();

    return () => {
      // Clean up map instance when component unmounts
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []);

  // Initialize the map once Leaflet is loaded
  const initializeMap = () => {
    if (!mapRef.current || !L) return;
    
    // Create a map instance
    const map = L.map(mapRef.current).setView(userLocation, 13);
    
    // Add the tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Custom blood icon
    const bloodIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/3287/3287921.png',
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -38],
    });

    // Add user marker
    L.marker(userLocation).addTo(map)
      .bindPopup("Your Location")
      .openPopup();
      
    // Add circle for coverage radius
    L.circle(userLocation, {
      radius: radiusInKm * 1000,
      fillColor: '#f87171',
      fillOpacity: 0.1,
      color: '#ef4444',
      weight: 1
    }).addTo(map);

    // Add donor markers with animation
    donors.forEach(donor => {
      const position = [donor.latitude, donor.longitude];
      
      // Create marker
      const marker = L.marker(position).addTo(map);
      
      // Add popup content
      marker.bindPopup(`
        <div class="min-w-[200px]">
          <h3 class="font-semibold text-lg">${donor.name}</h3>
          <p class="mb-1 font-medium">Blood Group: <span class="text-primary">${donor.bloodGroup}</span></p>
          <p class="mb-2 text-sm">${donor.city}, ${donor.state}</p>
          <button id="call-donor-${donor.id}" class="w-full px-2 py-1 bg-primary text-white rounded-md text-sm flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            Contact Donor
          </button>
        </div>
      `);

      // Add movement animation
      setInterval(() => {
        const latOffset = (Math.random() - 0.5) * 0.0004;
        const lngOffset = (Math.random() - 0.5) * 0.0004;
        
        const newPos = [
          position[0] + latOffset,
          position[1] + lngOffset
        ];
        
        marker.setLatLng(newPos);
      }, 2000);
      
      // Add event listener for call button
      marker.on('popupopen', () => {
        setTimeout(() => {
          const callButton = document.getElementById(`call-donor-${donor.id}`);
          if (callButton && onCallDonor) {
            callButton.addEventListener('click', () => onCallDonor(donor.phoneNumber));
          }
        }, 0);
      });
    });
    
    setMapInstance(map);
  };

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border shadow-sm relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <BloodDropLoader />
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
