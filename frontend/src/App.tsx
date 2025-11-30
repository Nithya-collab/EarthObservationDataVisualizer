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
  const { open, isMobile } = useSidebar();
  return (
    <SidebarInset>
      <header className="flex absolute top-4 left-12 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className={cn("size-9 bg-orange-200 dark:bg-black z-10",
          isMobile ? "-ml-12" : open ? "ml-32" : "-ml-12"
        )} />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
      </header>
      <div className="flex">
        <Leaflet></Leaflet>
         {/* <Map /> */}
        <Legend className="bg-white/45 dark:bg-black/45!" />
        {/* <ModeToggle className="bg-white/45 dark:bg-black/45! z-2 absolute bottom-5 right-2"></ModeToggle> */}
      <div className="relative">
  <ModeToggle className="mr-20 bg-white/45 dark:bg-black/45 !z-20 absolute top-2 right-2" />
</div>

      </div>
    </SidebarInset>
  )

}

function Legend({ className }: React.ComponentProps<"div">) {
  return (
    <div>
      {/* LEGEND */}
      <div id="legend" className={cn(className, "backdrop-blur-xs absolute bottom-8 right-8 shadow-xl px-6 py-6 rounded-lg space-y-4")}>
        <h2 className="font-semibold text-lg mb-2">Legend</h2>

        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-red-300/40 border border-white/20"></div>
          <span>Low</span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-red-500/40 border border-white/20"></div>
          <span>Medium</span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-red-700/40 border border-white/20"></div>
          <span>High</span>
        </div>
      </div>
    </div>
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
