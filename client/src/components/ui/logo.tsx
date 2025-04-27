import { useTheme } from "@/hooks/use-theme";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  showTagline?: boolean;
}

export function Logo({ size = "md", showTagline = false }: LogoProps) {
  const { theme } = useTheme();
  
  const sizeClasses = {
    sm: "h-12",
    md: "h-16",
    lg: "h-24",
    xl: "h-40",
    "2xl": "h-64",
    "3xl": "h-80",
  };
  
  // Pick the right logo based on the theme
  const logoSrc = theme === "dark" ? "/briv-logo-dark-transparent.png" : "/briv-logo-light-transparent.png";
  
  return (
    <div className="flex items-center">
      <img 
        src={logoSrc} 
        alt="Briv Exchange Logo" 
        className={`${sizeClasses[size]} object-contain`} 
      />
    </div>
  );
}
