import Sidebar from "../../components/sidebar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { crearPersona, buscarCuidadorPorDocumento } from "../../services/personService";
import { useParams } from "react-router-dom";
import { obtenerPersonaPorId, editarPersona } from "../../services/personService";
import { useEffect } from "react";
import "../../styles/dashboard.css";
import { useLocation } from "react-router-dom";

export default function CrearDiscapacitado() {
  const location = useLocation();
  const from = location.state?.from;
  const navigate = useNavigate();
  const { id } = useParams();
  const esEdicion = !!id;

  const [form, setForm] = useState({
    cod_tipo_doc: "", documento: "", primer_nombre: "", segundo_nombre: "",
    primer_apellido: "", segundo_apellido: "", rlcpd: "", fecha_nacimiento: "",
    sexo: "", discapacidad: "", celular: "", zona: "", vereda: "", sector: "",
    direccion: "", tiene_cuidador: false, cuidador_cod_tipo_doc: "",
    cuidador_documento: "", cuidador_primer_nombre: "", cuidador_segundo_nombre: "",
    cuidador_primer_apellido: "", cuidador_segundo_apellido: "",
    cuidador_fecha_nacimiento: "", cuidador_sexo: "", cuidador_parentesco: "",
    cuidador_celular: ""
  });

  const [errores, setErrores] = useState<Record<string, string>>({});
  const [mensaje, setMensaje] = useState("");
  const [mensajeTipo] = useState<"success" | "error">("success");
  const [mensajeCuidador, setMensajeCuidador] = useState("");

  useEffect(() => { if (esEdicion) cargarPersona(); }, [id]);

  const formatDate = (date?: string) => date ? date.split("T")[0] : "";

  const cargarPersona = async () => {
    try {
      const data = await obtenerPersonaPorId(Number(id));
      setForm((prev) => ({
        ...prev, ...data,
        cod_tipo_doc: String(data.cod_tipo_doc || ""),
        rlcpd: data.rlcpd || "", sexo: data.sexo || "",
        discapacidad: data.discapacidad || "", zona: data.zona || "",
        fecha_nacimiento: formatDate(data.fecha_nacimiento),
        tiene_cuidador: data.tiene_cuidador == 1,
        cuidador_cod_tipo_doc: String(data.cuidador?.cod_tipo_doc || ""),
        cuidador_documento: data.cuidador?.documento || "",
        cuidador_primer_nombre: data.cuidador?.primer_nombre || "",
        cuidador_segundo_nombre: data.cuidador?.segundo_nombre || "",
        cuidador_primer_apellido: data.cuidador?.primer_apellido || "",
        cuidador_segundo_apellido: data.cuidador?.segundo_apellido || "",
        cuidador_fecha_nacimiento: formatDate(data.cuidador?.fecha_nacimiento),
        cuidador_sexo: data.cuidador?.sexo || "",
        cuidador_parentesco: data.cuidador?.parentesco || "",
        cuidador_celular: data.cuidador?.celular || ""
      }));
    } catch (error) { console.error("Error cargando persona", error); }
  };

  const handleChange = (e: any) => {
    const { name, type, checked, value } = e.target;
    const val = type === "checkbox" ? checked : type === "date" ? value : value.toUpperCase();
    // Limpia el error del campo cuando el usuario empieza a escribir
    if (errores[name]) setErrores((prev) => { const e = { ...prev }; delete e[name]; return e; });
    setForm((prev) => {
      if (name === "zona") return { ...prev, zona: val, ...(val !== "RURAL" && { vereda: "", sector: "" }) };
      return { ...prev, [name]: val };
    });
  };

  const validar = () => {
    const e: Record<string, string> = {};
    if (!form.cod_tipo_doc) e.cod_tipo_doc = "Seleccione el tipo de documento";
    if (!form.documento.trim()) e.documento = "El documento es obligatorio";
    if (!form.primer_nombre.trim()) e.primer_nombre = "El primer nombre es obligatorio";
    if (!form.primer_apellido.trim()) e.primer_apellido = "El primer apellido es obligatorio";
    if (!form.fecha_nacimiento) e.fecha_nacimiento = "La fecha de nacimiento es obligatoria";
    if (!form.sexo) e.sexo = "El sexo es obligatorio";
    if (!form.discapacidad) e.discapacidad = "El tipo de discapacidad es obligatorio";
    if (!form.zona) e.zona = "La zona es obligatoria";
    if (form.tiene_cuidador && form.cuidador_documento) {
      if (!form.cuidador_cod_tipo_doc) e.cuidador_cod_tipo_doc = "Seleccione el tipo de documento";
      if (!form.cuidador_primer_nombre.trim()) e.cuidador_primer_nombre = "El primer nombre es obligatorio";
      if (!form.cuidador_primer_apellido.trim()) e.cuidador_primer_apellido = "El primer apellido es obligatorio";
    }
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const buscarCuidador = async (documento: string) => {
    if (!documento || documento.length < 4) return;
    try {
      const encontrado = await buscarCuidadorPorDocumento(documento);
      if (encontrado) {
        setForm((prev) => ({
          ...prev,
          cuidador_cod_tipo_doc: String(encontrado.cod_tipo_doc || ""),
          cuidador_documento: encontrado.documento || "",
          cuidador_primer_nombre: encontrado.primer_nombre || "",
          cuidador_segundo_nombre: encontrado.segundo_nombre || "",
          cuidador_primer_apellido: encontrado.primer_apellido || "",
          cuidador_segundo_apellido: encontrado.segundo_apellido || "",
          cuidador_fecha_nacimiento: encontrado.fecha_nacimiento ? encontrado.fecha_nacimiento.split("T")[0] : "",
          cuidador_sexo: encontrado.sexo || "",
          cuidador_parentesco: encontrado.parentesco || "",
          cuidador_celular: encontrado.celular || "",
        }));
        setMensajeCuidador("Cuidador encontrado y datos cargados");
      } else { setMensajeCuidador(""); }
    } catch { setMensajeCuidador(""); }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validar()) return;
    try {
      const dataToSend = {
        ...form,
        tiene_cuidador: form.tiene_cuidador ? 1 : 0,
        cuidador: form.tiene_cuidador ? {
          cod_tipo_doc: form.cuidador_cod_tipo_doc,
          documento: form.cuidador_documento,
          primer_nombre: form.cuidador_primer_nombre,
          segundo_nombre: form.cuidador_segundo_nombre,
          primer_apellido: form.cuidador_primer_apellido,
          segundo_apellido: form.cuidador_segundo_apellido,
          fecha_nacimiento: form.cuidador_fecha_nacimiento,
          sexo: form.cuidador_sexo,
          parentesco: form.cuidador_parentesco,
          celular: form.cuidador_celular
        } : null
      };
      if (esEdicion) {
        await editarPersona(Number(id), dataToSend);
        setMensaje("Persona actualizada correctamente");
      } else {
        await crearPersona(dataToSend);
        setMensaje("Persona creada correctamente");
      }
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      console.error(error);
      setMensaje("Ocurrió un error");
    }
  };

  // Estilo reutilizable para mensajes de error
  const estiloError = { color: "red", fontSize: "12px", marginTop: "4px" };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <div className="dashboard-container dashboard-container-form">

          <button type="button" className="btn-volver-dashboard"
            onClick={() => navigate(from === "gestionar" ? "/gestionar-discapacitado" : "/dashboard")}>
            Volver
          </button>

          <h2>{esEdicion ? "Editar Persona con Discapacidad" : "Crear Persona con Discapacidad"}</h2>

          <form className="form-grid" onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Tipo de Documento</label>
              <select name="cod_tipo_doc" onChange={handleChange} value={form.cod_tipo_doc}>
                <option value="">Seleccione tipo de documento</option>
                <option value="1">Cedula de Ciudadania</option>
                <option value="2">Cedula de Extranjeria</option>
                <option value="3">Tarjeta de Identidad</option>
                <option value="4">Registro Civil</option>
                <option value="5">Pasaporte</option>
                <option value="6">Permiso por Proteccion Temporal</option>
              </select>
              {errores.cod_tipo_doc && <span style={estiloError}>{errores.cod_tipo_doc}</span>}
            </div>

            <div>
              <label>Nro Documento</label>
              <input name="documento" placeholder="Documento" value={form.documento} onChange={handleChange} />
              {errores.documento && <span style={estiloError}>{errores.documento}</span>}
            </div>

            <div>
              <label>Primer Nombre</label>
              <input name="primer_nombre" placeholder="Primer Nombre" value={form.primer_nombre} onChange={handleChange} />
              {errores.primer_nombre && <span style={estiloError}>{errores.primer_nombre}</span>}
            </div>

            <div>
              <label>Segundo Nombre</label>
              <input name="segundo_nombre" placeholder="Segundo Nombre" value={form.segundo_nombre} onChange={handleChange} />
            </div>

            <div>
              <label>Primer Apellido</label>
              <input name="primer_apellido" placeholder="Primer Apellido" value={form.primer_apellido} onChange={handleChange} />
              {errores.primer_apellido && <span style={estiloError}>{errores.primer_apellido}</span>}
            </div>

            <div>
              <label>Segundo Apellido</label>
              <input name="segundo_apellido" placeholder="Segundo Apellido" value={form.segundo_apellido} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>RLCPD</label>
              <select name="rlcpd" value={form.rlcpd || ""} onChange={handleChange}>
                <option value="">Seleccione una opcion</option>
                <option value="SÍ">Si</option>
                <option value="NO">No</option>
              </select>
            </div>

            <h3 className="form-title">Datos Personales</h3>

            <div className="form-group">
              <label>Fecha de Nacimiento</label>
              <input type="date" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange} />
              {errores.fecha_nacimiento && <span style={estiloError}>{errores.fecha_nacimiento}</span>}
            </div>

            <div>
              <label>Sexo</label>
              <select name="sexo" value={form.sexo} onChange={handleChange}>
                <option value="">Sexo</option>
                <option value="I">Indefinido</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
              {errores.sexo && <span style={estiloError}>{errores.sexo}</span>}
            </div>

            <div className="form-group">
              <label>Tipo de Discapacidad</label>
              <select name="discapacidad" onChange={handleChange} value={form.discapacidad}>
                <option value="">Seleccione discapacidad</option>
                <option value="FÍSICA">Fisica</option>
                <option value="VISUAL">Visual</option>
                <option value="AUDITIVA">Auditiva</option>
                <option value="INTELECTUAL">Intelectual</option>
                <option value="PSICOSOCIAL">Psicosocial</option>
                <option value="MÚLTIPLE">Multiple</option>
              </select>
              {errores.discapacidad && <span style={estiloError}>{errores.discapacidad}</span>}
            </div>

            <div>
              <label>Celular</label>
              <input name="celular" placeholder="Celular" value={form.celular} onChange={handleChange} />
            </div>

            <h3 className="form-title">Ubicacion</h3>

            <div className="form-group">
              <label>Zona</label>
              <select name="zona" value={form.zona || ""} onChange={handleChange}>
                <option value="">Seleccione zona</option>
                <option value="URBANO">Urbana</option>
                <option value="RURAL">Rural</option>
              </select>
              {errores.zona && <span style={estiloError}>{errores.zona}</span>}
            </div>

            {form.zona === "RURAL" && (
              <>
                <div>
                  <label>Vereda</label>
                  <input name="vereda" placeholder="Vereda" value={form.vereda} onChange={handleChange} />
                </div>
                <div>
                  <label>Sector</label>
                  <input name="sector" placeholder="Sector" value={form.sector} onChange={handleChange} />
                </div>
              </>
            )}

            <div>
              <label>Direccion</label>
              <input name="direccion" placeholder="Direccion" className="full-width" value={form.direccion} onChange={handleChange} />
            </div>

            <div className="full-width">
              <label>
                <input type="checkbox" name="tiene_cuidador" checked={form.tiene_cuidador} onChange={handleChange} />
                Tiene cuidador
              </label>
            </div>

            {form.tiene_cuidador && (
              <div className="cuidador-section">
                <h3>Datos del Cuidador</h3>

                {!form.cuidador_documento && (
                  <p style={{
                    color: "#856404", backgroundColor: "#fff3cd",
                    border: "1px solid #ffc107", borderRadius: "6px",
                    padding: "10px 14px", fontSize: "14px", marginBottom: "12px"
                  }}>
                    ⚠️ Esta persona tiene cuidador registrado, pero no se han identificado sus datos.
                    Puedes completar la información a continuación.
                  </p>
                )}

                <div>
                  <label>Tipo Documento</label>
                  <select name="cuidador_cod_tipo_doc" value={form.cuidador_cod_tipo_doc || ""} onChange={handleChange}>
                    <option value="">Seleccione tipo de documento</option>
                    <option value="1">Cedula de Ciudadania</option>
                    <option value="2">Cedula de Extranjeria</option>
                    <option value="3">Tarjeta de Identidad</option>
                    <option value="4">Registro Civil</option>
                    <option value="5">Pasaporte</option>
                    <option value="6">Permiso por Proteccion Temporal</option>
                  </select>
                  {errores.cuidador_cod_tipo_doc && <span style={estiloError}>{errores.cuidador_cod_tipo_doc}</span>}
                </div>

                <div>
                  <label>Nro Documento</label>
                  <input
                    name="cuidador_documento"
                    placeholder="Documento"
                    value={form.cuidador_documento}
                    onChange={(e) => { handleChange(e); setMensajeCuidador(""); }}
                    onBlur={(e) => buscarCuidador(e.target.value)}
                  />
                  {mensajeCuidador && <p style={{ color: "green", fontSize: "12px", marginTop: "4px" }}>{mensajeCuidador}</p>}
                </div>

                <div>
                  <label>Primer Nombre</label>
                  <input name="cuidador_primer_nombre" placeholder="Primer Nombre" value={form.cuidador_primer_nombre} onChange={handleChange} />
                  {errores.cuidador_primer_nombre && <span style={estiloError}>{errores.cuidador_primer_nombre}</span>}
                </div>

                <div>
                  <label>Segundo Nombre</label>
                  <input name="cuidador_segundo_nombre" placeholder="Segundo Nombre" value={form.cuidador_segundo_nombre} onChange={handleChange} />
                </div>

                <div>
                  <label>Primer Apellido</label>
                  <input name="cuidador_primer_apellido" placeholder="Primer Apellido" value={form.cuidador_primer_apellido} onChange={handleChange} />
                  {errores.cuidador_primer_apellido && <span style={estiloError}>{errores.cuidador_primer_apellido}</span>}
                </div>

                <div>
                  <label>Segundo Apellido</label>
                  <input name="cuidador_segundo_apellido" placeholder="Segundo Apellido" value={form.cuidador_segundo_apellido} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Fecha de Nacimiento</label>
                  <input type="date" name="cuidador_fecha_nacimiento" value={form.cuidador_fecha_nacimiento} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Sexo</label>
                  <select name="cuidador_sexo" value={form.cuidador_sexo || ""} onChange={handleChange}>
                    <option value="">Seleccione</option>
                    <option value="I">Indefinido</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                </div>

                <div>
                  <label>Parentesco</label>
                  <input name="cuidador_parentesco" placeholder="Parentesco" value={form.cuidador_parentesco} onChange={handleChange} />
                </div>

                <div>
                  <label>Celular</label>
                  <input name="cuidador_celular" placeholder="Celular" value={form.cuidador_celular} onChange={handleChange} />
                </div>
              </div>
            )}

            {mensaje && <p className={`mensaje ${mensajeTipo}`}>{mensaje}</p>}

            <button className="btn-guardar" type="submit">
              {esEdicion ? "Actualizar" : "Guardar"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}