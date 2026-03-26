import Sidebar from "../components/sidebar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { crearPersona } from "../services/personService";
import { useParams } from "react-router-dom";
import { obtenerPersonaPorId, editarPersona } from "../services/personService";
import { useEffect } from "react";
import "../styles/dashboard.css";


export default function CrearDiscapacitado() {

  const navigate = useNavigate();
  const { id } = useParams();
  const esEdicion = !!id;
  const [form, setForm] = useState({
    cod_tipo_doc: "",
    documento: "",
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    rlcpd: "",
    fecha_nacimiento: "",
    sexo: "",
    discapacidad: "",
    celular: "",
    zona: "",
    vereda: "",
    sector: "",
    direccion: "",
    tiene_cuidador: false,
    cuidador_cod_tipo_doc: "",
    cuidador_documento: "",
    cuidador_primer_nombre: "",
    cuidador_segundo_nombre: "",
    cuidador_primer_apellido: "",
    cuidador_segundo_apellido: "",
    cuidador_fecha_nacimiento: "",
    cuidador_sexo: "",
    cuidador_parentesco: "",
    cuidador_celular: ""
  });

  useEffect(() => {
    if (esEdicion) {
      cargarPersona();
    }
  }, [id]);

  const cargarPersona = async () => {
    try {
      const data = await obtenerPersonaPorId(Number(id));

      setForm((prev) => ({
        ...prev,
        ...data,

        tiene_cuidador: data.tiene_cuidador == 1,

        cuidador_cod_tipo_doc: data.cuidador?.cod_tipo_doc || "",
        cuidador_documento: data.cuidador?.documento || "",
        cuidador_primer_nombre: data.cuidador?.primer_nombre || "",
        cuidador_segundo_nombre: data.cuidador?.segundo_nombre || "",
        cuidador_primer_apellido: data.cuidador?.primer_apellido || "",
        cuidador_segundo_apellido: data.cuidador?.segundo_apellido || "",
        cuidador_fecha_nacimiento: data.cuidador?.fecha_nacimiento || "",
        cuidador_sexo: data.cuidador?.sexo || "",
        cuidador_parentesco: data.cuidador?.parentesco || "",
        cuidador_celular: data.cuidador?.celular || ""
      }));

    } catch (error) {
      console.error("Error cargando persona", error);
    }
  };

  const handleChange = (e: any) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({
      ...form,
      [e.target.name]: value
    });
  };

  const [mensaje, setMensaje] = useState("");
  const [mensajeTipo] = useState<"success" | "error">("success");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const dataToSend = {
        ...form,
        tiene_cuidador: form.tiene_cuidador ? 1 : 0,

        cuidador: form.tiene_cuidador
          ? {
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
          }
          : null
      };

      if (esEdicion) {
        await editarPersona(Number(id), dataToSend);
        setMensaje("Persona actualizada correctamente ✅");
      } else {
        await crearPersona(dataToSend);
        setMensaje("Persona creada correctamente ✅");
      }
      console.log("DATA FINAL:", dataToSend);
      setTimeout(() => navigate("/dashboard"), 2000);

    } catch (error) {
      console.error(error);
      setMensaje("Ocurrió un error ❌");
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <div className="dashboard-container">
          <button
            type="button"
            className="btn-volver-dashboard"
            onClick={() => navigate("/dashboard")}
          >
            Volver
          </button>

          <h2>
            {esEdicion
              ? "Editar Persona con Discapacidad"
              : "Crear Persona con Discapacidad"}
          </h2>
          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="cod_tipo_doc">Tipo de Documento</label>
              <select
                id="cod_tipo_doc"
                name="cod_tipo_doc"
                onChange={handleChange}
                value={form.cod_tipo_doc || ""}
              >
                <option value="">Seleccione tipo de documento</option>
                <option value="1">Cédula de Ciudadanía</option>
                <option value="2">Cédula de Extranjería</option>
                <option value="3">Tarjeta de Identidad</option>
                <option value="4">Registro Civil</option>
                <option value="5">Pasaporte</option>
                <option value="6">Permiso por Protección Temporal</option>
              </select>
            </div>
            <div>
              <input className="form-control" name="documento" placeholder="Documento" onChange={handleChange} />
            </div>
            <input name="primer_nombre" placeholder="Primer Nombre" onChange={handleChange} />
            <input name="segundo_nombre" placeholder="Segundo Nombre" onChange={handleChange} />
            <input name="primer_apellido" placeholder="Primer Apellido" onChange={handleChange} />
            <input name="segundo_apellido" placeholder="Segundo Apellido" onChange={handleChange} />
            <div className="form-group">
              <label htmlFor="rlcpd">RLCPD</label>
              <select
                id="rlcpd"
                name="rlcpd"
                value={form.rlcpd || ""}
                onChange={handleChange}
              >
                <option value="">Seleccione una opción</option>
                <option value="SI">Sí</option>
                <option value="NO">No</option>
              </select>
            </div>
            <h3 className="form-title">Datos Personales</h3>
            <div className="form-group">
              <label htmlFor="fecha_nacimiento">Fecha de Nacimiento</label>
              <input type="date" id="fecha_nacimiento" name="fecha_nacimiento" onChange={handleChange} />
            </div>
            <div>
              <select className="form-control" name="sexo" onChange={handleChange}>
                <option value="">Sexo</option>
                <option value="I">Indefinido</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>


            <div className="form-group">
              <label htmlFor="discapacidad">Tipo de Discapacidad</label>
              <select
                id="discapacidad"
                name="discapacidad"
                onChange={handleChange}
                value={form.discapacidad || ""}
              >
                <option value="">Seleccione discapacidad</option>
                <option value="Física">Física</option>
                <option value="Visual">Visual</option>
                <option value="Sordoceguera">Sordoceguera</option>
                <option value="Intelectual">Intelectual</option>
                <option value="Psicosocial-Mental">Psicosocial-Mental</option>
                <option value="Múltiple">Múltiple</option>
              </select>
            </div>
            <div>
              <input className="form-control" name="celular" placeholder="Celular" onChange={handleChange} />
            </div>


            <h3 className="form-title">Ubicación</h3>
            <div className="form-group">
              <label htmlFor="zona">Zona</label>
              <select
                id="zona"
                name="zona"
                value={form.zona || ""}
                onChange={handleChange}
              >
                <option value="">Seleccione zona</option>
                <option value="Urbana">Urbana</option>
                <option value="Rural">Rural</option>
              </select>
            </div>
            <input name="vereda" placeholder="Vereda" onChange={handleChange} />
            <input name="sector" placeholder="Sector" onChange={handleChange} />
            <input name="direccion" placeholder="Dirección" className="full-width" onChange={handleChange} />

            <div className="full-width">
              <label>
                <input
                  type="checkbox"
                  name="tiene_cuidador"
                  checked={form.tiene_cuidador}
                  onChange={handleChange}
                />
                Tiene cuidador
              </label>
            </div>

            {form.tiene_cuidador && (
              <div className="cuidador-section">
                <h3>Datos del Cuidador</h3>
                <select name="cuidador_cod_tipo_doc" onChange={handleChange}>
                  <option value="">Seleccione tipo de documento</option>
                  <option value="1">Cédula de Ciudadanía</option>
                  <option value="2">Cédula de Extranjería</option>
                  <option value="3">Tarjeta de Identidad</option>
                  <option value="4">Registro Civil</option>
                  <option value="5">Pasaporte</option>
                  <option value="6">Permiso por Protección Temporal</option>
                </select>
                <input name="cuidador_documento" placeholder="Documento" onChange={handleChange} />
                <input name="cuidador_primer_nombre" placeholder="Primer Nombre" onChange={handleChange} />
                <input name="cuidador_segundo_nombre" placeholder="Segundo Nombre" onChange={handleChange} />
                <input name="cuidador_primer_apellido" placeholder="Primer Apellido" onChange={handleChange} />
                <input name="cuidador_segundo_apellido" placeholder="Segundo Apellido" onChange={handleChange} />
                <div className="form-group">
                  <label htmlFor="fecha_nacimiento">Fecha de Nacimiento</label>
                  <input type="date" name="cuidador_fecha_nacimiento" value={form.cuidador_fecha_nacimiento} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Sexo</label>
                  <select name="cuidador_sexo" onChange={handleChange}>
                    <option value="">Seleccione</option>
                    <option value="I">Indefinido</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                </div>
                <input name="cuidador_parentesco" placeholder="Parentesco" onChange={handleChange} />
                <input name="cuidador_celular" placeholder="Celular" onChange={handleChange} />
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