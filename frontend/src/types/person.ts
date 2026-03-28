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

export interface Persona {
  id_persona: number;
  codigo: string;
  documento: string;
  primer_nombre: string;
  segundo_nombre: string;
  nombre_completo: string;
  primer_apellido: string;
  segundo_apellido: string;
  fecha_nacimiento: string;
  edad: number;
  sexo: string;
  discapacidad: string;
  celular?: string;
  activo: number;
  sector: string;
  latitud: number;
  longitud: number;
  tiene_cuidador: number | boolean;
  cuidador?: Cuidador | null;
}