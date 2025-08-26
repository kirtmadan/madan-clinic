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
import { sidebarData } from "@/lib/constants";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/actions/auth.actions";

export default function Header() {
  const pathname = usePathname();
  const title =
    sidebarData.navMain.find((x) => x?.url === pathname)?.title || "Dashboard";

  return (
    <header className="sticky top-0 left-0 z-50 bg-sidebar border border-l-0 drop-shadow-xs py-3 w-full px-8 flex items-center justify-between">
      <h3 className="text-lg font-medium">{title}</h3>

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
          {/*<DropdownMenuLabel>My Account</DropdownMenuLabel>*/}
          {/*<DropdownMenuGroup>*/}
          {/*  <DropdownMenuItem className="cursor-pointer">*/}
          {/*    <UserIcon />*/}
          {/*    Profile*/}
          {/*  </DropdownMenuItem>*/}
          {/*</DropdownMenuGroup>*/}

          {/*<DropdownMenuSeparator />*/}

          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onClick={signOut}
          >
            <LogOutIcon />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
