import { AppSidebar } from "@/components/ui/sidebar/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Leaflet from "./components/ui/library/Leaflet"
import { ModeToggle } from "./components/ui/mode-toggle"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <ModeToggle></ModeToggle>
        </header>
        <div className="flex">
          <Leaflet></Leaflet>
        </div>
      </SidebarInset>
    </SidebarProvider>

    
  )
}
