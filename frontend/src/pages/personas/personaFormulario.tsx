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

  // useLocation permite leer el estado pasado al navegar (ej: desde donde venimos)
  const location = useLocation();
  const from = location.state?.from;
  const navigate = useNavigate();

  // Si la URL tiene :id es edicion, si no tiene ID es creacion
  const { id } = useParams();
  const esEdicion = !!id;

  // Un unico objeto de estado para todos los campos del formulario.
  // Esto simplifica el manejo porque un solo handleChange sirve para todos los inputs.
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
    // Campos del cuidador con prefijo para diferenciarlos de los de la persona
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

  // Si es edicion, carga los datos de la persona cuando el componente aparece
  useEffect(() => {
    if (esEdicion) {
      cargarPersona();
    }
  }, [id]);

  // Las fechas de MySQL vienen con formato ISO (2024-01-15T00:00:00.000Z)
  // pero el input type="date" necesita solo la parte YYYY-MM-DD
  const formatDate = (date?: string) => {
    if (!date) return "";
    return date.split("T")[0];
  };

  const cargarPersona = async () => {
    try {
      const data = await obtenerPersonaPorId(Number(id));

      // El operador spread (...prev) copia el estado anterior y luego sobreescribe
      // solo los campos que llegaron del backend
      setForm((prev) => ({
        ...prev,
        ...data,

        // Algunos campos necesitan conversion de tipo antes de usarlos en el formulario
        cod_tipo_doc: String(data.cod_tipo_doc || ""),
        rlcpd: data.rlcpd || "",
        sexo: data.sexo || "",
        discapacidad: data.discapacidad || "",
        zona: data.zona || "",
        fecha_nacimiento: formatDate(data.fecha_nacimiento),

        // MySQL retorna 1/0, el checkbox necesita true/false
        tiene_cuidador: data.tiene_cuidador == 1,

        // Los datos del cuidador vienen anidados en data.cuidador
        // El operador ?. evita error si cuidador es null
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

    } catch (error) {
      console.error("Error cargando persona", error);
    }
  };

  // Maneja los cambios en todos los inputs del formulario
  const handleChange = (e: any) => {
    // Extrae las propiedades del evento del input
    const { name, type, checked, value } = e.target;

    // Si el input es un checkbox, usa "checked" (true/false). Si es texto usa "value"
    const val = type === "checkbox" ? checked : value;

    setForm((prev) => {
      // Caso especial: si cambia la zona y NO es Rural,
      // limpia vereda y sector porque solo aplican en zona Rural
      if (name === "zona") {
        return {
          ...prev,
          zona: val,
          ...(val !== "Rural" && { vereda: "", sector: "" })
        };
      }

      // Para cualquier otro campo: copia el estado anterior y actualiza solo el campo que cambio
      // [name] es una clave dinamica: usa el valor de la variable "name" como nombre de propiedad
      return {
        ...prev,
        [name]: val
      };
    });
  };

  const [mensaje, setMensaje] = useState("");
  const [mensajeTipo] = useState<"success" | "error">("success");
  // Mensaje especifico para informar si se encontro un cuidador existente
  const [mensajeCuidador, setMensajeCuidador] = useState("");

  // Se ejecuta cuando el usuario termina de escribir el documento del cuidador (evento onBlur)
  // y busca si ya existe ese cuidador en la base de datos para autocompletar el formulario
  const buscarCuidador = async (documento: string) => {
    if (!documento || documento.length < 4) return;
    try {
      const encontrado = await buscarCuidadorPorDocumento(documento);
      if (encontrado) {
        // Si existe el cuidador, llena automaticamente todos sus campos
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
      } else {
        setMensajeCuidador("");
      }
    } catch {
      setMensajeCuidador("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Prepara los datos para enviar al backend
      const dataToSend = {
        ...form,
        // Convierte el booleano del checkbox a 1/0 para que MySQL lo entienda
        tiene_cuidador: form.tiene_cuidador ? 1 : 0,

        // Si tiene cuidador, construye el objeto con sus datos agrupados
        // Si no tiene cuidador, envia null para que el backend elimine al cuidador si existia
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
        setMensaje("Persona actualizada correctamente");
      } else {
        console.log(dataToSend)
        await crearPersona(dataToSend);
        setMensaje("Persona creada correctamente");
      }
      console.log("DATA FINAL:", dataToSend);
      // Redirige al dashboard despues de 2 segundos para que el usuario vea el mensaje
      setTimeout(() => navigate("/dashboard"), 2000);

    } catch (error) {
      console.error(error);
      setMensaje("Ocurrio un error");
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <div className="dashboard-container dashboard-container-form">

          {/* Boton volver: regresa a gestion de discapacitados o al dashboard segun el origen */}
          <button
            type="button"
            className="btn-volver-dashboard"
            onClick={() => {
              if (from === "gestionar") {
                navigate("/gestionar-discapacitado");
              } else {
                navigate("/dashboard");
              }
            }}
          >
            Volver
          </button>

          <h2>
            {esEdicion
              ? "Editar Persona con Discapacidad"
              : "Crear Persona con Discapacidad"}
          </h2>

          <form className="form-grid" onSubmit={handleSubmit}>

            {/* Selector de tipo de documento */}
            <div className="form-group">
              <label htmlFor="cod_tipo_doc">Tipo de Documento</label>
              <select id="cod_tipo_doc" name="cod_tipo_doc" onChange={handleChange} value={form.cod_tipo_doc} >
                <option value="">Seleccione tipo de documento</option>
                <option value="1">Cedula de Ciudadania</option>
                <option value="2">Cedula de Extranjeria</option>
                <option value="3">Tarjeta de Identidad</option>
                <option value="4">Registro Civil</option>
                <option value="5">Pasaporte</option>
                <option value="6">Permiso por Proteccion Temporal</option>
              </select>
            </div>

            <div>
              <label htmlFor="Nro Documento">Nro Documento</label>
              <input className="form-control" name="documento" placeholder="Documento" value={form.documento} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="Primer Nombre">Primer Nombre</label>
              <input name="primer_nombre" placeholder="Primer Nombre" value={form.primer_nombre} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="Segundo Nombre">Segundo Nombre</label>
              <input name="segundo_nombre" placeholder="Segundo Nombre" value={form.segundo_nombre} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="Primer Apellido">Primer Apellido</label>
              <input name="primer_apellido" placeholder="Primer Apellido" value={form.primer_apellido} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="Segundo Apellido">Segundo Apellido</label>
              <input name="segundo_apellido" placeholder="Segundo Apellido" value={form.segundo_apellido} onChange={handleChange} />
            </div>

            {/* RLCPD: Registro de Localizacion y Caracterizacion de Personas con Discapacidad */}
            <div className="form-group">
              <label htmlFor="rlcpd">RLCPD</label>
              <select id="rlcpd" name="rlcpd" value={form.rlcpd || ""} onChange={handleChange} >
                <option value="">Seleccione una opcion</option>
                <option value="SI">Si</option>
                <option value="NO">No</option>
              </select>
            </div>

            <h3 className="form-title">Datos Personales</h3>

            <div className="form-group">
              <label htmlFor="fecha_nacimiento">Fecha de Nacimiento</label>
              <input type="date" id="fecha_nacimiento" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="Sexo">Sexo</label>
              <select className="form-control" name="sexo" value={form.sexo} onChange={handleChange}>
                <option value="">Sexo</option>
                <option value="I">Indefinido</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="discapacidad">Tipo de Discapacidad</label>
              <select id="discapacidad" name="discapacidad" onChange={handleChange} value={form.discapacidad} >
                <option value="">Seleccione discapacidad</option>
                <option value="FÍSICA">Fisica</option>
                <option value="VISUAL">Visual</option>
                <option value="AUDITIVA">Auditiva</option>
                <option value="INTELECTUAL">Intelectual</option>
                <option value="PSICOSOCIAL">Psicosocial</option>
                <option value="MÚLTIPLE">Multiple</option>
              </select>
            </div>
            <div>
              <label htmlFor="Celular">Celular</label>
              <input className="form-control" name="celular" placeholder="Celular" value={form.celular} onChange={handleChange} />
            </div>

            <h3 className="form-title">Ubicacion</h3>

            <div className="form-group">
              <label htmlFor="zona">Zona</label>
              <select id="zona" name="zona" value={form.zona || ""} onChange={handleChange} >
                <option value="">Seleccione zona</option>
                <option value="URBANO">Urbana</option>
                <option value="RURAL">Rural</option>
              </select>
            </div>

            {/* Los campos de vereda y sector solo aparecen si la zona es Rural
                El fragmento <> </> agrupa elementos sin agregar un div extra al DOM */}
            {form.zona === "RURAL" && (
              <>
                <div>
                  <label htmlFor="Vereda">Vereda</label>
                  <input name="vereda" placeholder="Vereda" value={form.vereda} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="Sector">Sector</label>
                  <input name="sector" placeholder="Sector" value={form.sector} onChange={handleChange} />
                </div>
              </>
            )}

            <div>
              <label htmlFor="Direccion">Direccion</label>
              <input name="direccion" placeholder="Direccion" className="full-width" value={form.direccion} onChange={handleChange} />
            </div>

            {/* Checkbox para activar la seccion del cuidador */}
            <div className="full-width">
              <label>
                <input type="checkbox" name="tiene_cuidador" checked={form.tiene_cuidador} onChange={handleChange} />
                Tiene cuidador
              </label>
            </div>

            {/* La seccion del cuidador solo se muestra si el checkbox esta marcado */}
            {form.tiene_cuidador && (
              <div className="cuidador-section">
                <h3>Datos del Cuidador</h3>

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
                </div>

                <div>
                  <label>Nro Documento</label>
                  {/* onBlur se dispara cuando el usuario sale del campo (pierde el foco)
                      En ese momento se busca si el cuidador ya existe en la base de datos */}
                  <input
                    name="cuidador_documento"
                    placeholder="Documento"
                    value={form.cuidador_documento}
                    onChange={(e) => { handleChange(e); setMensajeCuidador(""); }}
                    onBlur={(e) => buscarCuidador(e.target.value)}
                  />
                  {/* Mensaje verde si se encontro el cuidador */}
                  {mensajeCuidador && <p style={{ color: "green", fontSize: "12px", marginTop: "4px" }}>{mensajeCuidador}</p>}
                </div>

                <div>
                  <label>Primer Nombre</label>
                  <input name="cuidador_primer_nombre" placeholder="Primer Nombre" value={form.cuidador_primer_nombre} onChange={handleChange} />
                </div>
                <div>
                  <label>Segundo Nombre</label>
                  <input name="cuidador_segundo_nombre" placeholder="Segundo Nombre" value={form.cuidador_segundo_nombre} onChange={handleChange} />
                </div>
                <div>
                  <label>Primer Apellido</label>
                  <input name="cuidador_primer_apellido" placeholder="Primer Apellido" value={form.cuidador_primer_apellido} onChange={handleChange} />
                </div>
                <div>
                  <label>Segundo Apellido</label>
                  <input name="cuidador_segundo_apellido" placeholder="Segundo Apellido" value={form.cuidador_segundo_apellido} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label htmlFor="fecha_nacimiento">Fecha de Nacimiento</label>
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
