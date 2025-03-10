import React from "react";
import {
  Feather,
  House,
  BookOpen,
  PenTool,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import { createClient } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;

const supabase = createClient(supabaseUrl, supabaseKey);

interface HeaderProps {
  loggedIn: boolean;
  page: string;
}

const Header: React.FC<HeaderProps> = function Header({ loggedIn, page }) {
  const navigate = useNavigate();
  const { user, setIsAuthenticated, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setIsAuthenticated(false);
      setUser(null);
      toast.success("Successfully logged out");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "An error occurred during logout");
    }
  };

  // Get user's initials for avatar fallback (Google image pull doesn't seem to work yet)
  // TODO: this only gets the first letter of the first name for now, not sure what I did wrong
  const getInitials = () => {
    if (!user?.email) return "?";
    return user.email
      .split("@")[0]
      .split(".")
      .map((n: string) => n[0].toUpperCase())
      .join("");
  };

  // Get user's display name
  const getDisplayName = () => {
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.email) return user.email.split("@")[0];
    return "User";
  };

  return (
    <header className="flex justify-between relative pb-4 before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-screen before:h-px before:bg-primary-border">
      {/* Logo */}
      <div className="flex gap-4 items-center text-primary-text">
        <Feather />
        <a href="/" className="text-xl font-bold">
          Inkprov
        </a>
      </div>
      {page === "login" || page === "register" ? null : loggedIn ? (
        // Navigation menu only appears if the user has logged in
        <>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem className="group/sessions">
                <NavigationMenuLink
                  onClick={() => navigate("/sessions")}
                  className="hover:bg-transparent cursor-pointer"
                >
                  <div className="flex gap-1 items-center cursor-pointer">
                    <House className="text-primary-text group-hover/sessions:text-hover-text" />
                    <p className="text-base text-primary-text group-hover/sessions:text-hover-text">
                      Sessions
                    </p>
                  </div>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className="group/projects">
                <NavigationMenuLink
                  onClick={() => navigate("/projects")}
                  className="hover:bg-transparent cursor-pointer"
                >
                  <div className="flex gap-1 items-center cursor-pointer">
                    <BookOpen className="text-primary-text group-hover/projects:text-hover-text" />
                    <p className="text-base text-primary-text group-hover/projects:text-hover-text">
                      Projects
                    </p>
                  </div>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className="group/create">
                <NavigationMenuLink
                  onClick={() => navigate("/create")}
                  className="hover:bg-transparent cursor-pointer"
                >
                  <div className="flex gap-1 items-center cursor-pointer">
                    <PenTool className="text-primary-text group-hover/create:text-hover-text" />
                    <p className="text-base text-primary-text group-hover/create:text-hover-text">
                      Create
                    </p>
                  </div>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          {/* Profile Picture Account Menu */}
          <div className="flex gap-4 items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="w-9 h-9 cursor-pointer">
                  <AvatarImage src={user?.user_metadata?.avatar_url || ""} />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent
                className="w-full p-0 bg-background"
                side="top"
                align="end"
              >
                <div className="divide-y-2 divide-primary-border border border-primary-border">
                  <div className="pb-2 p-4">
                    <h1 className="text-lg text-primary-text font-medium">
                      {getDisplayName()}
                    </h1>
                    <p className="text-secondary-text">{user?.email}</p>
                  </div>
                  <div>
                    <button
                      onClick={() => navigate("/profile")}
                      className="w-full flex gap-2 p-2 text-primary-text cursor-pointer hover:bg-menu-hover"
                    >
                      <User />
                      <p>Profile</p>
                    </button>
                    <button
                      onClick={() => navigate("/settings")}
                      className="w-full flex gap-2 p-2 text-primary-text cursor-pointer hover:bg-menu-hover"
                    >
                      <Settings />
                      <p>Settings</p>
                    </button>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex gap-2 p-2 text-primary-text cursor-pointer hover:bg-menu-hover"
                  >
                    <LogOut />
                    <p>Logout</p>
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </>
      ) : (
        <div className="flex gap-4">
          {/* Auth Buttons */}
          <Button
            className="text-primary-text text-md hover:no-underline hover:text-hover-text cursor-pointer"
            variant="link"
            onClick={() => window.location.href = "/login"}
          >
            Sign In
          </Button>

          <Button
            className="bg-primary-button hover:bg-primary-button-hover cursor-pointer"
            variant="default"
            onClick={() => window.location.href = "/register"}
          >
            Get Started
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
