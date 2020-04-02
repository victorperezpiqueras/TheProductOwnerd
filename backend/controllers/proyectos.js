var ControllerProyectos = {};
var connection = require('../db/connection');
const jwt = require('jsonwebtoken');
const jwtKey = require('../config/config');
var controllerInvitaciones = require('../controllers/invitaciones');

/* configurar mailer */
var nodemailer = require('nodemailer');
async function enviarInvitacion(email, tokenUrl) {
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

  var mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Invitation to a project at The-Product-Ownerd website',
    html:
      '<p>Click the following link to create your account:</p><br><a href="' +
      process.env.MAIL_INVITE_LINK +
      tokenUrl +
      '">Create Account</a>'
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent from ' + mailOptions.from + ' to: ' + mailOptions.to + ' Info: ' + info.response);
    }
  });
}

ControllerProyectos.getProyectos = function() {
  return new Promise(function(resolve, reject) {
    var sql = 'select * from proyectos';
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
ControllerProyectos.getProyecto = function(id) {
  return new Promise(function(resolve, reject) {
    var sql = 'select * from proyectos where idproyecto = ?';
    connection.query(sql, [id], function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado' });
      } else {
        console.log(result[0]);
        resolve(result[0]);
      }
    });
  });
};

ControllerProyectos.getProyectosUsuarios = function(id) {
  return new Promise(function(resolve, reject) {
    var sql =
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
ControllerProyectos.getProyectoUsuariosRoles = function(id) {
  return new Promise(function(resolve, reject) {
    var sql =
      'select u.idusuario, u.nick, u.email, r.nombre as rol from usuarios u,' +
      'proyectos p, roles r where u.idusuario = r.idusuario and p.idproyecto = r.idproyecto and p.idproyecto = ?';
    connection.query(sql, [id], function(err, result) {
      if (err) {
        /* connection.end(function(err) {
          console.log('Error DB');
        }); */
        reject({ error: 'Error inesperado' });
      } else {
        console.log(result /* [0] */);
        /* connection.end(function(err) {
          console.log('Close the database connection.');
        }); */
        resolve(result /* [0] */);
      }
    });
  });
};
ControllerProyectos.getProyectosUsuariosRoles = function() {
  return new Promise(function(resolve, reject) {
    var sql =
      'select u.idusuario, u.nick, u.email, r.nombre as rol, p.idproyecto from usuarios u, proyectos p, roles r where u.idusuario = r.idusuario and p.idproyecto = r.idproyecto';
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

ControllerProyectos.crearProyecto = function(data) {
  return new Promise(function(resolve, reject) {
    var sql = 'insert into proyectos(nombre,descripcion) values(?, ?)';
    connection.query(sql, [data.nombre, data.descripcion], function(err, result) {
      if (err) {
        /* connection.end(function(err) {
          console.log('Error DB');
        }); */
        reject('Ya existe un proyecto con ese nombre');
        //throw err;
      } else {
        console.log('insertado proyecto');

        var sql = 'select idproyecto from proyectos where nombre = ?';
        connection.query(sql, [data.nombre], function(err, result) {
          if (err) {
            /* connection.end(function(err) {
              console.log('Error DB');
            }); */
            reject('Error al buscar el proyecto');
            //throw err;
          } else {
            console.log('idproyecto', result);
            var idProyecto = result[0].idproyecto;

            var sql =
              'insert into roles(nombre,idusuario,idproyecto, ordenar, editarPBI,estimarTam,estimarValor, mantenerUsuarios, archivarProyecto, setDone, proyecciones)' +
              ' values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            connection.query(sql, ['productOwner', data.idusuario, idProyecto, 1, 1, 0, 1, 1, 1, 1, 1], function(
              err,
              result
            ) {
              if (err) {
                /* connection.end(function(err) {
                  console.log('Error DB');
                }); */
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

ControllerProyectos.proyectoAgregarUsuario = function(idProyecto, data) {
  return new Promise(function(resolve, reject) {
    var sql =
      'insert into roles(nombre,idusuario,idproyecto, ordenar, editarPBI,estimarTam,estimarValor, mantenerUsuarios, archivarProyecto, setDone, proyecciones)' +
      ' values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    if (data.rol == 'productOwner') {
      var list = ['productOwner', data.idusuario, idProyecto, 1, 1, 0, 1, 1, 1, 1, 1];
    } else if (data.rol == 'desarrollador') {
      var list = ['desarrollador', data.idusuario, idProyecto, 0, 1, 1, 0, 0, 0, 1, 0];
    } else {
      var list = ['stakeholder', data.idusuario, idProyecto, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    connection.query(sql, list, function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado' });
      } else {
        console.log('insertado rol');
        resolve(result);
      }
    });
  });
};

ControllerProyectos.proyectoInvitarUsuario = function(idproyecto, data) {
  return new Promise(function(resolve, reject) {
    var sql = 'select * from usuarios where email=?';
    arr = [data.email];
    connection.query(sql, arr, function(err, result) {
      if (err) {
        reject({ error: 'Error al buscar el email' });
      } else {
        console.log(result);
        if (result.length > 0) {
          /* existe el usuario --> agregar al proyecto */
          /* var inviData = { rol: 'desarrollador', idusuario: result[0].idusuario }; */
          var inviData = { rol: data.rol, idusuario: result[0].idusuario };
          ControllerProyectos.proyectoAgregarUsuario(idproyecto, inviData).then(data => {
            resolve({ existe: true });
          });
        } else {
          /* no existe el usuario --> crear invitacion */
          var tokenUrl = jwt.sign({ idproyecto: idproyecto, email: data.email, rol: data.rol }, jwtKey);
          console.log(tokenUrl);
          controllerInvitaciones
            .crearInvitacion({ token: tokenUrl, rol: data.rol, idproyecto: idproyecto, email: data.email })
            .then(res => {
              console.log(res);
              enviarInvitacion(data.email, tokenUrl);
              resolve({ existe: false });
            })
            .catch(err => console.log(err));
        }
      }
    });
  });
};

ControllerProyectos.getProyectoPBIs = function(id) {
  return new Promise(function(resolve, reject) {
    var sql = 'select p.* from pbis p, proyectos pr where pr.idproyecto=p.idproyecto and p.idproyecto = ?';
    connection.query(sql, [id], function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado' });
      } else {
        console.log(result);
        resolve(result);
      }
    });
  });
};

module.exports = ControllerProyectos;
