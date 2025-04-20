import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { MainLayout } from "@/components/layout/main-layout";
import { bloodGroups } from "@/utils/donors";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { BloodDropLoader } from "@/components/ui/blood-drop-loader";
import { MapPin, AlertCircle, Edit2, UserCheck, Upload } from "lucide-react";

interface FormValues {
  fullName: string;
  phoneNumber: string;
  alternativePhone: string;
  pin: string;
  email: string;
  bloodGroup: string;
  city: string;
  district: string;
  state: string;
  country: string;
  profilePicture?: FileList;
}

export default function DonorRegistration() {
  const { coordinates, address, loading, error } = useGeolocation();
  const [submitted, setSubmitted] = useState(false);
  const [donorProfile, setDonorProfile] = useState<FormValues | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      alternativePhone: "",
      pin: "",
      email: "",
      bloodGroup: "",
      city: address?.city || "",
      district: address?.district || "",
      state: address?.state || "",
      country: address?.country || ""
    }
  });

  const profilePicture = watch("profilePicture");

  React.useEffect(() => {
    if (profilePicture && profilePicture[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(profilePicture[0]);
    }
  }, [profilePicture]);

  React.useEffect(() => {
    if (address) {
      setValue("city", address.city || "");
      setValue("district", address.district || "");
      setValue("state", address.state || "");
      setValue("country", address.country || "");
    }
  }, [address, setValue]);

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    
    toast({
      title: "Registration Successful!",
      description: "Thank you for registering as a blood donor.",
      variant: "default",
    });
    
    setSubmitted(true);
    setDonorProfile(data);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSubmitted(false);
  };

  return (
    <MainLayout>
      <div className="container py-10 md:py-16 max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">
            {submitted ? "Donor Profile" : "Register as Blood Donor"}
          </h1>
          <p className="text-muted-foreground">
            {submitted 
              ? "Thank you for joining our network of life-savers. Here's your profile information."
              : "Join our network of life-savers by registering as a blood donor today."}
          </p>
        </div>
        
        {submitted && donorProfile && (
          <div className="bg-card rounded-xl shadow-sm border p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 rounded-full overflow-hidden bg-primary/10">
                  {previewImage ? (
                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <UserCheck className="h-8 w-8 text-primary" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{donorProfile.fullName}</h2>
                  <p className="text-muted-foreground">{donorProfile.email}</p>
                </div>
              </div>
              <Button onClick={handleEdit} variant="outline" className="gap-2">
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Phone Numbers</p>
                <p className="font-medium">{donorProfile.phoneNumber}</p>
                {donorProfile.alternativePhone && (
                  <p className="font-medium text-muted-foreground">Alt: {donorProfile.alternativePhone}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Blood Group</p>
                <p className="font-medium">
                  <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary">
                    {donorProfile.bloodGroup}
                  </span>
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">
                  {donorProfile.city}, {donorProfile.district}<br />
                  {donorProfile.state}, {donorProfile.country}
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">PIN Code</p>
                <p className="font-medium">{donorProfile.pin}</p>
              </div>
            </div>
          </div>
        )}
        
        {!submitted && (
          <div className="bg-card rounded-xl shadow-sm border p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3 p-4 rounded-lg bg-accent">
              <MapPin className="h-5 w-5 text-primary" />
              <div className="flex-1">
                {loading && <span className="text-sm">Detecting your location...</span>}
                {error && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}
                {address && !loading && (
                  <span className="text-sm">
                    Location detected: <strong>{address.formatted}</strong>
                  </span>
                )}
              </div>
              {loading && <BloodDropLoader className="w-auto h-6" />}
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-24 w-24 rounded-full overflow-hidden bg-accent relative">
                    {previewImage ? (
                      <img src={previewImage} alt="Profile preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <UserCheck className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="profilePicture" className="block mb-2">Profile Picture</Label>
                    <Input
                      id="profilePicture"
                      type="file"
                      accept="image/*"
                      className="cursor-pointer"
                      {...register("profilePicture")}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Personal Information</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName"
                      {...register("fullName", { required: "Full name is required" })}
                    />
                    {errors.fullName && (
                      <span className="text-sm text-destructive">{errors.fullName.message}</span>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input 
                      id="phoneNumber"
                      {...register("phoneNumber", { 
                        required: "Phone number is required",
                        pattern: {
                          value: /^[0-9+\-\s]+$/,
                          message: "Please enter a valid phone number"
                        }
                      })}
                    />
                    {errors.phoneNumber && (
                      <span className="text-sm text-destructive">{errors.phoneNumber.message}</span>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="alternativePhone">Alternative Phone Number</Label>
                    <Input 
                      id="alternativePhone"
                      {...register("alternativePhone", {
                        pattern: {
                          value: /^[0-9+\-\s]+$/,
                          message: "Please enter a valid phone number"
                        }
                      })}
                    />
                    {errors.alternativePhone && (
                      <span className="text-sm text-destructive">{errors.alternativePhone.message}</span>
                    )}
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email"
                      type="email"
                      {...register("email", { 
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Please enter a valid email address"
                        }
                      })}
                    />
                    {errors.email && (
                      <span className="text-sm text-destructive">{errors.email.message}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Location Information</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="pin">PIN Code</Label>
                    <Input 
                      id="pin"
                      {...register("pin", { 
                        required: "PIN code is required",
                        pattern: {
                          value: /^[0-9]{6}$/,
                          message: "Please enter a valid 6-digit PIN code"
                        }
                      })}
                    />
                    {errors.pin && (
                      <span className="text-sm text-destructive">{errors.pin.message}</span>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city"
                      {...register("city", { required: "City is required" })}
                    />
                    {errors.city && (
                      <span className="text-sm text-destructive">{errors.city.message}</span>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="district">District</Label>
                    <Input 
                      id="district"
                      {...register("district", { required: "District is required" })}
                    />
                    {errors.district && (
                      <span className="text-sm text-destructive">{errors.district.message}</span>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input 
                      id="state"
                      {...register("state", { required: "State is required" })}
                    />
                    {errors.state && (
                      <span className="text-sm text-destructive">{errors.state.message}</span>
                    )}
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="country">Country</Label>
                    <Input 
                      id="country"
                      {...register("country", { required: "Country is required" })}
                    />
                    {errors.country && (
                      <span className="text-sm text-destructive">{errors.country.message}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Donation Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select 
                    onValueChange={(value) => setValue("bloodGroup", value)}
                    required
                  >
                    <SelectTrigger id="bloodGroup">
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodGroups.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.bloodGroup && (
                    <span className="text-sm text-destructive">{errors.bloodGroup.message}</span>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <input 
                    type="checkbox" 
                    id="consent" 
                    className="mt-1"
                    required 
                  />
                  <label htmlFor="consent" className="text-sm">
                    I consent to be contacted by BloodConnect or authorized medical facilities when my blood type is needed. I understand my information will be used only for blood donation purposes.
                  </label>
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {isEditing ? "Update Profile" : "Register as Donor"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
