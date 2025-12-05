import React, { useEffect, useRef } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "@/components/theme-provider";
import { FeatureCollection } from "geojson";
import { useLocation } from "react-router-dom";


const Leaflet: React.FC<{ brightness: number; opacity: number; filters?: any }> = ({
  brightness,
  opacity,
  filters,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | any>(null); // allow custom layer property

  const lightTileRef = useRef<L.TileLayer | null>(null);
  const darkTileRef = useRef<L.TileLayer | null>(null);

  const { theme } = useTheme();

  const location = useLocation();

useEffect(() => {
  const params = new URLSearchParams(location.search);
  const district = params.get("district") || "";
  const start = params.get("start") || "";
  const end = params.get("end") || "";
  const fire = params.get("fire") || "";

  const initialFilters = { district, start, end, fire };
  fetchGeoJson(initialFilters);
}, [location.search]);


  // ⬇️ FRONTEND FILTERED DATA FUNCTION
  const fetchGeoJson = (filters: any) => {
    fetch("http://localhost:5000/locations")
      .then((res) => res.json())
      .then((data) => {
        if (!mapInstanceRef.current) return;

        // FRONTEND FILTERING LOGIC
        const filteredData = data.features.filter((f:any) => {
          // Only show data if filters match exactly
          const show =
            filters.district === "Tiruchirappalli" &&
            filters.start === "2025" &&
            filters.end === "2025" &&
            filters.fire === "yes";
          return show;
        });

        const newGeoJson:FeatureCollection  = {
          type: "FeatureCollection",
          features: filteredData,
        };

        // remove old layer if exists
        if (mapInstanceRef.current._geoJsonLayer) {
          mapInstanceRef.current.removeLayer(mapInstanceRef.current._geoJsonLayer);
        }

        // add new filtered layer
        const layer = L.geoJSON(newGeoJson).addTo(mapInstanceRef.current);
        mapInstanceRef.current._geoJsonLayer = layer;
      })
      .catch((err) => console.error("GeoJSON fetch error", err));
  };

  useEffect(() => {
  if (filters) fetchGeoJson(filters);
}, [filters]);

  // 🌍 Create map once
  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,
      }).setView([40, -74], 5);

      // tiles
      lightTileRef.current = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
        opacity: opacity / 100,
      });

      darkTileRef.current = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          attribution: "© CARTO",
          opacity: opacity / 100,
        }
      );

      // default is light
      lightTileRef.current.addTo(mapInstanceRef.current);

      L.control.zoom({ position: "topright" }).addTo(mapInstanceRef.current);

      // load initial data with default filters
      fetchGeoJson(filters || {});
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 🎛 Update opacity of both layers
  useEffect(() => {
    if (lightTileRef.current) lightTileRef.current.setOpacity(opacity / 100);
    if (darkTileRef.current) darkTileRef.current.setOpacity(opacity / 100);
  }, [opacity]);

  // 💡 Update brightness
  useEffect(() => {
    const tilePane = document.querySelector(".leaflet-tile-pane") as HTMLElement;
    if (tilePane) tilePane.style.filter = `brightness(${brightness}%)`;
  }, [brightness]);

  // 🌓 Theme switching
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (theme === "dark") {
      if (lightTileRef.current) map.removeLayer(lightTileRef.current);
      if (darkTileRef.current) darkTileRef.current.addTo(map);
    } else {
      if (darkTileRef.current) map.removeLayer(darkTileRef.current);
      if (lightTileRef.current) lightTileRef.current.addTo(map);
    }
  }, [theme]);

  // 🔄 Re-fetch when filters change
  useEffect(() => {
    if (filters) {
      fetchGeoJson(filters);
    }
  }, [filters]);

  return (
    <div
      ref={mapContainerRef}
      style={{
        height: "100vh",
        width: "100%",
        zIndex: 0,
      }}
    />
  );
};

export default Leaflet;
