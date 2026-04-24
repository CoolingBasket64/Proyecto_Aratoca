import { useEffect, useState } from "react";
// ExcelJS permite crear archivos Excel con estilos (colores, bordes, fuentes)
import ExcelJS from "exceljs";
// file-saver permite descargar archivos desde el navegador
import { saveAs } from "file-saver";
import Sidebar from "../components/sidebar";
import { obtenerPersonas } from "../services/personService";
import type { Persona } from "../types/person";
import "../styles/dashboard.css";

export default function Reportes() {
  // Lista completa de personas del backend
  const [personas, setPersonas] = useState<Persona[]>([]);
  // Filtros seleccionados por el usuario antes de descargar
  const [filtroDiscapacidad, setFiltroDiscapacidad] = useState("");
  const [filtroZona, setFiltroZona] = useState("");
  const [filtroSector, setFiltroSector] = useState("");

  // Carga las personas al entrar a la pagina
  useEffect(() => {
    obtenerPersonas()
      .then(setPersonas)
      .catch(console.error);
  }, []);

  // Extrae la lista unica de sectores para el selector de filtro
  // Set elimina duplicados, spread [...] lo convierte a array, sort() ordena alfabeticamente
  const sectores = [...new Set(personas.map((p) => p.sector).filter(Boolean))].sort();
  const zonas = [...new Set(personas.map((p) => p.zona).filter(Boolean))].sort();

  // Aplica los tres filtros a la lista de personas
  const personasFiltradas = personas.filter((p) => {
    const cumpleDiscapacidad =
      filtroDiscapacidad === "" ||
      p.discapacidad?.toLowerCase() === filtroDiscapacidad.toLowerCase();

    const cumpleZona =
      filtroZona === "" ||
      p.zona?.toLocaleLowerCase() === filtroZona.toLocaleLowerCase();

    const cumpleSector =
      filtroSector === "" || p.sector === filtroSector;

    return cumpleDiscapacidad && cumpleZona && cumpleSector;
  });

  // Genera y descarga el archivo Excel con estilos de color
  // Es async porque ExcelJS usa Promesas para generar el archivo
  const generarExcel = async () => {
    // Crea un nuevo libro de Excel (Workbook)
    const libro = new ExcelJS.Workbook();
    libro.creator = "Aratoca";
    libro.created = new Date();

    // Agrega una hoja de calculo al libro
    const hoja = libro.addWorksheet("Personas");

    // Fija la primera fila (encabezados) para que no se mueva al hacer scroll
    // ySplit: 1 significa que la fila 1 queda congelada
    hoja.views = [{ state: "frozen", ySplit: 1 }];

    // Define las columnas con su titulo, clave de datos y ancho
    // La clave (key) debe coincidir con las propiedades del objeto que se agrega en addRow
    hoja.columns = [
      { header: "Codigo",           key: "codigo",              width: 14 },
      { header: "Documento",        key: "documento",           width: 16 },
      { header: "Nombre Completo",  key: "nombre_completo",     width: 32 },
      { header: "Edad",             key: "edad",                width: 8  },
      { header: "Sexo",             key: "sexo",                width: 12 },
      { header: "Discapacidad",     key: "discapacidad",        width: 16 },
      { header: "Zona",             key: "zona",                width: 12 },
      { header: "Vereda",           key: "vereda",              width: 18 },
      { header: "Sector",           key: "sector",              width: 18 },
      { header: "RLCPD",            key: "rlcpd",               width: 10 },
      { header: "Estado",           key: "estado",              width: 12 },
      { header: "Cuidador",         key: "cuidador",            width: 12 },
      { header: "Nombre Cuidador",  key: "cuidador_nombre",     width: 32 },
      { header: "Doc. Cuidador",    key: "cuidador_documento",  width: 16 },
      { header: "Parentesco",       key: "cuidador_parentesco", width: 16 },
      { header: "Celular Cuidador", key: "cuidador_celular",    width: 18 },
      { header: "Sexo Cuidador",    key: "cuidador_sexo",       width: 14 },
      { header: "Edad Cuidador",    key: "cuidador_edad",       width: 14 },
    ];

    // Aplica estilos a la fila de encabezados (fila 1)
    hoja.getRow(1).eachCell((cell) => {
      // fill define el color de fondo de la celda
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F2937" } };
      // font define el estilo del texto
      cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      // border agrega bordes a cada lado de la celda
      cell.border = {
        top:    { style: "thin", color: { argb: "FF374151" } },
        bottom: { style: "thin", color: { argb: "FF374151" } },
        left:   { style: "thin", color: { argb: "FF374151" } },
        right:  { style: "thin", color: { argb: "FF374151" } },
      };
    });
    hoja.getRow(1).height = 28;

    // Agrega una fila por cada persona filtrada con estilos condicionales
    personasFiltradas.forEach((p, i) => {
      // Efecto zebra: filas pares blancas, impares gris muy claro
      const esPar = i % 2 === 0;
      const fondoFila = esPar ? "FFFFFFFF" : "FFF9FAFB";

      const estado   = p.activo === 1 ? "Activo" : "Inactivo";
      const cuidador = p.tiene_cuidador ? "Si" : "No";
      const rlcpd    = p.rlcpd === "SÍ" ? "Si" : "No";

      // addRow agrega una fila usando las claves definidas en hoja.columns
      const fila = hoja.addRow({
        codigo:               p.codigo,
        documento:            p.documento,
        nombre_completo:      p.nombre_completo,
        edad:                 p.edad,
        sexo:                 p.sexo === "M" ? "Masculino" : "Femenino",
        discapacidad:         p.discapacidad,
        zona:                 p.zona ?? "",
        vereda:               p.vereda ?? "",
        sector:               p.sector,
        rlcpd,
        estado,
        cuidador,
        cuidador_nombre:      p.cuidador_nombre     ?? "",
        cuidador_documento:   p.cuidador_documento  ?? "",
        cuidador_parentesco:  p.cuidador_parentesco ?? "",
        cuidador_celular:     p.cuidador_celular    ?? "",
        cuidador_sexo:        p.cuidador_sexo === "M" ? "Masculino" : p.cuidador_sexo === "F" ? "Femenino" : "",
        cuidador_edad:        p.cuidador_edad       ?? "",
      });

      // Aplica estilos a cada celda de la fila
      fila.eachCell((cell, colNum) => {
        // Obtiene la clave de la columna para identificar que campo es
        const key = hoja.getColumn(colNum).key;

        let fondo = fondoFila;
        let fontColor = "FF111827";

        // Colores condicionales segun el valor de columnas especificas
        if (key === "estado") {
          // Verde para activo, rojo para inactivo
          fondo     = p.activo === 1 ? "FFD1FAE5" : "FFFEE2E2";
          fontColor = p.activo === 1 ? "FF065F46" : "FF991B1B";
        } else if (key === "cuidador") {
          // Azul si tiene cuidador
          fondo     = p.tiene_cuidador ? "FFDBEAFE" : fondoFila;
          fontColor = p.tiene_cuidador ? "FF1E40AF" : "FF111827";
        } else if (key === "rlcpd") {
          // Azul si esta en RLCPD
          fondo     = p.rlcpd === "SÍ" ? "FFDBEAFE" : fondoFila;
          fontColor = p.rlcpd === "SÍ" ? "FF1E40AF" : "FF111827";
        }

        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: fondo } };
        cell.font = { color: { argb: fontColor }, size: 10 };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top:    { style: "thin", color: { argb: "FFE5E7EB" } },
          bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
          left:   { style: "thin", color: { argb: "FFE5E7EB" } },
          right:  { style: "thin", color: { argb: "FFE5E7EB" } },
        };
      });

      fila.height = 22;
    });

    // Genera el archivo como un buffer de bytes en memoria
    const buffer = await libro.xlsx.writeBuffer();

    // Convierte el buffer a un Blob (objeto binario del navegador)
    // y lo descarga con el nombre indicado usando file-saver
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const nombreArchivo = `reporte_discapacitados_${new Date().toISOString().slice(0, 10)}.xlsx`;
    saveAs(blob, nombreArchivo);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content">
        <div className="dashboard-container">

          <h2 className="title">Generar Reportes</h2>

          {/* Filtros para seleccionar que datos incluir en el reporte */}
          <div className="filtros-reporte">
            <select
              className="filtro"
              value={filtroDiscapacidad}
              onChange={(e) => setFiltroDiscapacidad(e.target.value)}
            >
              <option value="">Todas las discapacidades</option>
              <option value="FÍSICA">Fisica</option>
              <option value="Visual">Visual</option>
              <option value="Auditiva">Auditiva</option>
              <option value="Intelectual">Intelectual</option>
              <option value="Psicosocial">Psicosocial</option>
              <option value="MÚLTIPLE">Multiple</option>
            </select>

            {/* Los sectores se generan dinamicamente desde los datos reales */}
            <select
              className="filtro"
              value={filtroSector}
              onChange={(e) => setFiltroSector(e.target.value)}
            >
              <option value="">Todos los sectores</option>
              {sectores.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              className="filtro"
              value={filtroZona}
              onChange={(e) => setFiltroZona(e.target.value)}
            >
              <option value="">Todas las zonas</option>
              {zonas.map((z) => (
                <option key={z} value={z}>{z}</option>
              ))}
              
            </select>
          </div>

          {/* Muestra cuantas personas coinciden con los filtros actuales */}
          <p className="reporte-conteo">
            {personasFiltradas.length} persona{personasFiltradas.length !== 1 ? "s" : ""} encontrada{personasFiltradas.length !== 1 ? "s" : ""}
          </p>

          <button className="btn-reporte" onClick={generarExcel}>
            Descargar Excel
          </button>

          {/* Tabla de previsualizacion para ver los datos antes de descargar */}
          <div className="tabla-container" style={{ marginTop: "20px" }}>
            <table className="tabla">
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Nombre</th>
                  <th>Edad</th>
                  <th>Discapacidad</th>
                  <th>Zona</th>
                  <th>Vereda</th>
                  <th>Sector</th>
                  <th>Cuidador</th>
                  <th>Nombre Cuidador</th>
                  <th>RLCPD</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {personasFiltradas.map((p) => (
                  <tr key={p.id_persona}>
                    <td>{p.codigo}</td>
                    <td>{p.nombre_completo}</td>
                    <td>{p.edad}</td>
                    <td>{p.discapacidad}</td>
                    <td>{p.zona}</td>
                    <td>{p.vereda}</td>
                    <td>{p.sector}</td>
                    <td>{p.tiene_cuidador ? "Si" : "No"}</td>
                    {/* El operador ?? retorna el valor de la derecha si el de la izquierda es null o undefined */}
                    <td>{p.cuidador_nombre ?? "-"}</td>
                    <td>{p.rlcpd === "SÍ" ? "Si" : "No"}</td>
                    <td>
                      <span className={`badge ${p.activo ? "activo" : "inactivo"}`}>
                        {p.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
