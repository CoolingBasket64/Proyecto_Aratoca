// Las interfaces en TypeScript definen la "forma" de un objeto:
// que propiedades tiene y que tipo de dato es cada una.
// Sirven para que el editor detecte errores antes de ejecutar el codigo.

// Representa los datos de un cuidador
export interface Cuidador {
  cod_tipo_doc: string;
  documento: string;
  primer_nombre: string;
  segundo_nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  fecha_nacimiento: string;
  sexo: string;
  parentesco: string;
  celular: string;
}

// Representa los datos de una persona con discapacidad
export interface Persona {
  id_persona: number;
  codigo: string;       // Codigo unico autogenerado (ej: JCPG3456)
  documento: string;
  primer_nombre: string;
  segundo_nombre: string;
  nombre_completo: string;
  primer_apellido: string;
  segundo_apellido: string;
  fecha_nacimiento: string;
  cod_tipo_doc: string;
  edad: number;
  sexo: string;
  discapacidad: string;
  celular?: string;     // El ? significa que el campo es opcional (puede no existir)
  activo: number;       // 1 = activo, 0 = inactivo
  zona?: string;        // Urbana o Rural
  vereda?: string;
  cod_sector: string;   // Codigo del sector geografico para el mapa
  sector: string;
  latitud: number;
  longitud: number;
  tiene_cuidador: number | boolean; // Puede llegar como 1/0 desde MySQL o true/false desde el form
  rlcpd: string;        // Registro de Localizacion y Caracterizacion de Personas con Discapacidad
  cuidador?: Cuidador | null; // Objeto anidado con datos del cuidador, puede ser null

  // Campos del cuidador cuando vienen "planos" desde el listado general (no anidados)
  cuidador_nombre?: string;
  cuidador_documento?: string;
  cuidador_parentesco?: string;
  cuidador_celular?: string;
  cuidador_sexo?: string;
  cuidador_edad?: number;
}
