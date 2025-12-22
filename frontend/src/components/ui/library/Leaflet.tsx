import React, { useEffect, useRef, useState } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "@/components/theme-provider";
import { FeatureCollection } from "geojson";
import { useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const Leaflet: React.FC<{
  brightness: number;
  opacity: number;
  filters?: any;
}> = ({ brightness, opacity, filters }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [mouseLatLng, setMouseLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const lightTileRef = useRef<L.TileLayer | null>(null);
  const darkTileRef = useRef<L.TileLayer | null>(null);
  const pointLayerRef = useRef<L.LayerGroup | null>(null);

  const { theme } = useTheme();
  const location = useLocation();

  function toDegree(value: number, type: "lat" | "lng") {
    const abs = Math.abs(value).toFixed(5);
    const direction =
      type === "lat" ? (value >= 0 ? "N" : "S") : value >= 0 ? "E" : "W";
    return `${abs}° ${direction}`;
  }

  // ---------------- FETCH GEOJSON ----------------
  const fetchGeoJson = async (filters: any) => {
    if (!mapRef.current) return;
    const bounds = mapRef.current.getBounds();

    const query = new URLSearchParams({
      district: filters?.district || "",
      start: filters?.start || "",
      end: filters?.end || "",
      category: filters?.category || "",
      minLng: bounds.getWest().toString(),
      minLat: bounds.getSouth().toString(),
      maxLng: bounds.getEast().toString(),
      maxLat: bounds.getNorth().toString(),
    }).toString();

    const res = await fetch(`http://localhost:5000/locations?${query}`);
    const data: FeatureCollection = await res.json();

    drawPoints(data);
  };

  // ---------------- DRAW ONLY SMALL DOTS ----------------
  // const drawPoints = (geojson: FeatureCollection) => {
  //   if (!mapRef.current || !pointLayerRef.current) return;

  //   const zoom = mapRef.current.getZoom();
  //   pointLayerRef.current.clearLayers();

  //   if (zoom < 10) return;

  //   geojson.features.forEach((feature: any) => {
  //     const geom = feature.geometry;
  //     if (!geom) return;

  //     const addDot = (lng: number, lat: number) => {
  //       L.circleMarker([lat, lng], {
  //         radius: 1,
  //         fillColor: "#ff0000",
  //         fillOpacity: 1,
  //         stroke: false,
  //       }).addTo(pointLayerRef.current!);

  //     };

  //     if (geom.type === "Polygon") {
  //       geom.coordinates[0].forEach(([lng, lat]: number[]) =>
  //         addDot(lng, lat)
  //       );
  //     }

  //     if (geom.type === "MultiPolygon") {
  //       geom.coordinates.forEach((poly: any) => {
  //         poly[0].forEach(([lng, lat]: number[]) =>
  //           addDot(lng, lat)
  //         );
  //       });
  //     }
  //   });
  // };

  const drawPoints = (geojson: FeatureCollection) => {
    if (!mapRef.current || !pointLayerRef.current) return;

    const zoom = mapRef.current.getZoom();
    pointLayerRef.current.clearLayers();

    // performance: don't draw when zoomed out
    if (zoom < 10) return;

    geojson.features.forEach((feature: any) => {
      if (!feature.geometry || feature.geometry.type !== "Point") return;

      const [lng, lat] = feature.geometry.coordinates;

      L.circleMarker([lat, lng], {
        radius: zoom >= 12 ? 3 : 1.5,
        fillColor: "#820b0bff",
        fillOpacity: 0.9,
        stroke: false,
      })
        .bindTooltip(
          `
        <b>${feature.properties.village}</b><br/>
        ${feature.properties.district}
        `,
          { sticky: true }
        )
        .addTo(pointLayerRef.current!);
    });
  };

  // ---------------- MAP INIT ----------------
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
    }).setView([20, 78], 5);

    mapRef.current = map;

    // FIX LEAFLET Z-INDEX
    map.createPane("tiles");
    map.getPane("tiles")!.style.zIndex = "200";

    lightTileRef.current = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      { pane: "tiles", opacity: opacity / 100 }
    );

    darkTileRef.current = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      { pane: "tiles", opacity: opacity / 100 }
    );

    lightTileRef.current.addTo(map);

    L.control.zoom({ position: "topright" }).addTo(map);

    pointLayerRef.current = L.layerGroup().addTo(map);

    map.on("zoomend", () => fetchGeoJson(filters || {}));

    map.on("mousemove", (e: L.LeafletMouseEvent) => {
      setMouseLatLng(e.latlng);
    });

    map.on("mouseout", () => {
      setMouseLatLng(null);
    });

    fetchGeoJson(filters || {});

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ---------------- OPACITY ----------------
  useEffect(() => {
    lightTileRef.current?.setOpacity(opacity / 100);
    darkTileRef.current?.setOpacity(opacity / 100);
  }, [opacity]);

  // ---------------- BRIGHTNESS ----------------
  // useEffect(() => {
  //   const pane = document.querySelector(".leaflet-tile-pane") as HTMLElement;
  //   if (pane) pane.style.filter = `brightness(${brightness}%)`;
  // }, [brightness]);
  useEffect(() => {
    const lightContainer = lightTileRef.current?.getContainer();
    const darkContainer = darkTileRef.current?.getContainer();

    if (lightContainer)
      lightContainer.style.filter = `brightness(${brightness}%)`;
    if (darkContainer)
      darkContainer.style.filter = `brightness(${brightness}%)`;
  }, [brightness, theme]);

  // ---------------- THEME ----------------
  useEffect(() => {
    if (!mapRef.current) return;

    if (theme === "dark") {
      lightTileRef.current && mapRef.current.removeLayer(lightTileRef.current);
      darkTileRef.current?.addTo(mapRef.current);
    } else {
      darkTileRef.current && mapRef.current.removeLayer(darkTileRef.current);
      lightTileRef.current?.addTo(mapRef.current);
    }
  }, [theme]);

  // ---------------- FILTER CHANGE ----------------
  useEffect(() => {
    if (filters) fetchGeoJson(filters);
  }, [filters]);

  // ---------------- URL CHANGE ----------------
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    fetchGeoJson({
      district: params.get("district"),
      start: params.get("start"),
      end: params.get("end"),
      category: params.get("category"),
    });
  }, [location.search]);

  return (
    <div className="relative w-full h-screen">
      {/* MAP (BACKSIDE) */}
      <div ref={mapContainerRef} className="absolute inset-0 z-0" />

      {/* LAT / LNG CARD */}
      <Card
        className="
            absolute
            top-4
            left-1/2
            -translate-x-1/2
            z-50
            w-[300px]
            bg-card/80
            backdrop-blur-sm
            shadow-xl
          "
      >
        <CardContent className="flex justify-center gap-4 text-sm py-3 px-6">
          <p>lat: {mouseLatLng ? toDegree(mouseLatLng.lat, "lat") : "--"}</p>
          <p>lng: {mouseLatLng ? toDegree(mouseLatLng.lng, "lng") : "--"}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaflet;
