var ControllerCriterios = {};
const connection = require('../db/connection');
module.exports = ControllerCriterios;

/**
 * Crea un criterio
 * @param criterio contiene los datos del criterio: nombre, idpbi, done
 */
ControllerCriterios.crearCriterio = function(criterio) {
  return new Promise(async function(resolve, reject) {
    const sql = 'insert into criterios(nombre, idpbi, done) values ' + '(?,?,?)';
    const array = [criterio.nombre, criterio.idpbi, criterio.done];
    try {
      let insertion = await connection.query(sql, array);
      resolve(insertion[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en crearCriterio' });
    }
  });
};

/**
 * Actualiza un criterio
 * @param {number} idcriterio id del criterio a actualizar
 * @param criterio contiene los nuevos datos del criterio: nombre, done
 */
ControllerCriterios.actualizarCriterio = function(idcriterio, criterio) {
  return new Promise(async function(resolve, reject) {
    const sql = 'update criterios set nombre=?,done=? where idcriterio=?';
    const array = [criterio.nombre, criterio.done, idcriterio];
    try {
      let update = await connection.query(sql, array);
      resolve(update[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en actualizarCriterio' });
    }
  });
};

/**
 * Borra un criterio
 * @param {number} idcriterio id del criterio a borrar
 */
ControllerCriterios.borrarCriterio = function(idcriterio) {
  return new Promise(async function(resolve, reject) {
    const sql = 'delete from criterios where idcriterio=?';
    const array = [idcriterio];
    try {
      let deletion = await connection.query(sql, array);
      resolve(deletion[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en borrarCriterio' });
    }
  });
};

/**
 * Obtiene los criterios de un pbi
 * @param {number} idpbi id del pbi
 * @returns [ {idcriterio, nombre, done, idpbi} ]
 */
ControllerCriterios.obtenerCriteriosPbi = function(idpbi) {
  return new Promise(async function(resolve, reject) {
    const sql = 'select * from criterios where idpbi=?';
    const array = [idpbi];
    try {
      let criterios = await connection.query(sql, array);
      resolve(criterios[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en obtenerCriteriosPbi' });
    }
  });
};
