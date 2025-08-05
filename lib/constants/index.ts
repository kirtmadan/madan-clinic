import {
  CreditCardIcon,
  LayoutGridIcon,
  UserIcon,
  UserStarIcon,
} from "lucide-react";

export const sidebarData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      roles: ["OWNER", "MEMBER"],
      icon: LayoutGridIcon,
      isActive: true,
    },
    {
      title: "Doctors",
      url: "/doctors",
      roles: ["OWNER", "MEMBER"],
      icon: UserStarIcon,
    },
    {
      title: "Patients",
      url: "/patients",
      icon: UserIcon,
      roles: ["OWNER", "MEMBER"],
    },
    {
      title: "Billing",
      url: "/billing",
      roles: ["OWNER"],
      icon: CreditCardIcon,
    },
  ],
};
