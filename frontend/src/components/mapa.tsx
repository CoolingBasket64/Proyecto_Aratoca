import { MapContainer, TileLayer, Marker, GeoJSON } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import type { Persona } from "../types/person";

interface MapaProps {
  personas: Persona[] | null;
  onSelectPersona: (persona: Persona) => void;
}

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL(
    "leaflet/dist/images/marker-icon-2x.png",
    import.meta.url
  ).toString(),
  iconUrl: new URL(
    "leaflet/dist/images/marker-icon.png",
    import.meta.url
  ).toString(),
  shadowUrl: new URL(
    "leaflet/dist/images/marker-shadow.png",
    import.meta.url
  ).toString(),
});

export default function Mapa({ personas, onSelectPersona }: MapaProps) {

  const [aratoca, setAratoca] = useState<any>(null);
  const [sectores, setSectores] = useState<any>(null);
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);

  const coloresVereda: Record<string, string> = {
    CANTABARA: "#e74c3c",
    "SAN ANTONIO": "#3498db",
    "SAN PEDRO": "#2ecc71",
    CLAVELLINAS: "#f1c40f",
  };

  const estiloSectores = (feature: any) => {
    const vereda = feature.properties.Vereda;

    return {
      color: "black",
      weight: 0.5,
      fillColor: coloresVereda[vereda] || "#298d94",
      fillOpacity: 0.8,
    };
  };

  useEffect(() => {
    fetch("/aratoca.geojson")
      .then((res) => res.json())
      .then((data) => {
        setAratoca(data);

        const layer = L.geoJSON(data);
        setBounds(layer.getBounds()); 
      });

    fetch("/sectores.geojson")
      .then((res) => res.json())
      .then((data) => {
        setSectores(data);
      });

  }, []);

  if (!bounds) return null;

  return (
    <MapContainer
      bounds={bounds}
      maxBounds={bounds}
      maxBoundsViscosity={1.0}
      className="leaflet-container"
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {aratoca && (
        <GeoJSON
          data={aratoca}
          style={{
            weight: 2,
            fillOpacity: 0,
          }}
        />
      )}

      {sectores && (
        <GeoJSON
          data={sectores}
          style={estiloSectores}
          onEachFeature={(feature, layer) => {
            layer.bindPopup(`
              <strong>Vereda:</strong> ${feature.properties.Vereda}<br/>
              <strong>Sector:</strong> ${feature.properties.Codigo}
            `);

            layer.on({
              mouseover: (e: any) => {
                e.target.setStyle({
                  weight: 2,
                  fillOpacity: 0.8,
                });
              },
              mouseout: (e: any) => {
                e.target.setStyle({
                  weight: 1.5,
                  fillOpacity: 0.8,
                });
              },
            });
          }}
        />
      )}

      {/* Personas */}
      {personas
        .filter(
          (persona) =>
            persona.latitud !== null &&
            persona.longitud !== null &&
            !isNaN(Number(persona.latitud)) &&
            !isNaN(Number(persona.longitud))
        )
        
        .map((persona) => (
          <Marker
            key={persona.id_persona}
            position={[Number(persona.latitud), Number(persona.longitud)]}
            eventHandlers={{
              click: () => onSelectPersona(persona),
            }}
          />
        ))}
    </MapContainer>
  );
}