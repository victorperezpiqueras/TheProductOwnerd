var ControllerProyectos = {};
const connection = require('../db/connection');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
module.exports = ControllerProyectos;
const controllerInvitaciones = require('../controllers/invitaciones');
const controllerImportancias = require('../controllers/importancias');
const controllerUsuarios = require('../controllers/usuarios');
const controllerPbis = require('../controllers/pbis');
const controllerValores = require('../controllers/valores');

const QueryResponse = require('../helpers/query-response');

/* configurar mailer */
const nodemailer = require('nodemailer');
const fs = require('fs'); //Filesystem
var path = require('path');
const mustache = require('mustache');

/**
 * Envia una invitacion por correo
 * @param data contiene los datos de la invitacion: rol, email, invitadoPor, proyecto
 * @param {string} tokenUrl token de la invitacion
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

  // cargar plantilla y renderizar con variables:
  const content = fs.readFileSync(path.join(__dirname, '../helpers') + '/email-invitation.html', 'utf8');
  const view = {
    from: process.env.MAIL_USER,
    invitadoPor: data.invitadoPor.toUpperCase(),
    proyecto: data.proyecto.toUpperCase(),
    rol: data.rol,
    link: process.env.MAIL_INVITE_LINK + tokenUrl
  };
  const output = mustache.render(content, view);

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: data.email,
    subject: 'You were invited to a project at TheProductOwnerd website!',
    html: output
    /* '<p>You were invited by <b>' +
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
    'Happy Forecasting!' */
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
  return new Promise(async function(resolve, reject) {
    const sql = 'select * from proyectos';
    /* connection.query(sql, function (err, result) {
      if (err) {
        reject({ error: 'Error inesperado' });
      } else {
        console.log(result);
        resolve(result);
      }
    }); */
    try {
      let proyectos = await connection.query(sql);
      console.log(proyectos[0]);
      resolve(proyectos[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en getProyectos' });
    }
  });
};

/**
 * Obtiene un proyecto dado su id
 * @param {number} idproyecto id del proyecto
 * @returns (idproyecto, nombre, descripcion, sprintActual, vision)
 */
ControllerProyectos.getProyecto = function(idproyecto) {
  return new Promise(async function(resolve, reject) {
    const sql = 'select * from proyectos where idproyecto = ?';
    /* connection.query(sql, [idproyecto], function (err, result) {
      if (err) {
        reject({ error: 'Error inesperado en getProyecto' });
      } else {
        console.log(result[0]);
        resolve(result[0]);
      }
    }); */
    try {
      let proyecto = await connection.query(sql, [idproyecto]);
      console.log(proyecto[0][0]);
      resolve(proyecto[0][0]);
    } catch (error) {
      reject({ error: 'Error inesperado en getProyecto' });
    }
  });
};

/**
 * Obtiene los usuarios de un proyecto
 * @param {number} idproyecto id del proyecto
 * @returns [ {idusuario, nombre, email} ]
 */
ControllerProyectos.getProyectoUsuarios = function(idproyecto) {
  return new Promise(async function(resolve, reject) {
    const sql =
      'select u.idusuario, u.nombre, u.email from usuarios u, proyectos p, roles r where p.idproyecto = ? and u.idusuario = r.idusuario and p.idproyecto =r.idproyecto';
    /* connection.query(sql, [idproyecto], function (err, result) {
      if (err) {
        reject({ error: 'Error inesperado' });
      } else {
        console.log(result);
        resolve(result);
      }
    }); */
    try {
      const usuarios = await connection.query(sql, [idproyecto]);
      console.log(usuarios[0]);
      resolve(usuarios[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en getProyectoUsuarios' });
    }
  });
};

/**
 * Obtiene los usuarios y roles de un proyecto y sus importancias si son stakeholders
 * @param {number} idproyecto id del proyecto
 * @returns [ {idusuario, nick, email, rol} ]
 */
ControllerProyectos.getProyectoUsuariosRoles = function(idproyecto) {
  return new Promise(async function(resolve, reject) {
    const sql =
      'select u.idusuario, u.nick, u.email, r.nombre as rol, r.idrol from usuarios u,' +
      'proyectos p, roles r where u.idusuario = r.idusuario and p.idproyecto = r.idproyecto and p.idproyecto = ?';
    try {
      let usuariosRoles = await connection.query(sql, [idproyecto]);
      console.log(usuariosRoles[0]);
      let response = usuariosRoles[0];

      //juntar las importancias con los roles
      let importancias = await controllerImportancias.obtenerImportanciasProyecto(idproyecto);
      response.forEach(usuario => {
        for (var imp of importancias) {
          if (imp.idrol === usuario.idrol) {
            usuario.importancia = imp.importancia;
            usuario.idimportancia = imp.idimportancia;
            break;
          }
        }
      });
      console.log(response);

      resolve(response);
    } catch (error) {
      reject({ error: 'Error inesperado en getProyectoUsuariosRoles' });
    }
  });
};

/**
 * Obtiene todos los usuarios y roles
 */
ControllerProyectos.getProyectosUsuariosRoles = function() {
  return new Promise(async function(resolve, reject) {
    const sql =
      'select u.idusuario, u.nick, u.email, r.nombre as rol, p.idproyecto from usuarios u, proyectos p, roles r where u.idusuario = r.idusuario and p.idproyecto = r.idproyecto';
    try {
      let usuariosRoles = await connection.query(sql);
      console.log(usuariosRoles[0]);
      resolve(usuariosRoles[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en getProyectoUsuariosRoles' });
    }
  });
};

/**
 * Crea un proyecto y asigna el rol productOwner al usuario
 * @param data contiene los datos del proyecto: nombre, descripcion; y del usuario: idusuario
 */
ControllerProyectos.crearProyecto = function(data) {
  return new Promise(async function(resolve, reject) {
    var sql = 'insert into proyectos(nombre,descripcion) values(?, ?)';
    var idProyecto;
    try {
      let insertion = await connection.query(sql, [data.nombre, data.descripcion]);
      console.log(insertion[0]);
      idProyecto = insertion[0].insertId;
    } catch (error) {
      /* reject({ error: 'project_name_exists' }); */
      reject({ error: 'error_creating_project' });
    }
    try {
      console.log('idproyecto', idProyecto);
      var sql =
        'insert into roles(nombre,idusuario,idproyecto, ordenar, editarPBI,estimarTam,estimarValor, mantenerUsuarios, archivarProyecto, setDone, proyecciones, sprintGoals, vision)' +
        ' values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      let insertion = await connection.query(sql, [
        'productOwner',
        /* 'admin', */
        data.idusuario,
        idProyecto,
        1,
        1,
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1
        /* 1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1 */
      ]);
      console.log(insertion[0]);
      resolve(insertion[0]);
    } catch (error) {
      reject({ error: 'Error al insertar los roles' });
    }
  });
};

/**
 * Actualiza los datos de un proyecto
 * @param {number} idproyecto id del proyecto
 * @param proyecto contiene los datos del proyecto: nombre, descripcion, vision, sprintActual
 */
ControllerProyectos.actualizarProyecto = function(idproyecto, proyecto) {
  return new Promise(async function(resolve, reject) {
    console.log(proyecto);
    const sql = 'update proyectos set nombre=?, descripcion=?, vision=?, sprintActual=?, deadline=? where idproyecto=?';
    try {
      let update = await connection.query(sql, [
        proyecto.nombre,
        proyecto.descripcion,
        proyecto.vision,
        proyecto.sprintActual,
        proyecto.deadline,
        idproyecto
      ]);
      console.log(update[0]);
      resolve(update[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en actualizarProyecto' });
    }
  });
};

/**
 * Agrega un usuario a un proyecto con el rol proporcionado
 * @param {number} idproyecto id del proyecto
 * @param data contiene los datos del usuario: idusuario, rol
 */
ControllerProyectos.proyectoAgregarUsuario = function(idproyecto, data) {
  return new Promise(async function(resolve, reject) {
    var sql = 'select * from roles where idusuario=? and idproyecto=?';
    try {
      let roles = await connection.query(sql, [data.idusuario, idproyecto]);
      console.log(roles[0]);
      if (roles[0] && roles[0].length > 0) {
        reject({ error: 'error_already_in_project' });
      }
      var sql =
        'insert into roles(nombre,idusuario,idproyecto, ordenar, editarPBI,estimarTam,estimarValor, mantenerUsuarios, ' +
        'archivarProyecto, setDone, proyecciones, sprintGoals, vision)' +
        ' values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      if (data.rol == 'productOwner') {
        var list = ['productOwner', data.idusuario, idproyecto, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1];
      } else if (data.rol == 'desarrollador') {
        var list = ['desarrollador', data.idusuario, idproyecto, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0];
      } else if (data.rol == 'stakeholder') {
        var list = ['stakeholder', data.idusuario, idproyecto, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0];
      }
      let insertion = await connection.query(sql, list);

      if (data.rol == 'stakeholder') {
        //agregar importancia de stakeholder al proyecto:
        let imp = {
          importancia: 3, // 1-5:3default
          idproyecto: idproyecto,
          idrol: insertion[0].insertId
        };
        await controllerImportancias.crearImportancia(imp);
      }
      resolve(insertion[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en proyectoAgregarUsuario' });
    }
  });
};

/**
 * Elimina un usuario del proyecto
 * @param {number} idproyecto id del proyecto
 * @param {number} idusuario id del usuario
 */
ControllerProyectos.proyectoEliminarUsuario = function(idproyecto, idusuario) {
  return new Promise(async function(resolve, reject) {
    const sql = 'delete from roles where idusuario=? and idproyecto=?';
    try {
      let deletion = await connection.query(sql, [idusuario, idproyecto]);
      console.log('antes controller');
      //eliminar proyecto de los favoritos del usuario
      await controllerUsuarios.eliminarUsuarioProyectosFavoritos(idusuario, idproyecto);
      resolve(deletion);
    } catch (error) {
      reject({ error: error });
    }
  });
};

/**
 * Invita un usuario al proyecto. Si existe lo agrega, si no, genera una invitacion
 * @param {number} idproyecto id del proyecto
 * @param data datos de la invitacion: email, rol, nombreProyecto, invitadoPor
 * @returns {boolean} (boolean) existe
 */
ControllerProyectos.proyectoInvitarUsuario = function(idproyecto, data) {
  return new Promise(async function(resolve, reject) {
    var sql = 'select * from usuarios where email=?';
    var user;
    try {
      user = await connection.query(sql, [data.email]);
    } catch (error) {
      reject({ error: 'email_searching_error' });
    }
    try {
      //si hay usuario:
      if (user[0].length > 0) {
        var idusuario = user[0][0].idusuario;
        var sql = 'select * from roles where idusuario=? and idproyecto=?';
        var userRole = await connection.query(sql, [idusuario, idproyecto]);
        // si ya tiene rol para el proyecto:
        if (userRole[0].length > 0) {
          resolve({ existe: false, team: true });
        }
        // si NO tiene rol OK:
        else {
          const inviData = { rol: data.rol, idusuario: user[0][0].idusuario };
          await ControllerProyectos.proyectoAgregarUsuario(idproyecto, inviData);
          resolve({ existe: true });
        }
      } else {
        // no existe el usuario --> crear invitacion
        const tokenUrl = jwt.sign({ idproyecto: idproyecto, email: data.email, rol: data.rol }, config.jwtKey);
        console.log(tokenUrl);
        await controllerInvitaciones.crearInvitacion({
          token: tokenUrl,
          rol: data.rol,
          idproyecto: idproyecto,
          email: data.email
        });
        enviarInvitacion(
          { email: data.email, proyecto: data.nombreProyecto, rol: data.rol, invitadoPor: data.invitadoPor },
          tokenUrl
        );
        resolve({ existe: false });
      }
    } catch (error) {
      console.log(error);
      reject({ error: 'Error inesperado en proyectoInvitarUsuario' });
    }
  });
};

/**
 * Comprueba si un usuario pertenece a un proyecto
 * @param {number} idproyecto id del proyecto
 * @param {number} idusuario id del usuario
 * @returns boolean
 */
ControllerProyectos.checkProyectoTieneUsuario = async function(idproyecto, idusuario) {
  const sql = 'select * from roles where idproyecto=? and idusuario=?';
  const data = await connection.query(sql, [idproyecto, idusuario]);
  if (data[0].length === 1) return true;
  else return false;
};

/**
 * Obtiene los pbis, valores e importancias de un proyecto
 * @param {number} idproyecto id del proyecto
 * @returns [ stakeholderImportances, pbiValues, pbis ]
 */
ControllerProyectos.getProyectoPbiPonderations = function(idproyecto) {
  return new Promise(async function(resolve, reject) {
    try {
      importancias = await controllerImportancias.obtenerImportanciasProyecto(idproyecto);
      pbis = await controllerPbis.getProyectoPBIsBacklog(idproyecto);
      //console.log(pbis.length)

      valores = [];
      for (pbi of pbis) {
        //console.log(pbi.idpbi)
        val = await controllerValores.obtenerValoresPbi(pbi.idpbi);
        val.forEach(async value => {
          valores.push(value);
        });
      }

      //console.log(valores)

      result = {
        importancias: importancias,
        pbis: pbis,
        valores: valores
      };
      resolve(result);
    } catch {
      reject({ error: 'Error inesperado en getProyectoPbiPonderations' });
    }
  });
};

/**
 * Obtiene los pbis, valores e importancias de un proyecto para una release
 * @param {number} idproyecto id del proyecto
 * @returns [ stakeholderImportances, pbiValues, pbis ]
 */
ControllerProyectos.getProyectoPbiPonderationsRelease = function(idproyecto, idrelease) {
  return new Promise(async function(resolve, reject) {
    try {
      importancias = await controllerImportancias.obtenerImportanciasProyecto(idproyecto);
      pbis = await controllerPbis.getProyectoPBIsBacklogRelease(idproyecto, idrelease);
      //console.log(pbis.length)

      valores = [];
      for (pbi of pbis) {
        //console.log(pbi.idpbi)
        val = await controllerValores.obtenerValoresPbi(pbi.idpbi);
        val.forEach(async value => {
          valores.push(value);
        });
      }

      //console.log(valores)

      result = {
        importancias: importancias,
        pbis: pbis,
        valores: valores
      };
      resolve(result);
    } catch {
      reject({ error: 'Error inesperado en getProyectoPbiPonderations' });
    }
  });
};
