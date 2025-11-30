// import React, { useEffect, useRef } from 'react';
// import * as L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// const Leaflet: React.FC = () => {
//   // Ref for the div element that will hold the map
//   const mapContainerRef = useRef<HTMLDivElement>(null);
//   // Ref to store the Leaflet map instance
//   const mapInstanceRef = useRef<L.Map | null>(null);

//   useEffect(() => {
//     // Check if the DOM element is available and if the map hasn't been initialized yet
//     if (mapContainerRef.current && !mapInstanceRef.current) {
//       // Initialize the map on the ref's current DOM element (disable default zoom control)
//       mapInstanceRef.current = L.map(mapContainerRef.current, { zoomControl: false }).setView([20.5937, 78.9629], 5);

//       // Add the tile layer
//       L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//         maxZoom: 19,
//         attribution: "© OpenStreetMap",
//       }).addTo(mapInstanceRef.current);

//       // Add a new zoom control to the desired position (e.g., 'bottomright')
//       L.control.zoom({
//         position: 'topright' // Options: 'topleft', 'topright', 'bottomleft', 'bottomright'
//       }).addTo(mapInstanceRef.current!);
//     }

//     // Cleanup function to remove the map instance when the component unmounts
//     return () => {
//       if (mapInstanceRef.current) {
//         mapInstanceRef.current.remove();
//         mapInstanceRef.current = null;
//       }
//     };
//   }, []); // Empty dependency array ensures this runs only once on mount

//   // You also need to add CSS styling for the map div (e.g., height) for it to be visible
//   const mapStyles = {
//     height: '100vh', // The map container must have a defined height/width
//     width: '100%',
//     zIndex: 0, // Ensure the map is at the correct stacking context
//   };

//   return <div ref={mapContainerRef} style={mapStyles} />;
// };

// export default Leaflet;






// import React, { useEffect, useRef } from 'react';
// import * as L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// const Leaflet: React.FC = () => {
//   const mapContainerRef = useRef<HTMLDivElement>(null);
//   const mapInstanceRef = useRef<L.Map | null>(null);

//   useEffect(() => {
//     if (mapContainerRef.current && !mapInstanceRef.current) {
//       mapInstanceRef.current = L.map(mapContainerRef.current, { zoomControl: false }).setView([40, -74], 5);

//       L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//         maxZoom: 19,
//         attribution: "© OpenStreetMap",
//       }).addTo(mapInstanceRef.current);

//       L.control.zoom({ position: 'topright' }).addTo(mapInstanceRef.current!);

//       // Corrected fetch URL with port
//       fetch("http://localhost:5000/locations")
//         .then(res => res.json())
//         .then(data => {
//           L.geoJSON(data).addTo(mapInstanceRef.current!);
//         })
//         .catch(err => console.error(err));
//     }

//     return () => {
//       if (mapInstanceRef.current) {
//         mapInstanceRef.current.remove();
//         mapInstanceRef.current = null;
//       }
//     };
//   }, []);

//   const mapStyles = {
//     height: '100vh',
//     width: '100%',
//     zIndex: 0,
//   };

//   return <div ref={mapContainerRef} style={mapStyles} />;
// };

// export default Leaflet;



















import React, { useEffect, useRef } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "@/components/theme-provider";

const Leaflet: React.FC = () => {
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
        }
      );

   
      darkTileRef.current = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          attribution: "© CARTO",
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
