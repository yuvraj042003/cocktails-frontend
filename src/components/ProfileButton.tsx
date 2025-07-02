import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

const ProfileButton = () => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  if (!user) {
    return (
      <Link to="/login">
        <Button variant="outline" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem className="font-medium">{user.name}</DropdownMenuItem>
        <DropdownMenuSeparator />
        
        {/* Regular user menu items */}
        {!isAdmin && (
          <>
            <DropdownMenuItem asChild>
              <Link to="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/my-bookings">My Bookings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/orders">My Orders</Link>
            </DropdownMenuItem>
          </>
        )}

        {/* Admin menu items */}
        {isAdmin && (
          <>
            <DropdownMenuItem asChild>
              <Link to="/admin">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/users">Manage Users</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/orders">Manage Orders</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/analytics">Analytics</Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 cursor-pointer"
          onClick={logout}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileButton; 