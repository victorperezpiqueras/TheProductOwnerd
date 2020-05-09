var ControllerComentarios = {};
const connection = require('../db/connection');

/**
 * Crea un comentario
 * @param comentario contiene los datos del comentario: comentario, idpbi, idusuario, fecha
 */
ControllerComentarios.crearComentario = function(comentario) {
  return new Promise(async function(resolve, reject) {
    const sql = 'insert into comentarios(comentario,idpbi, idusuario,fecha) values ' + '(?,?,?,?)';
    const array = [comentario.comentario, comentario.idpbi, comentario.idusuario, new Date(comentario.fecha)];
    try {
      let insertion = await connection.query(sql, array);
      resolve(insertion[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en crearComentario' });
    }
  });
};

/**
 * Obtiene los comentarios de un pbi
 * @param {number} idpbi id del pbi
 * @returns [ {idcomentario, comentario, fecha, idpbi, idusuario, nick} ]
 */
ControllerComentarios.obtenerComentariosPbi = function(idpbi) {
  return new Promise(async function(resolve, reject) {
    const sql = 'select c.*, u.nick from comentarios c, usuarios u  where c.idpbi=? and c.idusuario=u.idusuario';
    const array = [idpbi];
    try {
      let comentarios = await connection.query(sql, array);
      resolve(comentarios[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en obtenerComentariosPbi' });
    }
  });
};

module.exports = ControllerComentarios;
