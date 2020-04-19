var ControllerComentarios = {};
const connection = require('../db/connection');

/**
 * Crea un comentario
 * @param comentario contiene los datos del comentario: comentario, idpbi, idusuario, fecha
 */
ControllerComentarios.crearComentario = function(comentario) {
  return new Promise(function(resolve, reject) {
    const sql = 'insert into comentarios(comentario,idpbi, idusuario,fecha) values ' + '(?,?,?,?)';
    const array = [comentario.comentario, comentario.idpbi, comentario.idusuario, new Date(comentario.fecha)];
    connection.query(sql, array, function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado en crearComentario' });
      } else {
        console.log(result);
        resolve(result);
      }
    });
  });
};

/**
 * Obtiene los comentarios de un pbi
 * @param idpbi id del pbi
 * @returns [ {idcomentario, comentario, fecha, idpbi, idusuario, nick} ]
 */
ControllerComentarios.obtenerComentariosPbi = function(idpbi) {
  return new Promise(function(resolve, reject) {
    const sql = 'select c.*, u.nick from comentarios c, usuarios u  where c.idpbi=? and c.idusuario=u.idusuario';
    const array = [idpbi];
    connection.query(sql, array, function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado en obtenerComentariosPbi' });
      } else {
        console.log(result);
        resolve(result);
      }
    });
  });
};

module.exports = ControllerComentarios;
