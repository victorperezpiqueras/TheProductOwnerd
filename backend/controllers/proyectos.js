var ControllerProyectos = {};
const connection = require('../db/connection');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const controllerInvitaciones = require('../controllers/invitaciones');
/* configurar mailer */
const nodemailer = require('nodemailer');

/**
 * Envia una invitacion por correo
 * @param data contiene los datos de la invitacion: rol, email, invitadoPor, proyecto
 * @param tokenUrl token de la invitacion
 */
async function enviarInvitacion(data, tokenUrl) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  switch (data.rol) {
    case 'desarrollador':
      data.rol = 'Developer';
      break;
    case 'productOwner':
      data.rol = 'Product Owner';
      break;
    case 'stakeholder':
      data.rol = 'Stakeholder';
      break;
  }

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: data.email,
    subject: 'You were invited to a project at TheProductOwnerd website',
    html:
      '<p>You were invited by <b>' +
      data.invitadoPor +
      '</b> to join the project <b>"' +
      data.proyecto +
      '"</b>.<br>' +
      ' By clicking the following link and registering an account you will be joined the project and assigned the <b>' +
      data.rol +
      "'s</b> role.</p>" +
      '<a href="' +
      process.env.MAIL_INVITE_LINK +
      tokenUrl +
      '">Create Account</a><br><br>' +
      'Happy Forecasting!'
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent from ' + mailOptions.from + ' to: ' + mailOptions.to + ' Info: ' + info.response);
    }
  });
}

/**
 * Obtiene todos los proyectos
 */
ControllerProyectos.getProyectos = function() {
  return new Promise(function(resolve, reject) {
    const sql = 'select * from proyectos';
    connection.query(sql, function(err, result) {
      if (err) {
        /* connection.end(function(err) {
          console.log('Error DB');
        }); */
        reject({ error: 'Error inesperado' });
      } else {
        console.log(result);
        /* connection.end(function(err) {
          console.log('Close the database connection.');
        }); */
        resolve(result);
      }
    });
  });
};

/**
 * Obtiene un proyecto dado su id
 * @param id id del proyecto
 * @returns (idproyecto, nombre, descripcion, sprintActual, vision)
 */
ControllerProyectos.getProyecto = function(id) {
  return new Promise(function(resolve, reject) {
    const sql = 'select * from proyectos where idproyecto = ?';
    connection.query(sql, [id], function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado en getProyecto' });
      } else {
        console.log(result[0]);
        resolve(result[0]);
      }
    });
  });
};

/**
 * Obtiene los usuarios de un proyecto
 * @param id id del proyecto
 * @returns [ {idusuario, nombre, email} ]
 */
ControllerProyectos.getProyectoUsuarios = function(id) {
  return new Promise(function(resolve, reject) {
    const sql =
      'select u.idusuario, u.nombre, u.email from usuarios u, proyectos p, roles r where p.idproyecto = ? and u.idusuario = r.idusuario and p.idproyecto =r.idproyecto';
    connection.query(sql, [id], function(err, result) {
      if (err) {
        /*  connection.end(function(err) {
          console.log('Error DB');
        }); */
        reject({ error: 'Error inesperado' });
      } else {
        console.log(result);
        /*  connection.end(function(err) {
          console.log('Close the database connection.');
        }); */
        resolve(result);
      }
    });
  });
};

/**
 * Obtiene los usuarios y roles de un proyecto
 * @param id id del proyecto
 * @returns [ {idusuario, nick, email, rol} ]
 */
ControllerProyectos.getProyectoUsuariosRoles = function(id) {
  return new Promise(function(resolve, reject) {
    const sql =
      'select u.idusuario, u.nick, u.email, r.nombre as rol from usuarios u,' +
      'proyectos p, roles r where u.idusuario = r.idusuario and p.idproyecto = r.idproyecto and p.idproyecto = ?';
    connection.query(sql, [id], function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado' });
      } else {
        console.log(result /* [0] */);
        resolve(result /* [0] */);
      }
    });
  });
};

/**
 * Obtiene todos los usuarios y roles
 */
