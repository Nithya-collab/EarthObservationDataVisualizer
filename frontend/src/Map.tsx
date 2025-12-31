import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function Map() {
  const [geojson, setGeojson] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/geojson")
      .then(res => res.json())
      .then(data => setGeojson(data));
  }, []);


  console.log('geojson data:', geojson)

  return (
    <MapContainer center={[20, 78]} zoom={5} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {geojson && <GeoJSON data={geojson} />}
    </MapContainer>
  );
}

export default Map;
