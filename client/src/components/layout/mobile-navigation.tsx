import { Link, useLocation } from "wouter";
import { NAV_ITEMS } from "@/lib/constants";

export function MobileNavigation() {
  const [location] = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:hidden z-50">
      <div className="flex justify-around py-3">
        {NAV_ITEMS.map((item) => (
          <Link key={item.path} href={item.path}>
            <a className={`flex flex-col items-center ${location === item.path ? 'text-primary' : 'text-muted-foreground'}`}>
              <i className={`fa-solid ${item.icon} text-lg`}></i>
              <span className="text-xs mt-1">{item.label}</span>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
