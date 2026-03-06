create database aratoca;
use aratoca;

CREATE TABLE ttipo_doc(
    cod_tipo_doc INT AUTO_INCREMENT PRIMARY KEY,
    descripcion_min VARCHAR(10) NOT NULL,
    descripcion VARCHAR(50)
);

CREATE TABLE ubicaciones (
    id_ubicacion INT AUTO_INCREMENT PRIMARY KEY,
    zona VARCHAR(20),
    vereda VARCHAR(100),
    sector VARCHAR(100),
    finca VARCHAR(100),
    barrio VARCHAR(100),
    direccion VARCHAR(200)
);

ALTER TABLE ubicaciones
ADD latitud DECIMAL(10,8),
ADD longitud DECIMAL(11,8);

CREATE TABLE personas_discapacidad (
    id_persona INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20),
    cod_tipo_doc INT,
    documento VARCHAR(20),
    primer_apellido VARCHAR(100),
    segundo_apellido VARCHAR(100),
    primer_nombre VARCHAR(100),
    segundo_nombre VARCHAR(100),
    nombre_completo VARCHAR(200),
    fecha_nacimiento DATE,
    edad INT,
    sexo CHAR(1),
    discapacidad VARCHAR(150),
    rlcpd VARCHAR(10),
    celular VARCHAR(20),
    tiene_cuidador BOOLEAN,
    id_ubicacion INT,
    FOREIGN KEY (cod_tipo_doc) REFERENCES ttipo_doc(cod_tipo_doc),
    FOREIGN KEY (id_ubicacion) REFERENCES ubicaciones(id_ubicacion)
);


CREATE TABLE cuidadores (
    id_cuidador INT AUTO_INCREMENT PRIMARY KEY,
    id_persona INT,
    cod_tipo_doc INT,
    documento VARCHAR(20),
    primer_apellido VARCHAR(100),
    segundo_apellido VARCHAR(100),
    primer_nombre VARCHAR(100),
    segundo_nombre VARCHAR(100),
    nombre_completo VARCHAR(200),
    fecha_nacimiento DATE,
    edad INT,
    sexo CHAR(1),
    parentesco VARCHAR(100),
    celular VARCHAR(20),
    FOREIGN KEY (id_persona) REFERENCES personas_discapacidad(id_persona),
    FOREIGN KEY (cod_tipo_doc) REFERENCES ttipo_doc(cod_tipo_doc)
);


INSERT INTO ttipo_doc (descripcion_min, descripcion) VALUES
('CC','Cédula de Ciudadanía'),
('CE','Cédula de Extranjería'),
('TI','Tarjeta de Identidad'),
('RC','Registro Civil'),
('PAS','Pasaporte'),
('PPT','Permiso por Protección Temporal');

INSERT INTO ubicaciones (zona, sector, direccion, latitud, longitud)
VALUES ('Centro', 'Sector A', 'Calle 10 #5-20', 6.6996, -73.0181);

INSERT INTO personas_discapacidad
(codigo,cod_tipo_doc,documento,primer_apellido,segundo_apellido,primer_nombre,segundo_nombre,
nombre_completo,fecha_nacimiento,edad,sexo,rlcpd,celular,tiene_cuidador,id_ubicacion)
VALUES
('DEAP9075',1,'1100959075','ADARME','PINZON','DAVIER','EDUARDO',
'DAVIER EDUARDO ADARME PINZON','2021-01-01',3,'M','SI','3000000000',TRUE,3);


INSERT INTO ubicaciones (zona, sector, direccion, latitud, longitud)
VALUES ('Centro', 'Sector B', 'Calle 11 #5-25', 6.7002, -73.0176);
select * from personas_discapacidad;
select * from ubicaciones;

INSERT INTO personas_discapacidad
(codigo,cod_tipo_doc,documento,primer_apellido,segundo_apellido,primer_nombre,segundo_nombre,
nombre_completo,fecha_nacimiento,edad,sexo,rlcpd,celular,tiene_cuidador,id_ubicacion)
VALUES
('DEAP9076',1,'1100959076','GARCIA','LOPEZ','MARIA','FERNANDA',
'MARIA FERNANDA GARCIA LOPEZ','2019-05-10',6,'F','SI','3010000000',TRUE,4);

UPDATE personas_discapacidad SET discapacidad = 'VISUAL'
where id_persona = 2;

INSERT INTO ubicaciones (zona, sector, direccion, latitud, longitud)
VALUES ('Centro', 'Sector B', 'Calle 11 #5-25', 6.7002, -73.0176);


SELECT * FROM personas_discapacidad;



SELECT p.id_persona, p.nombre_completo, p.edad, p.sexo, p.discapacidad,u.sector, u.latitud, u.longitud
FROM personas_discapacidad p
JOIN ubicaciones u 
ON p.id_ubicacion = u.id_ubicacion;