"use client";

import { useEffect } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

import { CityMultiSelect } from "./CityMultiSelect";
import { useNavigate } from "react-router-dom";
import YearRangeSelect from "../YearRange";





export function SearchForm({
  districts,
  setDistricts,
  range,
  setRange,
  category,
  setCategory,
  ...props
}: any) {

  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams({
      district: districts.join(","),
      start: String(range[0]),
      end: String(range[1]),
      category: category.join(",")
    });

    navigate(`/?${params.toString()}`, { replace: true });

  }, [districts, range, category]);

  return (
    <form {...props} onSubmit={(e) => e.preventDefault()}>
      <SidebarGroup className="py-0">
        <SidebarGroupContent>

          <CityMultiSelect value={districts} onChange={setDistricts} />

          <YearRangeSelect
            initialStart={range?.[0]}
            initialEnd={range?.[1]}
            onChange={setRange}
          />

          {category.includes("Hospitals") && (
            <div className="mt-4">
              {/* <Label htmlFor="hospital-search" className="text-xs font-semibold mb-2 block">
                Hospital Name
              </Label>
              <Input
                id="hospital-search"
                placeholder="Search hospital..."
                value={props.hospitalSearch}
                onChange={(e) => props.setHospitalSearch && props.setHospitalSearch(e.target.value)}
                className="bg-white"
              /> */}
            </div>
          )}

        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  );
}
