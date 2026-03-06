import { useEffect, useState } from "react"; 
import { Link } from "react-router-dom"; 
import Mapa from "../components/mapa"; 
import { obtenerPersonas } from "../services/personService"; 
import type { Persona } from "../types/person"; 

export default function Home() { 
    const [personas, setPersonas] = useState<Persona[]>([]); 
    const [personaSeleccionada, setPersonaSeleccionada] = 
    useState<Persona | null>(null); 
    
    useEffect(() => { 
        const cargarPersonas = async () => { 
            try { 
                const data = await obtenerPersonas(); 
                setPersonas(data); 
            } 
            catch (error) { 
                console.error("Error cargando personas:", error); 
            } 
        }; 
        
        cargarPersonas(); }, []); 
        
        return ( 
        <div className="app"> 
        <header className="nav"> 
        <Link to="/login"> <button className="login-btn">🔒 Iniciar sesión</button> </Link> 
        </header> 
        <div className="app-container"> 
        <div className="mapa-container"> 
        <Mapa personas={personas} onSelectPersona={setPersonaSeleccionada} /> 
        </div> 
        <div className="panel-container"> 
        <h2>Personas Registradas: {personas.length}</h2> 
        {personaSeleccionada ? ( <div> 
        <h3>{personaSeleccionada.nombre}</h3> 
        <p>Edad: {personaSeleccionada.edad}</p> 
        <p>Género: {personaSeleccionada.genero}</p> 
        <p>Discapacidad: {personaSeleccionada.tipoDiscapacidad}</p> 
        <p>Sector: {personaSeleccionada.sector}</p> 
        </div> ) : ( <p>Selecciona un punto en el mapa</p> )} 
        </div> 
        </div> 
        </div> 
        ); 
    }