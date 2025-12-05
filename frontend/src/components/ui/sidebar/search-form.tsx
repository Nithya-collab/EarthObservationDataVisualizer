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

          <CityMultiSelect onChange={setDistricts} />

          <YearRangeSelect onChange={setRange} />

        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  );
}
