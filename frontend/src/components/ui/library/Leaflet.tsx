import React, { useEffect, useRef } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "@/components/theme-provider";

const Leaflet: React.FC<{ brightness: number; opacity: number }> = ({ brightness, opacity }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const lightTileRef = useRef<L.TileLayer | null>(null);
  const darkTileRef = useRef<L.TileLayer | null>(null);

  const { theme } = useTheme();


  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,
      }).setView([40, -74], 5);

      lightTileRef.current = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 19,
          attribution: "© OpenStreetMap",
          opacity: opacity / 100
        }
      );

   
      darkTileRef.current = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          attribution: "© CARTO",
          opacity: opacity / 100
        }
      );

 
      lightTileRef.current.addTo(mapInstanceRef.current);

      L.control.zoom({ position: "topright" }).addTo(mapInstanceRef.current);

      // fetch geojson
      fetch("http://localhost:5000/locations")
        .then((res) => res.json())
        .then((data) => {
          L.geoJSON(data).addTo(mapInstanceRef.current!);
        })
        .catch((err) => console.error(err));
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
  if (lightTileRef.current) {
    lightTileRef.current.setOpacity(opacity / 100);
  }
  if (darkTileRef.current) {
    darkTileRef.current.setOpacity(opacity / 100);
  }
}, [opacity]);


  useEffect(() => {
  const tilePane = document.querySelector(".leaflet-tile-pane") as HTMLElement;
  if (tilePane) {
    tilePane.style.filter = `brightness(${brightness}%)`;
  }
   }, [brightness]);


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
