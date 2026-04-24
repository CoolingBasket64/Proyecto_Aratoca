import { MapContainer, TileLayer, GeoJSON, Marker } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

// Define las propiedades que este componente espera recibir desde su componente padre
interface MapaProps {
  personas: any[];
  onSelectPersona: (persona: any) => void;
  onSelectSector: (codigo: string) => void;        // Se llama cuando el usuario hace clic en un sector
  onSelectNombreSector: (nombre: string) => void;  // Pasa el nombre del sector seleccionado
  onSelectVereda: (vereda: string) => void;         // Pasa el nombre de la vereda del sector seleccionado
}

export default function Mapa({
  personas,
  onSelectSector,
  onSelectNombreSector,
  onSelectVereda,
}: MapaProps) {

  // GeoJSON del limite del municipio de Aratoca (borde exterior)
  const [aratoca, setAratoca] = useState<any>(null);
  // GeoJSON de los sectores internos del municipio
  const [sectores, setSectores] = useState<any>(null);
  // Limites geograficos del mapa para que no se pueda hacer scroll infinito
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);
  // Codigo del sector actualmente seleccionado (para resaltarlo visualmente)
  const [sectorSeleccionado, setSectorSeleccionado] = useState<string | null>(null);

  // Mapa de colores por vereda: cada vereda tiene un color distinto en el mapa
  const coloresVereda: Record<string, string> = {
    CANTABARA: "#e74c3c",
    "SAN ANTONIO": "#3498db",
    "SAN PEDRO": "#2ecc71",
    CLAVELLINAS: "#f1c40f",
    URBANO: "#a411df",
  };

  // Funcion que define el estilo visual de cada sector segun su vereda y si esta seleccionado
  const estiloSectores = (feature: any) => {
    const vereda = feature.properties.Vereda;
    const codigo = feature.properties.Codigo;

    const seleccionado = codigo === sectorSeleccionado;

    return {
      color: seleccionado ? "red" : "black",        // Color del borde
      weight: seleccionado ? 2 : 0.5,               // Grosor del borde
      fillColor: coloresVereda[vereda] || "#298d94", // Color de relleno segun vereda
      fillOpacity: seleccionado ? 0.9 : 0.7,        // Opacidad del relleno
    };
  };

  // Crea un icono circular personalizado con el numero de personas en ese sector
  const crearIconoContador = (cantidad: number) => {
    // L.divIcon permite crear iconos de marcador usando HTML/CSS en lugar de imagenes
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

  // Carga los archivos GeoJSON al montar el componente.
  // Estos archivos definen las formas geograficas del municipio y sus sectores.
  // Se hace con fetch porque son archivos estaticos en la carpeta public del frontend.
  useEffect(() => {
    // Carga el limite exterior del municipio
    fetch("/aratoca.geojson")
      .then((res) => res.json())
      .then((data) => {
        setAratoca(data);
        // Calcula los limites geograficos del municipio para restringir el mapa a esa area
        const layer = L.geoJSON(data);
        setBounds(layer.getBounds());
      });

    // Carga los sectores internos del municipio
    fetch("/sectores.geojson")
      .then((res) => res.json())
      .then((data) => {
        setSectores(data);
      });
  }, []);

  // No renderiza el mapa hasta que los bounds esten calculados
  // porque MapContainer necesita los bounds para centrarse correctamente
  if (!bounds) return null;

  return (
    // MapContainer es el contenedor principal del mapa de Leaflet
    // bounds define el area inicial visible y maxBounds impide salirse de esa area
    <MapContainer
      bounds={bounds}
      maxBounds={bounds}
      maxBoundsViscosity={1.0}  // 1.0 = el usuario no puede salir de los limites
      className="leaflet-container"
    >
      {/* TileLayer es la capa base del mapa (las "losetas" de fondo de OpenStreetMap) */}
      <TileLayer
        attribution="(c) OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Capa con el limite exterior del municipio (solo el borde, sin relleno) */}
      {aratoca && (
        <GeoJSON
          data={aratoca}
          style={{ weight: 2, fillOpacity: 0 }}
        />
      )}

      {/* Capa con los sectores internos, cada uno con su color y eventos de clic */}
      {sectores && (
        <GeoJSON
          data={sectores}
          style={estiloSectores}
          // onEachFeature se ejecuta por cada sector del GeoJSON para agregar
          // popups y eventos de clic a cada uno
          onEachFeature={(feature, layer) => {
           

            // Evento de clic en el sector: actualiza el sector seleccionado
            // y notifica al componente padre con el codigo y nombre del sector
            layer.on({
              click: () => {
                const codigo = feature.properties.Codigo;
                const nombre = feature.properties.Sector;
                const vereda = feature.properties.Vereda;

                setSectorSeleccionado(codigo);
                onSelectSector(codigo);
                onSelectNombreSector(nombre);
                onSelectVereda(vereda);
              },
            });
          }}
        />
      )}

      {/* Marcadores con contadores: uno por sector, posicionado en el centro del sector */}
      {sectores &&
        sectores.features.map((feature: any, index: number) => {
          const codigo = feature.properties.Codigo;

          // Cuenta cuantas personas activas (filtradas) hay en este sector
          const cantidad = personas.filter(
            (p) => p.cod_sector === codigo
          ).length;

          // Calcula el centro geografico del sector para posicionar el marcador
          const centro = L.geoJSON(feature).getBounds().getCenter();

          return (
            // Marker coloca un marcador en el mapa en las coordenadas indicadas
            <Marker
              key={index}
              position={[centro.lat, centro.lng]}
              icon={crearIconoContador(cantidad)}
              // Al hacer clic en el contador tambien selecciona el sector
              eventHandlers={{
                click: () => {
                  const codigo = feature.properties.Codigo;
                  const nombre = feature.properties.Sector;
                  const vereda = feature.properties.Vereda;

                  setSectorSeleccionado(codigo);
                  onSelectSector(codigo);
                  onSelectNombreSector(nombre);
                  onSelectVereda(vereda);
                }
              }}
            />
          );
        })}
    </MapContainer>
  );
}
