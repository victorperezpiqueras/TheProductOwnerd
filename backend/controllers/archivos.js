var ControllerArchivos = {};
const connection = require('../db/connection');

ControllerArchivos.crearArchivo = function(archivo) {
  return new Promise(function(resolve, reject) {
    const sql = 'insert into archivos(nombre,src,idpbi,idusuario) values ' + '(?,?,?,?)';
    const array = [archivo.nombre, archivo.src, archivo.idpbi, archivo.idusuario];
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
    const sql = 'delete from archivos where idarchivo=?';
    const array = [id];
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
    const sql =
      'select a.*, u.nick as nombreUsuario from archivos a, usuarios u  where a.idpbi=? and a.idusuario=u.idusuario';
    const array = [idpbi];
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
