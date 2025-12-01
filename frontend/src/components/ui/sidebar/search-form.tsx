import { Label } from "@/components/ui/label"
import {
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar"


import { CityMultiSelect } from "./CityMultiSelect";

export function SearchForm({...props }) {
  return (
    <form {...props}>
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative">

          <Label className="sr-only">Search</Label>

          <CityMultiSelect
            onChange={(values) => console.log("Selected districts:", values)}
          />

        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  );
}
