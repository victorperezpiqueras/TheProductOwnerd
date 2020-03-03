var ControllerComentarios = {};
var connection = require('../db/connection');

ControllerComentarios.crearComentario = function(comentario) {
  return new Promise(function(resolve, reject) {
    var sql = 'insert into comentarios(comentario,idpbi, idusuario,fecha) values ' + '(?,?,?,?)';
    var array = [comentario.comentario, comentario.idpbi, comentario.idusuario, new Date(comentario.fecha)];
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
ControllerComentarios.obtenerComentariosPbi = function(idpbi) {
  return new Promise(function(resolve, reject) {
    var sql = 'select c.*, u.nombre from comentarios c, usuarios u  where c.idpbi=? and c.idusuario=u.idusuario';
    var array = [idpbi];
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
