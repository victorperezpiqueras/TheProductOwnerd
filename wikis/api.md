# Backend API methods table:

API calls start with the prefix: `/api`

All methods require the user to be authenticated except those marked with: _NAuth_ .

Methods with "\*" are for debugging purposes.

---

## /usuarios

| URL                                          | Method | Description                                                                                            |
| -------------------------------------------- | :----- | ------------------------------------------------------------------------------------------------------ |
| `/`\*                                        | GET    | Returns all users                                                                                      |
| `/:idusuario`                                | GET    | Returns a user by its id                                                                               |
| `/:idusuario/actualizar`                     | PUT    | Updates user data                                                                                      |
| `/:idusuario/actualizarpassword`             | PUT    | Updates user password                                                                                  |
| `/registro` _(NAuth)_                        | POST   | Registers a new user                                                                                   |
| `/registro/invitar` _(NAuth)_                | POST   | Registers a new user with an invitation link and joins the user to the project the user was invited to |
| `/login` _(NAuth)_                           | POST   | Authenticates the user and returns its token credentials                                               |
| `/:idusuario/proyectos`                      | GET    | Returns all projects where the user is member of                                                       |
| `/:idusuario/proyectos/:idproyecto/permisos` | GET    | Returns the permissions of the user for a project given its id                                         |
| `/:idusuario/proyectosfavoritos`             | GET    | Returns user favourite projects                                                                        |
| `/:idusuario/proyectosfavoritos`             | POST   | Adds a new project to favourites                                                                       |
| `/:idusuario/proyectosfavoritos`             | DELETE | Removes project from favourites                                                                        |

---

## /invitaciones

| URL                 | Method | Description                              |
| ------------------- | :----- | ---------------------------------------- |
| `/:token` _(NAuth)_ | GET    | Returns the invitation linked to a token |

---

## /proyectos

| URL                                       | Method | Description                                                                                                               |
| ----------------------------------------- | :----- | ------------------------------------------------------------------------------------------------------------------------- |
| `/:idproyecto`                            | GET    | Returns a project by its id                                                                                               |
| `/`                                       | POST   | Creates a new project and assign the user the Admin's role                                                                |
| `/:idproyecto`                            | PUT    | Updates project data                                                                                                      |
| `/:idproyecto/agregarUsuario`             | POST   | Adds a user to the project with the given role                                                                            |
| `/:idproyecto/eliminarUsuario/:idusuario` | DELETE | Kicks a user from the project                                                                                             |
| `/:idproyecto/invitar`                    | POST   | Invites a user by email to a project, if the user exists it is joined. If not, an invitation email is sent to its address |
| `/:idproyecto/usuarios`                   | GET    | Returns the list of users that are part of a project                                                                      |
| `/:idproyecto/usuarios/roles`             | GET    | Returns the users and their roles and permissions for a project                                                           |
| `/:idproyecto/sprintgoals`                | GET    | Returns a project sprint goals list                                                                                       |
| `/:idproyecto/pbis`                       | GET    | Returns all pbis of a project                                                                                             |
| `/`\*                                     | GET    | Returns all projects                                                                                                      |
| `/usuarios/roles`\*                       | GET    | Returns all users and their roles for projects                                                                            |

---

## /sprintgoals

| URL | Method | Description                          |
| --- | :----- | ------------------------------------ |
| `/` | POST   | Creates a sprint goal in a project   |
| `/` | PUT    | Updates a sprint goal from a project |

---

## /pbis

| URL                    | Method | Description                              |
| ---------------------- | :----- | ---------------------------------------- |
| `/`                    | POST   | Creates a pbi                            |
| `/:idpbi`              | PUT    | Updates pbi data                         |
| `/`                    | PUT    | Updates the priority of a list of pbis   |
| `/:idpbi/comentarios`  | GET    | Returns the comments of a pbi            |
| `/:idpbi/archivos`     | GET    | Returns the files linked to a pbi        |
| `/:idpbi/criterios`    | GET    | Returns the acceptance criteria of a pbi |
| `/:idpbi/dependencias` | GET    | Returns the dependencies of a pbi        |

---

## /dependencias

| URL         | Method | Description                                                      |
| ----------- | :----- | ---------------------------------------------------------------- |
| `/`         | POST   | Creates a dependency in a pbi                                    |
| `/:id/:id2` | DELETE | Removes a dependency given the dependent pbi and its related pbi |

---

## /criterios

| URL            | Method | Description                               |
| -------------- | :----- | ----------------------------------------- |
| `/`            | POST   | Creates an acceptance criteria in a pbi   |
| `/:idcriterio` | PUT    | Updates an acceptance criteria            |
| `/:idcriterio` | DELETE | Removes an acceptance criteria from a pbi |

---

## /comentarios

| URL | Method | Description                |
| --- | :----- | -------------------------- |
| `/` | POST   | Creates a comment in a pbi |

---

## /archivos

| URL           | Method | Description               |
| ------------- | :----- | ------------------------- |
| `/`           | POST   | Creates a file in a pbi   |
| `/:idarchivo` | DELETE | Removes a file from a pbi |
