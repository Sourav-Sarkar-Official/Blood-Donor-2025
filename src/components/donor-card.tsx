
import React from "react";
import { MapPin, Phone, User, Eye, Mail } from "lucide-react";
import { Donor, maskPhoneNumber } from "@/utils/donors";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DonorCardProps {
  donor: Donor;
  onViewMap: (donor: Donor) => void;
}

export function DonorCard({ donor, onViewMap }: DonorCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Avatar className="h-12 w-12 mr-3">
            <AvatarImage src={donor.profilePicture} alt={donor.name} />
            <AvatarFallback>{getInitials(donor.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{donor.name}</h3>
            <p className="text-sm text-muted-foreground">{donor.email}</p>
          </div>
          <div className="ml-auto">
            <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary">
              {donor.bloodGroup}
            </span>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{donor.city}, {donor.state} {donor.pinCode && `- ${donor.pinCode}`}</span>
          </div>
          <div className="flex items-center text-sm">
            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{maskPhoneNumber(donor.phoneNumber)}</span>
          </div>
          {donor.alternativePhoneNumber && (
            <div className="flex items-center text-sm">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{maskPhoneNumber(donor.alternativePhoneNumber)} (Alt)</span>
            </div>
          )}
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{donor.email}</span>
          </div>
        </div>
        
        <div className="flex items-center">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${donor.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {donor.isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 border-t">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-primary hover:text-primary-foreground hover:bg-primary transition-colors"
          onClick={() => onViewMap(donor)}
        >
          <Eye className="h-4 w-4 mr-2" /> View on Map
        </Button>
      </CardFooter>
    </Card>
  );
}
