import { MapContainer, TileLayer, GeoJSON, Marker } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

interface MapaProps {
  personas: any[];
  onSelectPersona: (persona: any) => void;
  onSelectSector: (codigo: string) => void;
  onSelectNombreSector: (nombre: string) => void;
}

export default function Mapa({
  personas,
  onSelectSector,
  onSelectNombreSector,
}: MapaProps) {

  const [aratoca, setAratoca] = useState<any>(null);
  const [sectores, setSectores] = useState<any>(null);
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);
  const [sectorSeleccionado, setSectorSeleccionado] = useState<string | null>(null);

  const coloresVereda: Record<string, string> = {
    CANTABARA: "#e74c3c",
    "SAN ANTONIO": "#3498db",
    "SAN PEDRO": "#2ecc71",
    CLAVELLINAS: "#f1c40f",
    RURAL: "#a411df",
  };

  const estiloSectores = (feature: any) => {
    const vereda = feature.properties.Vereda;
    const codigo = feature.properties.Codigo;

    const seleccionado = codigo === sectorSeleccionado;

    return {
      color: seleccionado ? "red" : "black",
      weight: seleccionado ? 2 : 0.5,
      fillColor: coloresVereda[vereda] || "#298d94",
      fillOpacity: seleccionado ? 0.9 : 0.7,
    };
  };

  // 🔥 ICONO DEL CONTADOR
  const crearIconoContador = (cantidad: number) => {
    return L.divIcon({
      html: `
        <div style="
          background: #2c3e50;
          color: white;
          border-radius: 50%;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: bold;
          border: 2px solid white;
        ">
          ${cantidad}
        </div>
      `,
      className: "",
      iconSize: [28, 28],
    });
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

      {/* Límite */}
      {aratoca && (
        <GeoJSON
          data={aratoca}
          style={{ weight: 2, fillOpacity: 0 }}
        />
      )}

      {/* Sectores */}
      {sectores && (
        <GeoJSON
          data={sectores}
          style={estiloSectores}
          onEachFeature={(feature, layer) => {
            layer.bindPopup(`
              <strong>Vereda:</strong> ${feature.properties.Vereda}<br/>
              <strong>Sector:</strong> ${feature.properties.Sector}
            `);

            layer.on({
              click: () => {
                const codigo = feature.properties.Codigo;
                const nombre = feature.properties.Sector;

                setSectorSeleccionado(codigo);
                onSelectSector(codigo);
                onSelectNombreSector(nombre);
              },
            });
          }}
        />
      )}

      {/* 🔥 CONTADORES */}
      {sectores &&
        sectores.features.map((feature: any, index: number) => {
          const codigo = feature.properties.Codigo;

          const cantidad = personas.filter(
            (p) => p.cod_sector === codigo
          ).length;

          const centro = L.geoJSON(feature).getBounds().getCenter();

          return (
            <Marker
              key={index}
              position={[centro.lat, centro.lng]}
              icon={crearIconoContador(cantidad)}
              
              eventHandlers={{
                
                click: () => {
                  const codigo = feature.properties.Codigo;
                  const nombre = feature.properties.Sector;

                  setSectorSeleccionado(codigo);
                  onSelectSector(codigo);
                  onSelectNombreSector(nombre);
                }
              }}
            />
          );
        })}
    </MapContainer>
  );
}