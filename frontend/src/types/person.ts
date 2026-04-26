// TypeScript usa "interfaces" para definir la estructura de un objeto:
// que propiedades tiene y de que tipo es cada una.
// Cuando un componente o funcion usa este tipo, el editor detecta errores
// si se intenta acceder a una propiedad que no existe o tiene el tipo incorrecto.

// Representa los datos de un cuidador de una persona con discapacidad
export interface Cuidador {
  cod_tipo_doc:     string; // Codigo numerico del tipo de documento (1=CC, 2=CE, etc.)
  documento:        string;
  primer_nombre:    string;
  segundo_nombre:   string;
  primer_apellido:  string;
  segundo_apellido: string;
  fecha_nacimiento: string; // Formato ISO: "YYYY-MM-DD"
  sexo:             string; // "M", "F" o "I"
  parentesco:       string; // Relacion con la persona (ej: "Hijo", "Madre")
  celular:          string;
}

// Representa los datos completos de una persona con discapacidad.
// Incluye sus datos personales, ubicacion y cuidador.
export interface Persona {
  id_persona:       number;
  codigo:           string;  // Codigo unico autogenerado: iniciales + ultimos 4 del documento (ej: JCPG3456)
  descripcion_min?: string;
  documento:        string;
  primer_nombre:    string;
  segundo_nombre:   string;
  nombre_completo:  string;  // Concatenacion de los 4 nombres/apellidos (calculado en el backend)
  primer_apellido:  string;
  segundo_apellido: string;
  fecha_nacimiento: string;
  cod_tipo_doc:     string;
  edad:             number;  // Calculada automaticamente a partir de fecha_nacimiento
  sexo:             string;  // "M", "F" o "I"
  discapacidad:     string;  // "Fisica", "Visual", "Intelectual", etc.
  celular?:         string;  // El ? significa que el campo es opcional (puede ser undefined)
  activo:           number;  // 1 = activo, 0 = inactivo (MySQL no tiene tipo boolean nativo)
  zona?:            string;  // "Urbana" o "Rural"
  vereda?:          string;  // Solo aplica para zona Rural
  cod_sector:       string;  // Codigo del sector geografico, se usa para cruzar con el GeoJSON del mapa
  sector:           string;  // Nombre del sector
  latitud:          number;
  longitud:         number;
  tiene_cuidador:   number | boolean; // Llega como 1/0 desde MySQL, o true/false desde el formulario
  rlcpd:            string;  // "SI" o "NO" — Registro de Localizacion y Caracterizacion de Personas con Discapacidad
  cuidador?:        Cuidador | null; // Objeto anidado con datos del cuidador. null si no tiene.

  // Estos campos existen cuando los datos del cuidador vienen "planos" en el listado general.
  // En obtenerPersonas() el cuidador no viene anidado sino como columnas adicionales en la misma fila.
  cuidador_cod_tipo_doc?:     string;
  cuidador_descripcion_min?:  string;
  cuidador_primer_nombre?:    string;
  cuidador_segundo_nombre?:   string;
  cuidador_primer_apellido?:  string;
  cuidador_segundo_apellido?: string;
  cuidador_nombre?:           string;
  cuidador_documento?:        string;
  cuidador_fecha_nacimiento?: string;
  cuidador_parentesco?:       string;
  cuidador_celular?:          string;
  cuidador_sexo?:             string;
  cuidador_edad?:             number;
}
