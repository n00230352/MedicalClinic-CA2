import * as React from "react"
import {
  IconStethoscope,
  IconUserFilled,
  IconDashboard,
  IconCalendarClock,
  IconInnerShadowTop,
  IconPillFilled,
  IconClipboardSearch,
} from "@tabler/icons-react"

import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useLocation } from "react-router";
import { useEffect } from "react";


import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: IconDashboard,
    },
    {
      title: "Doctors",
      url: "/doctors",
      icon: IconStethoscope,
    },
    {
      title: "Patients",
      url: "/patients",
      icon: IconUserFilled,
    },
    {
      title: "Appointments",
      url: "/appointments",
      icon: IconCalendarClock,
    },
    {
      title: "Diagnoses",
      url: "/diagnoses",
      icon: IconClipboardSearch,
    },
    {
      title: "Prescriptions",
      url: "#",
      icon: IconPillFilled,
    },
  ]
}

export function AppSidebar({...props}) {

  const location = useLocation();

  let message = location.state?.message;
  let type = location.state?.type;

  useEffect(() => {
    if (message) {
      if (type === 'error') {
        toast.error(message);
      }
      else if (type === 'success') {
        toast.success(message);
      } else {
        toast(message);
      }
    }
  }, [message]);

  return (
    <>
    <Toaster position="top-right" richColors />
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">DOC</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
    </>
  );
}
