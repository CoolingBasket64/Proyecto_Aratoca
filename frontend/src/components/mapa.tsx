import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Persona } from "../types/person";

interface MapaProps {
  personas: Persona[];
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

  return (
    <MapContainer
      center={[6.6996, -73.0181]}
      zoom={13}
      className="leaflet-container"
    >

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

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