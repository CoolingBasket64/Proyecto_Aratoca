import { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Sidebar from "../components/sidebar";
import { obtenerPersonas } from "../services/personService";
import type { Persona } from "../types/person";
import "../styles/dashboard.css";

export default function Reportes() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [filtroDiscapacidad, setFiltroDiscapacidad] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroSector, setFiltroSector] = useState("");

  useEffect(() => {
    obtenerPersonas()
      .then(setPersonas)
      .catch(console.error);
  }, []);

  const sectores = [...new Set(personas.map((p) => p.sector).filter(Boolean))].sort();

  const personasFiltradas = personas.filter((p) => {
    const cumpleDiscapacidad =
      filtroDiscapacidad === "" ||
      p.discapacidad?.toLowerCase() === filtroDiscapacidad.toLowerCase();

    const cumpleEstado =
      filtroEstado === "" ||
      (filtroEstado === "activo" ? p.activo === 1 : p.activo === 0);

    const cumpleSector =
      filtroSector === "" || p.sector === filtroSector;

    return cumpleDiscapacidad && cumpleEstado && cumpleSector;
  });

  const generarExcel = async () => {
    const libro = new ExcelJS.Workbook();
    libro.creator = "Aratoca";
    libro.created = new Date();

    const hoja = libro.addWorksheet("Personas");

    // Fijar la primera fila (encabezado)
    hoja.views = [{ state: "frozen", ySplit: 1 }];

    // Columnas con ancho definido
    hoja.columns = [
      { header: "Código",           key: "codigo",              width: 14 },
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

    // Estilo de encabezados
    hoja.getRow(1).eachCell((cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F2937" } };
      cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top:    { style: "thin", color: { argb: "FF374151" } },
        bottom: { style: "thin", color: { argb: "FF374151" } },
        left:   { style: "thin", color: { argb: "FF374151" } },
        right:  { style: "thin", color: { argb: "FF374151" } },
      };
    });
    hoja.getRow(1).height = 28;

    // Filas de datos
    personasFiltradas.forEach((p, i) => {
      const esPar = i % 2 === 0;
      const fondoFila = esPar ? "FFFFFFFF" : "FFF9FAFB";

      const estado  = p.activo === 1 ? "Activo" : "Inactivo";
      const cuidador = p.tiene_cuidador ? "Sí" : "No";
      const rlcpd   = p.rlcpd === "SÍ" ? "Sí" : "No";

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

      fila.eachCell((cell, colNum) => {
        const key = hoja.getColumn(colNum).key;

        // Color condicional por columna
        let fondo = fondoFila;
        let fontColor = "FF111827";

        if (key === "estado") {
          fondo     = p.activo === 1 ? "FFD1FAE5" : "FFFEE2E2";
          fontColor = p.activo === 1 ? "FF065F46" : "FF991B1B";
        } else if (key === "cuidador") {
          fondo     = p.tiene_cuidador ? "FFDBEAFE" : fondoFila;
          fontColor = p.tiene_cuidador ? "FF1E40AF" : "FF111827";
        } else if (key === "rlcpd") {
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

    const buffer = await libro.xlsx.writeBuffer();
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

          <div className="filtros-reporte">
            <select
              className="filtro"
              value={filtroDiscapacidad}
              onChange={(e) => setFiltroDiscapacidad(e.target.value)}
            >
              <option value="">Todas las discapacidades</option>
              <option value="Física">Física</option>
              <option value="Visual">Visual</option>
              <option value="Auditiva">Auditiva</option>
              <option value="Intelectual">Intelectual</option>
              <option value="Psicosocial">Psicosocial</option>
              <option value="Múltiple">Múltiple</option>
            </select>

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
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          <p className="reporte-conteo">
            {personasFiltradas.length} persona{personasFiltradas.length !== 1 ? "s" : ""} encontrada{personasFiltradas.length !== 1 ? "s" : ""}
          </p>

          <button className="btn-reporte" onClick={generarExcel}>
            Descargar Excel
          </button>

          <div className="tabla-container" style={{ marginTop: "20px" }}>
            <table className="tabla">
              <thead>
                <tr>
                  <th>Código</th>
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
                    <td>{p.tiene_cuidador ? "Sí" : "No"}</td>
                    <td>{p.cuidador_nombre ?? "—"}</td>
                    <td>{p.rlcpd === "SÍ" ? "Sí" : "No"}</td>
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
