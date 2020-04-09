var ControllerDependencias = {};
const connection = require('../db/connection');

ControllerDependencias.crearDependencia = function(dependencia) {
  return new Promise(function(resolve, reject) {
    const sql = 'insert into dependencias(idpbi, idpbi2) values ' + '(?,?)';
    const array = [dependencia.idpbi, dependencia.idpbi2];
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
    const sql = 'delete from dependencias where idpbi=? and idpbi2=?';
    const array = [id, id2];
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
    const sql = 'select * from dependencias where idpbi=?';
    const array = [idpbi];
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
