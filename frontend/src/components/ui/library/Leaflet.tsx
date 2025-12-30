import React, { useEffect, useRef } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "@/components/theme-provider";
import { FeatureCollection } from "geojson";
import { useLocation } from "react-router-dom";

const Leaflet: React.FC<{
  brightness: number;
  opacity: number;
  filters?: any;
  onMouseMove?: (latlng: { lat: number; lng: number }) => void;
  onFeatureClick?: (feature: any, latlng?: L.LatLng) => void;
  onFeatureHover?: (feature: any, latlng?: L.LatLng) => void;
}> = ({ brightness, opacity, filters, onMouseMove, onFeatureClick, onFeatureHover }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  const lightTileRef = useRef<L.TileLayer | null>(null);
  const darkTileRef = useRef<L.TileLayer | null>(null);
  const pointLayerRef = useRef<L.LayerGroup | null>(null);
  const populationLayerRef = useRef<L.LayerGroup | null>(null);
  const hospitalLayerRef = useRef<L.LayerGroup | null>(null);
  const riverLayerRef = useRef<L.LayerGroup | null>(null);
  const airlineLayerRef = useRef<L.LayerGroup | null>(null);

  const railwayLayerRef = useRef<L.LayerGroup | null>(null);
  const roadLayerRef = useRef<L.LayerGroup | null>(null);
  const tempLayerRef = useRef<L.LayerGroup | null>(null);
  const stateLayerRef = useRef<L.GeoJSON | null>(null);
  const populationDataCache = useRef<FeatureCollection | null>(null);
  const filtersRef = useRef(filters);

  // Keep filtersRef in sync with props
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const { theme } = useTheme();
  const location = useLocation();
  const indiaBounds = L.latLngBounds(
    [6.4627, 68.1097],   // South-West (India)
    [35.5133, 97.3956]  // North-East (India)
  );

  // Helper to generate distinct colors for states
  const getStateColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return "#" + "00000".substring(0, 6 - c.length) + c;
  };

  const getDensityColor = (d: number) => {
    return d > 1000 ? '#800026' :
      d > 500 ? '#BD0026' :
        d > 200 ? '#E31A1C' :
          d > 100 ? '#FC4E2A' :
            d > 50 ? '#FD8D3C' :
              d > 20 ? '#FEB24C' :
                d > 10 ? '#FED976' :
                  '#FFEDA0';
  };

  // ---------------- FETCH GEOJSON ----------------
  const fetchGeoJson = async (filters: any, isZoomString: string = "false") => {
    if (!mapRef.current) return;
    const isZoom = isZoomString === "true";

    // Check if "Villages" is selected
    const categories = filters?.category ? filters.category.split(",") : [];

    // REMOVED EARLY RETURN TO ALLOW OTHER CATEGORIES TO LOAD independently

    const bounds = mapRef.current.getBounds();

    // 1. Handle Villages
    if (categories.includes("Villages")) {
      const query = new URLSearchParams({
        // ... existing params for villages ...
        district: filters?.district || "",
        start: filters?.start || "",
        end: filters?.end || "",
        category: filters?.category || "",
        minLng: bounds.getWest().toString(),
        minLat: bounds.getSouth().toString(),
        maxLng: bounds.getEast().toString(),
        maxLat: bounds.getNorth().toString()
      }).toString();

      fetch(`http://localhost:5000/locations?${query}`)
        .then(res => res.json())
        .then((data: FeatureCollection) => drawPoints(data))
        .catch(err => console.error(err));
    } else {
      pointLayerRef.current?.clearLayers();
    }

    // 2. Handle Population
    if (categories.includes("Population")) {
      // If zooming, don't re-render population (Leaflet handles scaling)
      if (isZoom && populationLayerRef.current?.getLayers().length) {
        return;
      }

      if (populationDataCache.current) {
        // Use cache if available
        drawPopulation(populationDataCache.current);
      } else {
        fetch(`http://localhost:5000/population`)
          .then(res => res.json())
          .then((data: FeatureCollection) => {
            populationDataCache.current = data;
            drawPopulation(data);
          })
          .catch(err => console.error(err));
      }
    }

    else {
      populationLayerRef.current?.clearLayers();
    }







    // 3. Handle Hospitals
    if (categories.includes("Hospitals")) {
      const query = new URLSearchParams({
        minLng: bounds.getWest().toString(),
        minLat: bounds.getSouth().toString(),
        maxLng: bounds.getEast().toString(),
        maxLat: bounds.getNorth().toString()
      }).toString();

      console.log("Leaflet: Fetching Hospitals...");
      fetch(`http://localhost:5000/hospitals?${query}`)
        .then(res => res.json())
        .then((data: FeatureCollection) => {
          console.log("Leaflet: Hospitals data received", data.features.length);
          drawHospitals(data);
        })
        .catch(err => console.error("Leaflet: Hospital fetch error", err));
    } else {
      hospitalLayerRef.current?.clearLayers();
    }

    // 4. Handle Rivers
    if (categories.includes("River")) {
      console.log("Leaflet: Fetching Rivers...");
      fetch(`http://localhost:5000/rivers`)
        .then(res => res.json())
        .then((data: FeatureCollection) => {
          console.log("Leaflet: Rivers data received", data.features.length);
          drawRivers(data);
        })
        .catch(err => console.error("Leaflet: River fetch error", err));
    } else {
      riverLayerRef.current?.clearLayers();
    }

    // 5. Handle Airlines
    if (categories.includes("Airlines")) {
      console.log("Leaflet: Fetching Airlines...");
      fetch(`http://localhost:5000/airlines`)
        .then(res => res.json())
        .then((data: FeatureCollection) => {
          console.log("Leaflet: Airlines data received", data.features.length);
          drawAirlines(data);
        })
        .catch(err => console.error("Leaflet: Airline fetch error", err));
    } else {
      airlineLayerRef.current?.clearLayers();
    }

    // 6. Handle Railway
    if (categories.includes("Railway")) {
      console.log("Leaflet: Fetching Railways...");
      fetch(`http://localhost:5000/railways`)
        .then(res => res.json())
        .then((data: FeatureCollection) => {
          console.log("Leaflet: Railways data received", data.features.length);
          drawRailways(data);
        })
        .catch(err => console.error("Leaflet: Railway fetch error", err));
    } else {
      railwayLayerRef.current?.clearLayers();
    }

    // 7. Handle Roads
    if (categories.includes("Roads")) {
      console.log("Leaflet: Fetching Roads...");
      fetch(`http://localhost:5000/roads`)
        .then(res => res.json())
        .then((data: FeatureCollection) => {
          console.log("Leaflet: Roads data received", data.features.length);
          drawRoads(data);
        })
        .catch(err => console.error("Leaflet: Roads fetch error", err));
    } else {
      roadLayerRef.current?.clearLayers();
    }

    // 8. Handle Temperature
    if (categories.includes("Temperature")) {
      console.log("Leaflet: Fetching Temperature...");
      fetch(`http://localhost:5000/temperature`)
        .then(res => res.json())
        .then((data: FeatureCollection) => {
          console.log("Leaflet: Temperature data received", data.features.length);
          drawTemperature(data);
        })
        .catch(err => console.error("Leaflet: Temperature fetch error", err));
    } else {
      tempLayerRef.current?.clearLayers();
    }
  };

  const drawTemperature = (geojson: FeatureCollection) => {
    if (!mapRef.current || !tempLayerRef.current) return;
    tempLayerRef.current.clearLayers();

    geojson.features.forEach((feature: any) => {
      if (!feature.geometry || feature.geometry.type !== "Point") return;

      const [lng, lat] = feature.geometry.coordinates;
      const temp = feature.properties.Temperature;

      // Color based on temp
      const color = parseFloat(temp) > 30 ? "#ff5722" : parseFloat(temp) > 20 ? "#ff9800" : "#4caf50";

      const icon = L.divIcon({
        className: "temp-icon",
        html: `<div style="
          background: ${color}; 
          color: white; 
          padding: 4px 8px; 
          border-radius: 12px; 
          font-weight: bold; 
          font-size: 12px;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          text-align: center;
          width: fit-content;
        ">${temp}°C</div>`,
        iconSize: [40, 20],
        iconAnchor: [20, 10]
      });

      const marker = L.marker([lat, lng], {
        pane: "temperature",
        icon: icon
      });

      marker.bindPopup(`
        <strong>${feature.properties.City}</strong><br/>
        Temp: ${temp}°C<br/>
        Condition: ${feature.properties.Description}
      `);

      marker.on("click", (e) => {
        if (onFeatureClick) onFeatureClick(feature, e.latlng);
      });

      marker.addTo(tempLayerRef.current!);
    });
  };

  const drawRivers = (geojson: FeatureCollection) => {
    if (!mapRef.current || !riverLayerRef.current) return;
    riverLayerRef.current.clearLayers();

    L.geoJSON(geojson, {
      pane: "rivers",
      style: {
        color: "#0077be", // River blue
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0 // Rivers are lines generally
      },
      onEachFeature: (feature, layer) => {
        const pathLayer = layer as L.Path;
        pathLayer.bindPopup(`
          <strong>${feature.properties.River_Name || "River"}</strong><br/>
          Origin: ${feature.properties.Origin || "Unknown"}
        `);

        pathLayer.on({
          mouseover: (e) => {
            pathLayer.setStyle({ weight: 4, opacity: 1, color: "#0099ff" });
            if (onFeatureHover) onFeatureHover(feature, e.latlng);
          },
          mouseout: () => {
            pathLayer.setStyle({ weight: 2, opacity: 0.8, color: "#0077be" });
          },
          click: (e) => {
            if (onFeatureClick) onFeatureClick(feature, e.latlng);
          }
        });
      }
    }).addTo(riverLayerRef.current!);
  };

  const getPlaneSvg = (color: string, size: number) => `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="${size}px" height="${size}px">
      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
    </svg>
  `;

  const drawAirlines = (geojson: FeatureCollection) => {
    if (!mapRef.current || !airlineLayerRef.current) return;
    airlineLayerRef.current.clearLayers();

    // Airline/Airport style
    const initialColor = "#5e35b1"; // Deep Purple
    const hoverColor = "#7e57c2";   // Lighter Purple
    const initialSize = 24;
    const hoverSize = 36;

    geojson.features.forEach((feature: any) => {
      if (!feature.geometry || feature.geometry.type !== "Point") return;

      const [lng, lat] = feature.geometry.coordinates;

      const initialIcon = L.divIcon({
        className: "leaflet-plane-icon",
        html: getPlaneSvg(initialColor, initialSize),
        iconSize: [initialSize, initialSize],
        iconAnchor: [initialSize / 2, initialSize / 2],
      });

      const hoverIcon = L.divIcon({
        className: "leaflet-plane-icon-hover",
        html: getPlaneSvg(hoverColor, hoverSize),
        iconSize: [hoverSize, hoverSize],
        iconAnchor: [hoverSize / 2, hoverSize / 2],
      });

      const marker = L.marker([lat, lng], {
        pane: "airlines",
        icon: initialIcon,
      });

      marker.bindPopup(`
        <strong>${feature.properties.Name || "Airport"}</strong><br/>
        Type: ${feature.properties.Type || "Unknown"}<br/>
        ${feature.properties.District || ""}, ${feature.properties.State || ""}
      `);

      marker.on("mouseover", (e) => {
        marker.setIcon(hoverIcon);
        marker.setZIndexOffset(1000); // Bring to front
        if (onFeatureHover) onFeatureHover(feature, e.latlng);
      });

      marker.on("mouseout", () => {
        marker.setIcon(initialIcon);
        marker.setZIndexOffset(0);
      });

      marker.on("click", (e) => {
        if (onFeatureClick) onFeatureClick(feature, e.latlng);
      });

      marker.addTo(airlineLayerRef.current!);
    });
  };

  const drawRailways = (geojson: FeatureCollection) => {
    if (!mapRef.current || !railwayLayerRef.current) return;
    railwayLayerRef.current.clearLayers();

    // Styled like tracks: Two lines per feature
    // 1. Base line (sleepers/width)
    L.geoJSON(geojson, {
      pane: "railways",
      style: {
        color: "#555",
        weight: 3,
        opacity: 0.8
      }
    }).addTo(railwayLayerRef.current!);

    // 2. Dashed line (rails) - Creates track effect
    L.geoJSON(geojson, {
      pane: "railways",
      style: {
        color: "#fff",
        weight: 2,
        dashArray: "4, 8",
        opacity: 1
      },
      onEachFeature: (feature, layer) => {
        const pathLayer = layer as L.Path;
        pathLayer.bindPopup(`
          <strong>${feature.properties.Name || "Railway"}</strong><br/>
          Type: ${feature.properties.Type || "Unknown"}
        `);
      }
    }).addTo(railwayLayerRef.current!);
  };

  const drawRoads = (geojson: FeatureCollection) => {
    if (!mapRef.current || !roadLayerRef.current) return;
    roadLayerRef.current.clearLayers();

    L.geoJSON(geojson, {
      pane: "roads",
      style: (feature) => {
        const type = feature?.properties?.Type;
        let color = "#ffa500"; // Default orange
        let weight = 2;

        // Simple styling based on highway type
        if (type === 'motorway' || type === 'trunk') {
          color = "#e65100"; // Darker orange/red
          weight = 4;
        } else if (type === 'primary') {
          color = "#fb8c00";
          weight = 3;
        }

        return {
          color: color,
          weight: weight,
          opacity: 0.8
        };
      },
      onEachFeature: (feature, layer) => {
        const pathLayer = layer as L.Path;
        pathLayer.bindPopup(`
          <strong>${feature.properties.Name || "Road"}</strong><br/>
          Type: ${feature.properties.Type || "Unknown"}<br/>
          Surface: ${feature.properties.Surface || "Unknown"}
        `);

        pathLayer.on({
          mouseover: (e) => {
            pathLayer.setStyle({ weight: 5, opacity: 1 });
            if (onFeatureHover) onFeatureHover(feature, e.latlng);
          },
          mouseout: () => {
            // Reset style - simplified
            pathLayer.setStyle({ weight: (feature.properties.Type === 'motorway' ? 4 : 2), opacity: 0.8 });
          },
          click: (e) => {
            if (onFeatureClick) onFeatureClick(feature, e.latlng);
          }
        });
      }
    }).addTo(roadLayerRef.current!);
  };

  const drawHospitals = (geojson: FeatureCollection) => {
    if (!mapRef.current || !hospitalLayerRef.current) return;

    const zoom = mapRef.current.getZoom();
    hospitalLayerRef.current.clearLayers();

    // Village concept: hide if zoomed out (adjust threshold as needed, 9 is a bit wider than villages)
    if (zoom < 9) return;

    geojson.features.forEach((feature: any) => {
      if (!feature.geometry || feature.geometry.type !== "Point") return;

      const [lng, lat] = feature.geometry.coordinates;

      // Dynamic radius based on zoom
      const initialRadius = zoom >= 12 ? 4 : 2;
      const initialColor = "#00c853";
      const initialFillOpacity = 0.9;

      const marker = L.circleMarker([lat, lng], {
        pane: "population",
        radius: initialRadius,
        fillColor: initialColor,
        fillOpacity: initialFillOpacity,
        stroke: false,
      });

      marker.bindPopup(`
      <strong>${feature.properties.Hospital_Name || "Hospital"}</strong><br/>
      ${feature.properties.Hospital_Category || ""}<br/>
      ${feature.properties.Hospital_Care_Type || ""}
    `);

      marker.on("mouseover", (e) => {
        marker.setStyle({
          radius: initialRadius * 1.5,
          fillColor: "#69f0ae", // Brighter green
          fillOpacity: 1,
          stroke: true,
          color: "white",
          weight: 2
        });
        if (onFeatureHover) onFeatureHover(feature, e.latlng);
      });

      marker.on("click", (e) => {
        if (onFeatureClick) onFeatureClick(feature, e.latlng);
      });

      marker.on("mouseout", () => {
        marker.setStyle({
          radius: initialRadius,
          fillColor: initialColor,
          fillOpacity: initialFillOpacity,
          stroke: false
        });
      });

      marker.addTo(hospitalLayerRef.current!);
    });
  };



  const drawPoints = (geojson: FeatureCollection) => {
    if (!mapRef.current || !pointLayerRef.current) return;

    const zoom = mapRef.current.getZoom();
    pointLayerRef.current.clearLayers();

    // performance: don't draw when zoomed out
    if (zoom < 10) return;

    geojson.features.forEach((feature: any) => {
      if (!feature.geometry || feature.geometry.type !== "Point") return;

      const [lng, lat] = feature.geometry.coordinates;

      const initialRadius = zoom >= 12 ? 3 : 1.5;
      const initialColor = "#820b0bff";
      const initialFillOpacity = 0.9;

      const marker = L.circleMarker([lat, lng], {
        radius: initialRadius,
        fillColor: initialColor,
        fillOpacity: initialFillOpacity,
        stroke: false,
      });

      marker.on("mouseover", (e) => {
        // Visual feedback
        marker.setStyle({
          radius: initialRadius * 2, // Make it bigger
          fillColor: "#ff0000",      // Brighter red
          fillOpacity: 1,
          stroke: true,              // Add border
          color: "white",
          weight: 2
        });

        if (onFeatureHover) {
          onFeatureHover(feature, e.latlng);
        }
      });

      marker.on("mouseout", () => {
        // Reset style
        marker.setStyle({
          radius: initialRadius,
          fillColor: initialColor,
          fillOpacity: initialFillOpacity,
          stroke: false
        });
      });

      marker.addTo(pointLayerRef.current!);
    });
  };

  const drawPopulation = (geojson: FeatureCollection) => {
    if (!mapRef.current || !populationLayerRef.current) return;
    populationLayerRef.current.clearLayers();

    // DEBUG: Check properties of the first feature
    if (geojson.features.length > 0) {
      console.log("Population Data Feature[0] Properties:", geojson.features[0].properties);
    }

    L.geoJSON(geojson, {
      pane: "population", // 🔥 THIS IS THE KEY
      style: (feature) => {
        // Robust checking for density property
        const density = Number(feature?.properties?.density ?? 0);
        return {
          fillColor: getDensityColor(density),
          weight: 1,
          opacity: 1,
          color: 'white', // White borders look cleaner against filled colors
          fillOpacity: 0.9,
          fill: true
        };
      },
      onEachFeature: (feature, layer) => {
        // Optional: Add hover/click for population polygons too if needed
        const pathLayer = layer as L.Path;
        pathLayer.on({
          mouseover: (e) => {
            pathLayer.setStyle({
              weight: 5,
              color: '#666',
              dashArray: '',
              fillOpacity: 0.7
            });
            if (onFeatureHover) onFeatureHover(feature, e.latlng);
          },
          mouseout: (e) => {
            pathLayer.setStyle({
              weight: 2,
              color: 'white',
              dashArray: '3',
              fillOpacity: 0.7
            });
          },
          click: (e) => {
            if (onFeatureClick) onFeatureClick(feature, e.latlng);
          }
        });
      }
    }).addTo(populationLayerRef.current!);
  };


  // ---------------- MAP INIT ----------------
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      minZoom: 4,        // 👈 prevent zooming too far out
      maxZoom: 18,
      maxBounds: indiaBounds,
      maxBoundsViscosity: 1.0,
      // zoomControl: false,
    }).setView([20, 78], 5);

    mapRef.current = map;

    // FIX LEAFLET Z-INDEX
    map.createPane("tiles");
    map.getPane("tiles")!.style.zIndex = "200";

    // Create pane for states (between tiles and points)
    map.createPane("states");
    map.getPane("states")!.style.zIndex = "300";

    map.createPane("population");
    map.getPane("population")!.style.zIndex = "450"; // ABOVE everything (default overlay is 400)

    map.createPane("airlines");
    map.getPane("airlines")!.style.zIndex = "500"; // Above population

    map.createPane("rivers");
    map.getPane("rivers")!.style.zIndex = "350"; // Between states and population

    map.createPane("railways");
    map.getPane("railways")!.style.zIndex = "360"; // Above rivers

    map.createPane("roads");
    map.getPane("roads")!.style.zIndex = "355"; // Between rivers and railways

    map.createPane("temperature");
    map.getPane("temperature")!.style.zIndex = "600"; // Topmost

    lightTileRef.current = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      { pane: "tiles", opacity: opacity / 100 }
    );

    darkTileRef.current = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      { pane: "tiles", opacity: opacity / 100 }
    );

    lightTileRef.current.addTo(map);

    // Fetch and render states
    fetch("http://localhost:5000/states")
      .then(res => res.json())
      .then((data: FeatureCollection) => {
        const layer = L.geoJSON(data, {
          pane: "states",
          style: (feature) => {
            const name = feature?.properties?.state || "";
            return {
              color: getStateColor(name),
              weight: 1,
              fillColor: getStateColor(name),
              fillOpacity: 0.3,
            };
          },
          onEachFeature: (feature, layer) => {
            const pathLayer = layer as L.Path;
            pathLayer.on({
              click: (e) => {
                if (onFeatureClick) onFeatureClick(feature, e.latlng);
                // Highlight effect
                pathLayer.setStyle({ weight: 3, fillOpacity: 0.6 });
              },
              mouseover: () => {
                if (filtersRef.current?.category?.includes("Population")) return;
                pathLayer.setStyle({ fillOpacity: 0.5 });
              },
              mouseout: () => {
                // We need to revert to the correct style based on mode
                // A simple revert might be tricky if we don't know the mode here.
                // But updateStateLayerStyle handles "global" mode.
                // On mouseout, let's just re-run the global style updater for this layer or all?
                // Easiest is to trigger a style reset for this layer
                const isPopulation = filtersRef.current?.category?.includes("Population");
                const name = feature?.properties?.state || "";

                if (isPopulation) {
                  pathLayer.setStyle({
                    fillOpacity: 0,
                    opacity: 0,
                    weight: 0
                  });
                } else {
                  pathLayer.setStyle({
                    weight: 1,
                    fillOpacity: 0.3,
                    color: getStateColor(name),
                    fillColor: getStateColor(name)
                  });
                }
              }
            });
          }
        }).addTo(map);

        stateLayerRef.current = layer as L.GeoJSON;
        updateStateLayerStyle(); // Apply initial checks
      })
      .catch(err => console.error("Failed to fetch states:", err));


    L.control.zoom({ position: "topright" }).addTo(map);

    pointLayerRef.current = L.layerGroup().addTo(map);
    populationLayerRef.current = L.layerGroup().addTo(map);
    hospitalLayerRef.current = L.layerGroup().addTo(map);
    riverLayerRef.current = L.layerGroup().addTo(map);
    airlineLayerRef.current = L.layerGroup().addTo(map);
    railwayLayerRef.current = L.layerGroup().addTo(map);
    roadLayerRef.current = L.layerGroup().addTo(map);
    tempLayerRef.current = L.layerGroup().addTo(map);

    map.on("zoomend", () => fetchGeoJson(filtersRef.current || {}, "true"));

    // Add mousemove listener
    map.on("mousemove", (e) => {
      if (onMouseMove) {
        onMouseMove({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
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


  useEffect(() => {
    const lightContainer = lightTileRef.current?.getContainer();
    const darkContainer = darkTileRef.current?.getContainer();

    if (lightContainer) lightContainer.style.filter = `brightness(${brightness}%)`;
    if (darkContainer) darkContainer.style.filter = `brightness(${brightness}%)`;
  }, [brightness, theme]);




  // ---------------- THEME ----------------
  useEffect(() => {
    if (!mapRef.current) return;

    if (theme === "dark") {
      lightTileRef.current &&
        mapRef.current.removeLayer(lightTileRef.current);
      darkTileRef.current?.addTo(mapRef.current);
    } else {
      darkTileRef.current &&
        mapRef.current.removeLayer(darkTileRef.current);
      lightTileRef.current?.addTo(mapRef.current);
    }
  }, [theme]);

  const updateStateLayerStyle = () => {
    if (!stateLayerRef.current) return;

    // Check if Population is active
    const isActive = filtersRef.current?.category?.includes("Population");

    stateLayerRef.current.eachLayer((layer: any) => {
      const name = layer.feature?.properties?.state || "";
      if (isActive) {
        // Hide fill, maybe keep faint border
        layer.setStyle({
          fillOpacity: 0,
          opacity: 0,
          weight: 0
        });
      } else {
        // Restore original colorful state style
        layer.setStyle({
          color: getStateColor(name),
          weight: 1,
          fillColor: getStateColor(name),
          fillOpacity: 0.3,
        });
      }
    });
  };

  // ---------------- FILTER CHANGE ----------------
  useEffect(() => {
    if (filters) {
      fetchGeoJson(filters);
      updateStateLayerStyle(); // Update styles when filters change
    }
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
      <div
        ref={mapContainerRef}
        className="absolute inset-0 z-0"
      />
    </div>
  );
};

export default Leaflet;


















