var ControllerCriterios = {};
const connection = require('../db/connection');

ControllerCriterios.crearCriterio = function(criterio) {
  return new Promise(function(resolve, reject) {
    const sql = 'insert into criterios(nombre, idpbi, done) values ' + '(?,?,?)';
    const array = [criterio.nombre, criterio.idpbi, criterio.done];
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
    const sql = 'update criterios set nombre=?,done=? where idcriterio=?';
    const array = [criterio.nombre, criterio.done, id];
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
    const sql = 'delete from criterios where idcriterio=?';
    const array = [id];
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
    const sql = 'select * from criterios where idpbi=?';
    const array = [idpbi];
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
