import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
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
  const personasConCoordenadas =
    personas?.filter(
      (p) =>
        p.latitud !== null &&
        p.longitud !== null &&
        !isNaN(Number(p.latitud)) &&
        !isNaN(Number(p.longitud))
    ) || [];

  const centro: [number, number] =
    personasConCoordenadas.length > 0
      ? [
        Number(personasConCoordenadas[0].latitud),
        Number(personasConCoordenadas[0].longitud)
      ]
      : [6.6996, -73.0181];

  return (
    <MapContainer center={centro} zoom={13} className="leaflet-container">
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {personasConCoordenadas.map((persona) => (
        <Marker
          key={persona.id_persona}
          position={[Number(persona.latitud), Number(persona.longitud)]}
          eventHandlers={{
            click: () => onSelectPersona(persona),
          }}
        />
      ))}

      {personasConCoordenadas.length === 0 && (
        <div className="no-data-message">
          No hay personas con coordenadas para mostrar en el mapa.
        </div>
      )}
    </MapContainer>
  );
}