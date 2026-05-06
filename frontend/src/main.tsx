// StrictMode es una herramienta de desarrollo de React.
// Activa comprobaciones y advertencias adicionales en el navegador durante el desarrollo,
// como detectar efectos secundarios inesperados o el uso de APIs obsoletas.
// No afecta al build de produccion: solo existe en modo dev.
import { StrictMode } from 'react'

// createRoot es la forma moderna (React 18+) de montar la aplicacion en el DOM.
// Reemplaza a ReactDOM.render() y habilita las funciones de renderizado concurrente.
import { createRoot } from 'react-dom/client'

// Estilos base de Leaflet que definen el aspecto del mapa y sus controles.
// Deben importarse globalmente antes de que cualquier componente de mapa se renderice.
import 'leaflet/dist/leaflet.css';

import './index.css'
import App from './App.tsx'

// document.getElementById('root') obtiene el nodo del DOM donde se monta React.
// Ese nodo esta definido en index.html como <div id="root"></div>.
// El operador ! (non-null assertion) le indica a TypeScript que el elemento siempre existe.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