ControllerProyectos.getProyectosUsuariosRoles = function() {
  return new Promise(function(resolve, reject) {
    const sql =
      'select u.idusuario, u.nick, u.email, r.nombre as rol, p.idproyecto from usuarios u, proyectos p, roles r where u.idusuario = r.idusuario and p.idproyecto = r.idproyecto';
    connection.query(sql, function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado' });
      } else {
        console.log(result);
        resolve(result);
      }
    });
  });
};

/**
 * Crea un proyecto y asigna el rol productOwner al usuario
 * @param data contiene los datos del proyecto: nombre, descripcion; y del usuario: idusuario
 */
ControllerProyectos.crearProyecto = function(data) {
  return new Promise(function(resolve, reject) {
    const sql = 'insert into proyectos(nombre,descripcion) values(?, ?)';
    connection.query(sql, [data.nombre, data.descripcion], function(err, result) {
      if (err) {
        reject({ error: 'project_name_exists' });
        //throw err;
      } else {
        console.log('insertado proyecto');

        var sql = 'select idproyecto from proyectos where nombre = ?';
        connection.query(sql, [data.nombre], function(err, result) {
          if (err) {
            reject('Error al buscar el proyecto');
            //throw err;
          } else {
            console.log('idproyecto', result);
            const idProyecto = result[0].idproyecto;
            const sql =
              'insert into roles(nombre,idusuario,idproyecto, ordenar, editarPBI,estimarTam,estimarValor, mantenerUsuarios, archivarProyecto, setDone, proyecciones, sprintGoals, vision)' +
              ' values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            connection.query(sql, ['productOwner', data.idusuario, idProyecto, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1], function(
              err,
              result
            ) {
              if (err) {
                reject('Error al insertar los roles');
                //throw err;
              } else {
                console.log('insertado rol');
                resolve(result);
                /*   var sql =
                     'select r.idrol from roles r, proyectos p, usuarios u where u.idusuario = ? and u.idusuario = r.idusuario and p.idproyecto = r.idproyecto and p.nombre = ?';
                   connection.query(sql, [data.idusuario, data.nombre], function(err, result) {
                     if (err) {
                       reject('Error al buscar el rol');
                     } else {
                       console.log(result);
                       var idRol = result[0].idrol;
                       var sql =
                         'insert into rolespermisos(idrol,permiso) values(?, ?),(?, ?),(?, ?),(?, ?),(?, ?),(?, ?)';
                       connection.query(
                         sql,
                         [
                           idRol,
                           'ordenar',
                           idRol,
                           'editarPBI',
                           idRol,
                           'mantenerUsuarios',
                           idRol,
                           'archivarProyecto',
                           idRol,
                           'setDone',
                           idRol,
                           'proyecciones'
                         ],
                         function(err, result) {
                           if (err) {
                             reject('Error al insertar los permisos');
                           } else {
                             console.log('insertado rolespermisos');
                             resolve(result);
                           }
                         }
                       );
                     }
                   }); */
              }
            });
          }
        });
      }
    });
  });
};

/**
 * Actualiza los datos de un proyecto
 * @param idproyecto id del proyecto
 * @param proyecto contiene los datos del proyecto: nombre, descripcion, vision, sprintActual
 */
ControllerProyectos.actualizarProyecto = function(idproyecto, proyecto) {
  return new Promise(function(resolve, reject) {
    const sql = 'update proyectos set nombre=?, descripcion=?, vision=?, sprintActual=? where idproyecto=?';
    connection.query(
      sql,
      [proyecto.nombre, proyecto.descripcion, proyecto.vision, proyecto.sprintActual, idproyecto],
      function(err, result) {
        if (err) {
          reject({ error: 'Error inesperado en actualizarProyecto' });
        } else {
          resolve(result);
        }
      }
    );
  });
};

/**
 * Agrega un usuario a un proyecto con el rol proporcionado
 * @param idproyecto id del proyecto
 * @param data contiene los datos del usuario: idusuario, rol
 */
