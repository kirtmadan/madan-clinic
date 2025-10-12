import {
  BriefcaseMedicalIcon,
  CalendarIcon,
  ChartPieIcon,
  UsersIcon,
  UserStarIcon,
} from "lucide-react";

export const sidebarData = {
  navMain: [
    // {
    //   title: "Dashboard",
    //   url: "/",
    //   roles: ["OWNER", "MEMBER"],
    //   icon: LayoutGridIcon,
    //   isActive: true,
    // },
    {
      title: "Appointments",
      url: "/appointments",
      roles: ["OWNER"],
      icon: CalendarIcon,
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
      icon: UsersIcon,
      roles: ["OWNER", "MEMBER"],
    },
    {
      title: "Treatment Templates",
      url: "/treatment-templates",
      icon: BriefcaseMedicalIcon,
      roles: ["OWNER", "MEMBER"],
    },
    // {
    //   title: "Lab Orders",
    //   url: "/lab-orders",
    //   icon: FlaskConicalIcon,
    //   roles: ["OWNER", "MEMBER"],
    // },
    {
      title: "Reports",
      url: "/reports",
      icon: ChartPieIcon,
      roles: ["OWNER", "MEMBER"],
    },
  ],
};
