"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useHeader } from "@/hooks/useHeader";
import { useRouter } from "next/navigation";
import { LogOut, Settings, User } from "lucide-react";
import { useLogout } from "@/hooks/use-auth-hook";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user-hook";
import { SidebarTrigger } from "./ui/sidebar";
import ThemeToggle from "./theme-toggle";

const Header = () => {
  const {title } = useHeader();
  const { mutateAsync: logout } = useLogout();
  const { user, clearUser } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    await logout()
      .then(() => {
        toast({
          title: "User logged out successfully!",
        });
        clearUser();
        router.push("/login");
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Something went wrong.",
          variant: "destructive",
        });
      });
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
      <SidebarTrigger className="" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center">
          {title}
        </div>

        <div className="gap-4 flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline flex gap-2 mr-2 items-center p-1">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>
                {user ? user.firstName[0] + user.lastName[0] : "?"}
              </AvatarFallback>
            </Avatar>
            <span className="hidden lg:block">
              {user?.firstName} {user?.lastName}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <User className="mr-2 h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className="mr-2 h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="text-red-500">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
