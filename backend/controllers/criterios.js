var ControllerCriterios = {};
var connection = require('../db/connection');

ControllerCriterios.crearCriterio = function(criterio) {
  return new Promise(function(resolve, reject) {
    var sql = 'insert into criterios(nombre, idpbi, done) values ' + '(?,?,?)';
    var array = [criterio.nombre, criterio.idpbi, criterio.done];
    connection.query(sql, array, function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado en crearCriterio' });
      } else {
        console.log(result);
        resolve(result);
      }
    });
  });
};
ControllerCriterios.actualizarCriterio = function(id, criterio) {
  return new Promise(function(resolve, reject) {
    var sql = 'update criterios set nombre=?,done=? where idcriterio=?';
    var array = [criterio.nombre, criterio.done, id];
    connection.query(sql, array, function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado en actualizarCriterio' });
      } else {
        console.log(result);
        resolve(result);
      }
    });
  });
};
ControllerCriterios.borrarCriterio = function(id) {
  return new Promise(function(resolve, reject) {
    var sql = 'delete from criterios where idcriterio=?';
    var array = [id];
    connection.query(sql, array, function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado en borrarCriterio' });
      } else {
        console.log(result);
        resolve(result);
      }
    });
  });
};
ControllerCriterios.obtenerCriteriosPbi = function(idpbi) {
  return new Promise(function(resolve, reject) {
    var sql = 'select * from criterios where idpbi=?';
    var array = [idpbi];
    connection.query(sql, array, function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado en obtenerCriteriosPbi' });
      } else {
        console.log(result);
        resolve(result);
      }
    });
  });
};

module.exports = ControllerCriterios;
