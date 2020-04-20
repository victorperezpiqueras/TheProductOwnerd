var ControllerCriterios = {};
const connection = require('../db/connection');

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
    /* connection.query(sql, array, function (err, result) {
      if (err) {
        reject({ error: 'Error inesperado en crearCriterio' });
      } else {
        console.log(result);
        resolve(result);
      }
    }); */
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
    /* connection.query(sql, array, function (err, result) {
      if (err) {
        reject({ error: 'Error inesperado en actualizarCriterio' });
      } else {
        console.log(result);
        resolve(result);
      }
    }); */
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
    /* connection.query(sql, array, function (err, result) {
      if (err) {
        reject({ error: 'Error inesperado en borrarCriterio' });
      } else {
        console.log(result);
        resolve(result);
      }
    }); */
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
    /* connection.query(sql, array, function (err, result) {
      if (err) {
        reject({ error: 'Error inesperado en obtenerCriteriosPbi' });
      } else {
        console.log(result);
        resolve(result);
      }
    }); */
  });
};

module.exports = ControllerCriterios;
