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
      url: "#",
      icon: IconUserFilled,
    },
    {
      title: "Appointments",
      url: "#",
      icon: IconCalendarClock,
    },
    {
      title: "Diagnoses",
      url: "#",
      icon: IconClipboardSearch,
    },
    {
      title: "Prescriptions",
      url: "#",
      icon: IconPillFilled,
    },
  ]
}

export function AppSidebar({
  onLogin,
  loggedIn,
  ...props
}) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} onLogin={onLogin}  />
      </SidebarFooter>
    </Sidebar>
  );
}
