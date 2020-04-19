var ControllerCriterios = {};
const connection = require('../db/connection');

/**
 * Crea un criterio
 * @param criterio contiene los datos del criterio: nombre, idpbi, done
 */
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

/**
 * Actualiza un criterio
 * @param id id del criterio a actualizar
 * @param criterio contiene los nuevos datos del criterio: nombre, done
 */
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

/**
 * Borra un criterio
 * @param id id del criterio a borrar
 */
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

/**
 * Obtiene los criterios de un pbi
 * @param idpbi id del pbi
 * @returns [ {idcriterio, nombre, done, idpbi} ]
 */
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
