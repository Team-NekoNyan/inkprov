import React, { useEffect, useState } from "react";
import {
  Feather,
  House,
  BookOpen,
  PenTool,
  User,
  Settings,
  LogOut,
  PanelRightOpen,
  GitBranchPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase, getUsername, getProfilePicture } from "@/utils/supabase";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Check if we're in development mode
// eslint-disable-next-line no-undef
const isDevelopment = process.env.NODE_ENV === "development";

interface HeaderProps {
  loggedIn: boolean;
  page: string;
}

const Header: React.FC<HeaderProps> = function Header({ loggedIn, page }) {
  const navigate = useNavigate();
  const { isAuthenticated, user, setIsAuthenticated, setUser } = useAuth();
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [currentProfilePicture, setCurrentProfilePicture] = useState<string>();
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    // Get username
    const fetchUsername = async () => {
      const usernameData = await getUsername();
      const user = usernameData[0].user_profile_name.split("@")[0];
      const username = user[0].toUpperCase() + user.substring(1);
      setUsername(username);
    };

    // Get Profile Picture
    const fetchProfilePicture = async () => {
      const profilePicture = await getProfilePicture();
      setCurrentProfilePicture(profilePicture);
    };

    fetchUsername();
    fetchProfilePicture();
  });

  const handleLoggedInHomepage = () => {
    if (isAuthenticated) {
      navigate("/sessions");
    } else {
      navigate("/");
    }
  };

  const handleLogout = async () => {
    try {
      setPopoverOpen(false);
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
  const getInitials = () => {
    if (!user?.email) return "?";
    return user.email
      .split("@")[0]
      .split(".")
      .map((n: string) => n[0].toUpperCase())
      .join("");
  };

  const headerLayout = (
    <>
      <div
        className={
          page === "/login" || page === "/register"
            ? "lg:col-start-2 border-b border-primary-border p-4 bg-background"
            : "justify-self-start"
        }
      >
        <div className="flex items-center text-primary-text">
          <Feather
            className="cursor-pointer"
            onClick={handleLoggedInHomepage}
          />
          <Button
            className="text-primary-text text-xl font-bold pl-2 hover:no-underline cursor-pointer"
            variant="link"
            onClick={handleLoggedInHomepage}
          >
            Inkprov
          </Button>

          {/* Development Mode Indicator */}
          {/* {isDevelopment && (
          <div
            className="ml-2 relative px-2 py-1 rounded-md bg-amber-100 border border-amber-300 flex items-center"
            title="Development Environment"
          >
            <GitBranchPlus className="h-4 w-4 text-amber-600" />
            <span className="ml-1 text-xs font-medium text-amber-700">DEV</span>
          </div>
        )} */}
        </div>
      </div>
      {page === "/login" || page === "/register" ? null : loggedIn ? (
        // Navigation menu only appears if the user has logged in
        <>
          <NavigationMenu className="hidden md:grid md:place-self-center">
            <NavigationMenuList>
              <NavigationMenuItem className="group/sessions">
                <NavigationMenuLink
                  onClick={() => navigate("/sessions")}
                  className="hover:bg-transparent cursor-pointer "
                >
                  <div className="flex gap-1 items-center cursor-pointer ">
                    <House className="text-primary-text group-hover/sessions:text-hover-text" />
                    <p className="text-base text-primary-text group-hover/sessions:text-hover-text">
                      Sessions
                    </p>
                  </div>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className="group/stories">
                <NavigationMenuLink
                  onClick={() => navigate("/stories")}
                  className="hover:bg-transparent cursor-pointer"
                >
                  <div className="flex gap-1 items-center cursor-pointer">
                    <BookOpen className="text-primary-text group-hover/stories:text-hover-text" />
                    <p className="text-base text-primary-text group-hover/stories:text-hover-text">
                      Stories
                    </p>
                  </div>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className="group/create">
                <NavigationMenuLink
                  onClick={() => navigate("/sessions/create")}
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
          <div className="hidden md:block md:justify-self-end">
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Avatar className="w-10 h-10 cursor-pointer">
                  <AvatarImage
                    src={
                      currentProfilePicture || user?.user_metadata?.avatar_url
                    }
                  />
                  <AvatarFallback className="bg-white">
                    {getInitials()}
                  </AvatarFallback>
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
                      {username}
                    </h1>
                    <p className="text-secondary-text">{user?.email}</p>
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        setPopoverOpen(false);
                        navigate("/profile");
                      }}
                      className="w-full flex gap-2 p-2 text-primary-text cursor-pointer hover:bg-menu-hover"
                    >
                      <User />
                      <p>Profile</p>
                    </button>
                    <button
                      onClick={() => {
                        setPopoverOpen(false);
                        navigate("/settings");
                      }}
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
          {/* in mobile will display a panel right open icon */}
          <nav className="items-center justify-self-end md:hidden">
            <Sheet>
              {/* Button to open menu */}
              <SheetTrigger asChild>
                <PanelRightOpen className="text-primary-text cursor-pointer w-9 h-9" />
              </SheetTrigger>

              {/* Side Menu Content */}
              <SheetContent side="right" className="w-35 ">
                <div className="p-4 flex flex-col space-y-4">
                  <div className="pb-3 border-b border-primary-border">
                    <Avatar className="w-10 h-10 ">
                      <AvatarImage
                        src={
                          currentProfilePicture ||
                          user?.user_metadata?.avatar_url
                        }
                      />
                      <AvatarFallback className="bg-white">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <a
                    href="/profile"
                    className="w-full flex gap-2 p-2 text-primary-text cursor-pointer hover:bg-menu-hover "
                  >
                    <User />
                    <p>Profile</p>
                  </a>
                  <a
                    href="/sessions"
                    className="w-full flex gap-2 p-2 text-primary-text cursor-pointer hover:bg-menu-hover "
                  >
                    <House />
                    <p>Sessions</p>
                  </a>
                  <a
                    href="/stories"
                    className="w-full flex gap-2 p-2 text-primary-text cursor-pointer hover:bg-menu-hover "
                  >
                    <BookOpen />
                    <p>Stories</p>
                  </a>
                  <a
                    href="/sessions/create"
                    className="w-full flex gap-2 p-2 text-primary-text cursor-pointer hover:bg-menu-hover "
                  >
                    <PenTool />
                    <p>Create</p>
                  </a>

                  <a
                    href="/settings"
                    className="w-full flex gap-2 p-2 text-primary-text cursor-pointer hover:bg-menu-hover"
                  >
                    <Settings />
                    <p>Settings</p>
                  </a>
                  <a
                    onClick={handleLogout}
                    className=" w-full flex gap-2 p-2 text-primary-text cursor-pointer hover:bg-menu-hover"
                  >
                    <LogOut />
                    <p>Logout</p>
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </nav>
        </>
      ) : (
        <div className="col-start-3 justify-self-end flex gap-4">
          {/* Auth Buttons */}
          <Button
            className="text-primary-text text-md hover:no-underline hover:text-hover-text cursor-pointer"
            variant="link"
            onClick={() => navigate("/login")}
          >
            Sign In
          </Button>

          <Button
            className="bg-primary-button hover:bg-primary-button-hover cursor-pointer"
            variant="default"
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
        </div>
      )}
    </>
  );

  return (
    <header
      className={
        page === "/login" || page === "/register"
          ? "grid grid-cols-1 lg:grid-cols-2 bg-accent"
          : "sticky w-full top-0 z-50 py-4 px-6 border-b border-primary-border grid grid-cols-2 bg-background md:grid-cols-3"
      }
    >
      {headerLayout}
    </header>
  );
};

export default Header;
