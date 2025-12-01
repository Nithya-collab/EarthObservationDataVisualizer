import * as React from "react"
import { GalleryVerticalEnd, Minus, Plus } from "lucide-react"

import { SearchForm } from "@/components/ui/sidebar/search-form"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// This is sample data.
const data = {
  navMain: [
    {
      title: "ENVIRONMENT",
      url: "#",
      items: [
        {
          title: "Forest Fire",
          url: "#",
        },
        {
          title: "Flood",
          url: "#",
        },
        {
          title: "Rainfall",
          url: "#",
        },
        {
          title: "Dryness",
          url: "#",
        },
        {
          title: "River",
          url: "#",
        },
        {
          title: "Pond",
          url: "#",
        },
        {
          title: "Temperature",
          url: "#",
        },
      ],
    },
    {
      title: "DEMOGRAPHICS",
      url: "#",
      items: [
        {
          title: "Population",
          url: "#",
        },
        {
          title: "Villages",
          url: "#",
        },
        {
          title: "Schools",
          url: "#",
        },
      ],
    },
    {
      title: "INFRASTRUCTURE",
      url: "#",
      items: [
        {
          title: "Hospital",
          url: "#",
        },
        {
          title: "Railway",
          url: "#",
        },
        {
          title: "Water Pipes",
          url: "#",
        },
        {
          title: "Airlines",
          url: "#",
        }
      ],
    },
    {
      title: "OTHER",
      url: "#",
      items: [
        {
          title: "Achievements",
          url: "#",
        }
      ],
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  return (
    <Sidebar className="backdrop-blur-xs" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Map Viz</span>
                  <span>v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SearchForm />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data?.navMain?.map((items) => (
              <Collapsible
                key={items.title}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      {items.title}
                      <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {items?.items?.map((item) => (
                        <Label
                          key={item.title}
                          htmlFor={item.title}
                          className="flex gap-2 items-center"
                        >
                          <Input
                            id={item.title}
                            type="checkbox"
                            className="w-[15px] bg-white"
                          />
                          {item.title}
                        </Label>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
