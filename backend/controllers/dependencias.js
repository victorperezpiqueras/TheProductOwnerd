var ControllerDependencias = {};
var connection = require('../db/connection');

ControllerDependencias.crearDependencia = function(dependencia) {
  return new Promise(function(resolve, reject) {
    var sql = 'insert into dependencias(idpbi, idpbi2) values ' + '(?,?)';
    var array = [dependencia.idpbi, dependencia.idpbi2];
    connection.query(sql, array, function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado en crearDependencia' });
      } else {
        console.log(result);
        resolve(result);
      }
    });
  });
};
ControllerDependencias.borrarDependencia = function(id, id2) {
  return new Promise(function(resolve, reject) {
    var sql = 'delete from dependencias where idpbi=? and idpbi2=?';
    var array = [id, id2];
    connection.query(sql, array, function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado en borrarDependencia' });
      } else {
        console.log(result);
        resolve(result);
      }
    });
  });
};
ControllerDependencias.obtenerDependenciasPbi = function(idpbi) {
  return new Promise(function(resolve, reject) {
    var sql = 'select * from dependencias where idpbi=?';
    var array = [idpbi];
    connection.query(sql, array, function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado en obtenerDependenciasPbi' });
      } else {
        console.log(result);
        resolve(result);
      }
    });
  });
};

module.exports = ControllerDependencias;
