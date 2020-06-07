# Database Models

## Usuarios

| Column    | Type         | Restrictions                          |
| --------- | :----------- | ------------------------------------- |
| idusuario | int(11)      | NOT NULL, AUTO INCREMENT, PRIMARY KEY |
| nombre    | varchar(255) | NOT NULL                              |
| password  | varchar(255) | NOT NULL                              |
| email     | varchar(255) | NOT NULL, UNIQUE                      |
| nick      | varchar(255) | NOT NULL                              |
| apellido1 | varchar(255) | NOT NULL                              |
| apellido2 | varchar(255) | NOT NULL                              |

---

## Invitaciones

| Column     | Type         | Restrictions          |
| ---------- | :----------- | --------------------- |
| idproyecto | int(11)      | NOT NULL, PRIMARY KEY |
| email      | varchar(255) | NOT NULL, PRIMARY KEY |
| rol        | varchar(255) | NOT NULL              |
| token      | varchar(255) | NOT NULL              |

---

## Proyectos

| Column       | Type         | Restrictions                          |
| ------------ | :----------- | ------------------------------------- |
| idproyecto   | int(11)      | NOT NULL, AUTO INCREMENT, PRIMARY KEY |
| nombre       | varchar(255) | NOT NULL, UNIQUE                      |
| descripcion  | varchar(255) |                                       |
| sprintActual | int(11)      | NOT NULL, DEFAULT=1                   |
| vision       | text         |                                       |
| deadline     | int(11)      | NOT NULL, DEFAULT=5                   |

---

## Sprintgoals

| Column       | Type    | Restrictions          |
| ------------ | :------ | --------------------- |
| idproyecto   | int(11) | NOT NULL, PRIMARY KEY |
| goal         | text    |                       |
| sprintNumber | int(11) | NOT NULL, PRIMARY KEY |

---

## Pbis

| Column         | Type         | Restrictions                          |
| -------------- | :----------- | ------------------------------------- |
| idpbi          | int(11)      | NOT NULL, AUTO INCREMENT, PRIMARY KEY |
| titulo         | varchar(255) | NOT NULL                              |
| descripcion    | text         |                                       |
| done           | tinyint(1)   | NOT NULL                              |
| label          | varchar(255) | NOT NULL                              |
| estimacion     | int(11)      |                                       |
| idproyecto     | int(11)      | MUL                                   |
| prioridad      | int(11)      | NOT NULL                              |
| valor          | int(11)      |                                       |
| sprint         | int(11)      |                                       |
| sprintCreacion | int(11)      | NOT NULL                              |

---

## Dependencias

| Column        | Type    | Restrictions                          |
| ------------- | :------ | ------------------------------------- |
| iddependencia | int(11) | NOT NULL, AUTO INCREMENT, PRIMARY KEY |
| idpbi         | int(11) | NOT NULL, MUL                         |
| idpbi2        | int(11) | NOT NULL, MUL                         |

---

## Criterios

| Column     | Type       | Restrictions                          |
| ---------- | :--------- | ------------------------------------- |
| idcriterio | int(11)    | NOT NULL, AUTO INCREMENT, PRIMARY KEY |
| nombre     | text       | NOT NULL                              |
| done       | tinyint(1) | NOT NULL                              |
| idpbi      | int(11)    | NOT NULL, MUL                         |

---

## Comentarios

| Column       | Type     | Restrictions                          |
| ------------ | :------- | ------------------------------------- |
| idcomentario | int(11)  | NOT NULL, AUTO INCREMENT, PRIMARY KEY |
| comentario   | text     | NOT NULL                              |
| fecha        | datetime | NOT NULL                              |
| idpbi        | int(11)  | NOT NULL, MUL                         |
| idusuario    | int(11)  | NOT NULL, MUL                         |

---

## Archivos

| Column    | Type         | Restrictions                          |
| --------- | :----------- | ------------------------------------- |
| idarchivo | int(11)      | NOT NULL, AUTO INCREMENT, PRIMARY KEY |
| nombre    | varchar(255) | NOT NULL                              |
| src       | longblob     | NOT NULL                              |
| idusuario | int(11)      | NOT NULL, MUL                         |
| idpbi     | int(11)      | NOT NULL, MUL                         |
