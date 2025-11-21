import { AppSidebar } from "@/components/ui/sidebar/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import Leaflet from "./components/ui/library/Leaflet"
import { ModeToggle } from "./components/ui/mode-toggle"
import { cn } from "./lib/utils"

function SidebarInsetContent() {
  const { open } = useSidebar();
  return (
    <SidebarInset>
      <header className="flex absolute top-0 left-12 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className={cn("-ml-1 bg-white/45 dark:bg-black/45 z-1",
          open ? "ml-50" : "-ml-12"
        )} />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
      </header>
      <div className="flex">
        <Leaflet></Leaflet>
        <ModeToggle className="bg-white/45 dark:bg-black/45! z-2 absolute bottom-5 right-2"></ModeToggle>
      </div>
    </SidebarInset>
  )

}

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInsetContent /> 
    </SidebarProvider>


  )
}
