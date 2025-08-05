"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOutIcon, UserIcon } from "lucide-react";

interface HeaderProps {
  showMenu?: boolean;
  menuButtonFunction?: () => void;
}

export default function Header({ showMenu, menuButtonFunction }: HeaderProps) {
  return (
    <header className="bg-sidebar drop-shadow-xs h-16 w-full pl-8 pr-4 flex items-center justify-between rounded-l-xl">
      <h3 className="text-lg font-medium">Dashboard</h3>

      <NavLinks />
    </header>
  );
}

export function NavLinks() {
  return (
    <nav className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="size-10 cursor-pointer">
            <AvatarImage src="/images/s.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer">
              <UserIcon />
              Profile
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem variant="destructive" className="cursor-pointer">
            <LogOutIcon />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
