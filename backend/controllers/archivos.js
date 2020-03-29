var ControllerArchivos = {};
var connection = require('../db/connection');

ControllerArchivos.crearArchivo = function(archivo) {
  return new Promise(function(resolve, reject) {
    var sql = 'insert into archivos(nombre,src,idpbi,idusuario) values ' + '(?,?,?,?)';
    var array = [archivo.nombre, archivo.src, archivo.idpbi, archivo.idusuario];
    connection.query(sql, array, function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado en crearArchivo' });
      } else {
        console.log(result);
        resolve(result);
      }
    });
  });
};
ControllerArchivos.borrarArchivo = function(id) {
  return new Promise(function(resolve, reject) {
    var sql = 'delete from archivos where idarchivo=?';
    var array = [id];
    connection.query(sql, array, function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado en borrarArchivo' });
      } else {
        console.log(result);
        resolve(result);
      }
    });
  });
};
ControllerArchivos.obtenerArchivosPbi = function(idpbi) {
  return new Promise(function(resolve, reject) {
    var sql =
      'select a.*, u.nick as nombreUsuario from archivos a, usuarios u  where a.idpbi=? and a.idusuario=u.idusuario';
    var array = [idpbi];
    connection.query(sql, array, function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado en obtenerArchivosPbi' });
      } else {
        console.log(result);
        resolve(result);
      }
    });
  });
};

module.exports = ControllerArchivos;