ControllerProyectos.proyectoAgregarUsuario = function(idproyecto, data) {
  return new Promise(function(resolve, reject) {
    var sql = 'select * from roles where idusuario=? and idproyecto=?';
    connection.query(sql, [data.idusuario, idproyecto], function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado en proyectoAgregarUsuario' });
      } else {
        if (result && result.length > 0) {
          reject({ error: 'error_already_in_project' });
        } else {
          var sql =
            'insert into roles(nombre,idusuario,idproyecto, ordenar, editarPBI,estimarTam,estimarValor, mantenerUsuarios, archivarProyecto, setDone, proyecciones, sprintGoals, vision)' +
            ' values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
          if (data.rol == 'productOwner') {
            var list = ['productOwner', data.idusuario, idproyecto, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1];
          } else if (data.rol == 'desarrollador') {
            var list = ['desarrollador', data.idusuario, idproyecto, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0];
          } else {
            var list = ['stakeholder', data.idusuario, idproyecto, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          }
          connection.query(sql, list, function(err, result) {
            if (err) {
              reject({ error: 'Error inesperado' });
            } else {
              console.log('insertado rol');
              resolve(result);
            }
          });
        }
      }
    });
  });
};

/**
 * Elimina un usuario del proyecto
 * @param idproyecto id del proyecto
 * @param idusuario id del usuario
 */
ControllerProyectos.proyectoEliminarUsuario = function(idproyecto, idusuario) {
  return new Promise(function(resolve, reject) {
    const sql = 'delete from roles where idusuario=? and idproyecto=?';
    connection.query(sql, [idusuario, idproyecto], function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado en proyectoEliminarUsuario' });
      } else {
        resolve(result);
      }
    });
  });
};

/**
 * Invita un usuario al proyecto. Si existe lo agrega, si no, genera una invitacion
 * @param idproyecto id del proyecto
 * @param data datos de la invitacion: email, rol, nombreProyecto, invitadoPor
 */
ControllerProyectos.proyectoInvitarUsuario = function(idproyecto, data) {
  return new Promise(function(resolve, reject) {
    const sql = 'select * from usuarios where email=?';
    arr = [data.email];
    var proyectoInvitado;
    connection.query(sql, arr, function(err, result) {
      if (err) {
        reject({ error: 'email_searching_error' });
      } else {
        console.log(result);
        if (result.length > 0) {
          /* existe el usuario --> agregar al proyecto */
          /* var inviData = { rol: 'desarrollador', idusuario: result[0].idusuario }; */
          const inviData = { rol: data.rol, idusuario: result[0].idusuario };
          ControllerProyectos.proyectoAgregarUsuario(idproyecto, inviData).then(data => {
            resolve({ existe: true });
          });
        } else {
          /* no existe el usuario --> crear invitacion */
          const tokenUrl = jwt.sign({ idproyecto: idproyecto, email: data.email, rol: data.rol }, config.jwtKey);
          console.log(tokenUrl);
          controllerInvitaciones
            .crearInvitacion({ token: tokenUrl, rol: data.rol, idproyecto: idproyecto, email: data.email })
            .then(res => {
              console.log(res);
              enviarInvitacion(
                { email: data.email, proyecto: data.nombreProyecto, rol: data.rol, invitadoPor: data.invitadoPor },
                tokenUrl
              );
              resolve({ existe: false });
            })
            .catch(err => console.log(err));
        }
      }
    });
  });
};

/**
 * Obtiene los pbis de un proyecto
 * @param idproyecto id del proyecto
 * @returns [ {idpbi, titulo, descripcion, done, label, estimacion, idproyecto, prioridad, valor, sprint, sprintCreacion} ]
 */
ControllerProyectos.getProyectoPBIs = function(idproyecto) {
  return new Promise(function(resolve, reject) {
    const sql = 'select p.* from pbis p, proyectos pr where pr.idproyecto=p.idproyecto and p.idproyecto = ?';
    connection.query(sql, [idproyecto], function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado en getProyectoPBIs' });
      } else {
        console.log(result);
        resolve(result);
      }
    });
  });
};

/**
 * Obtiene los sprintgoals de un proyecto
 * @param idproyecto id del proyecto
 * @returns [ {idproyecto, goal, sprintNumber} ]
 */
ControllerProyectos.getProyectoSprintGoals = function(idproyecto) {
  return new Promise(function(resolve, reject) {
    const sql = 'select * from sprintgoals where idproyecto = ?';
    connection.query(sql, [idproyecto], function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado en getProyectoSprintGoals' });
      } else {
        console.log(result);
        resolve(result);
      }
    });
  });
};

module.exports = ControllerProyectos;
