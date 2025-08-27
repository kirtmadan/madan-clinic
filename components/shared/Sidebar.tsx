"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarProvider,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroupLabel,
  Sidebar as ShadSidebar,
} from "@/components/ui/sidebar";

import {
  CalendarClock,
  ChevronLeftIcon,
  ChevronRightIcon,
  type LucideIcon,
} from "lucide-react";
import { sidebarData } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Sidebar() {
  const user = { user_role: "OWNER" };

  const getSidebarDataByRole = ({
    role,
    navMain,
  }: {
    role: "OWNER" | "MEMBER" | string;
    navMain: any[];
  }) => {
    function hasAccess(item: any): boolean {
      return !item.roles || item.roles.includes(role);
    }

    const filtered = navMain.filter(hasAccess).map((item) => {
      if (item.items) {
        const visibleSubItems = item.items.filter(hasAccess);
        return { ...item, items: visibleSubItems };
      }

      return item;
    });

    return filtered || [];
  };

  return (
    // <>
    <NavMain
      items={
        getSidebarDataByRole({
          role: user?.user_role,
          navMain: sidebarData?.navMain,
        }) ?? []
      }
    />
    // </>
  );
}

export function NavMain({
  items,
}: {
  items:
    | {
        title: string;
        url: string;
        icon?: LucideIcon;
        isActive?: boolean;
        items?: {
          title: string;
          url: string;
        }[];
      }[]
    | any[];
}) {
  const pathname = usePathname();
  const [expand, setExpand] = useState<boolean>(true);

  return (
    <SidebarProvider
      style={{
        // @ts-expect-error - this is needed
        "--sidebar-width": expand ? "15rem" : "4.5rem",
        transition: "width 0.5s ease-in-out",
      }}
    >
      <ShadSidebar
        collapsible="offcanvas"
        className={cn(
          "px-0 pt-4 bg-sidebar drop-shadow-xs transition-[width] duration-300",
          !expand && "w-fit",
        )}
      >
        <div className="flex items-center justify-between mx-4 pb-4 border-b">
          <div className="flex items-center gap-4 w-full">
            <div
              className={cn(
                "size-8 bg-sidebar-primary text-sidebar-primary-foreground rounded-lg grid place-items-center group",
                !expand &&
                  "group-hover:bg-secondary group-hover:text-secondary-foreground/60 group-hover:border cursor-pointer",
              )}
              onClick={() => {
                if (!expand) setExpand(true);
              }}
            >
              <CalendarClock
                size={20}
                className={cn(!expand && "group-hover:hidden")}
              />

              <ChevronRightIcon
                size={20}
                className={cn(!expand && "group-hover:block", "hidden")}
              />
            </div>

            {expand && (
              <h1 className="text-2xl font-semibold text-sidebar-primary">
                Madan
              </h1>
            )}
          </div>

          {expand && (
            <Button
              variant="outline"
              size="icon"
              className="size-6"
              onClick={() => setExpand((prev: boolean) => !prev)}
            >
              <ChevronLeftIcon />
            </Button>
          )}
        </div>

        <SidebarGroup className="pl-0 pr-4">
          {expand && (
            <SidebarGroupLabel className="pl-5">Main Menu</SidebarGroupLabel>
          )}

          <SidebarMenu>
            {items.map((item) => {
              if (item?.items && item.items?.length > 0) {
                return (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={item.items.some(
                      (x: any) => x?.url === pathname,
                    )}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          className={cn(
                            "cursor-pointer [&>svg]:size-[16px] mb-1 data-[state=open]:hover:bg-transparent",
                          )}
                        >
                          {item.icon && <item.icon />}
                          {expand && (
                            <span className="text-sm font-medium ml-2 leading-[150%]">
                              {item.title}
                            </span>
                          )}
                          {/*<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />*/}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="mr-0!">
                          {item.items?.map((subItem: any) => {
                            const isActive = pathname === subItem.url;

                            return (
                              <SidebarMenuSubItem
                                key={subItem.title}
                                className={cn(
                                  "py-1 transition duration-300 hover:bg-accent hover:text-accent-foreground rounded-md!",
                                  isActive &&
                                    "font-semibold bg-sidebar-primary hover:bg-sidebar-primary",
                                )}
                              >
                                <SidebarMenuSubButton
                                  asChild
                                  className={cn(
                                    "cursor-pointer hover:bg-transparent active:bg-transparent",
                                    isActive &&
                                      "font-semibold text-primary-foreground hover:text-primary-foreground",
                                  )}
                                >
                                  <Link href={subItem.url}>
                                    <span className="text-sm ml-2">
                                      {subItem.title}
                                    </span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              } else {
                const isActive = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <Link href={item.url}>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={isActive}
                        className="rounded-l-none pl-5"
                        variant="primary"
                      >
                        {item.icon && <item.icon />}
                        {expand && (
                          <span className="text-sm ml-2 leading-[150%]">
                            {item.title}
                          </span>
                        )}
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                );
              }
            })}
          </SidebarMenu>
        </SidebarGroup>
      </ShadSidebar>
    </SidebarProvider>
  );
}
