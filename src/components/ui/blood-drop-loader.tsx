
import { cn } from "@/lib/utils";

interface BloodDropLoaderProps {
  className?: string;
}

export function BloodDropLoader({ className }: BloodDropLoaderProps) {
  return (
    <div className={cn("flex justify-center items-center", className)}>
      <div className="relative w-16 h-16 animate-pulse">
        <div className="absolute w-full h-full bg-gradient-to-b from-red-400 to-blood-600 rounded-t-full rounded-b-full transform rotate-45"></div>
        <div className="absolute w-full h-full bg-gradient-to-b from-red-400 to-blood-600 rounded-t-full rounded-b-full transform -rotate-45"></div>
        <div className="absolute inset-0 m-auto w-8 h-8 bg-white rounded-full"></div>
      </div>
      <span className="ml-3 text-lg font-medium text-primary">Loading...</span>
    </div>
  );
}
