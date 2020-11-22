var ControllerDependencias = {};
const connection = require('../db/connection');
module.exports = ControllerDependencias;

/**
 * Crea una dependencia
 * @param dependencia contiene los datos de la dependencia: idpbi, idpbi2
 */
ControllerDependencias.crearDependencia = function(dependencia) {
  return new Promise(async function(resolve, reject) {
    const sql = 'insert into dependencias(idpbi, idpbi2) values ' + '(?,?)';
    const array = [dependencia.idpbi, dependencia.idpbi2];
    try {
      let insertion = await connection.query(sql, array);
      resolve(insertion[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en crearDependencia' });
    }
  });
};

/**
 * Borra una dependencia
 * @param {number} id id de la dependencia a borrar
 * @param {number} id2 id de la dependencia 2 a borrar
 */
ControllerDependencias.borrarDependencia = function(id, id2) {
  return new Promise(async function(resolve, reject) {
    const sql = 'delete from dependencias where idpbi=? and idpbi2=?';
    const array = [id, id2];
    try {
      let deletion = await connection.query(sql, array);
      resolve(deletion[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en borrarDependencia' });
    }
  });
};

/**
 * Obtiene las dependencias de un pbi
 * @param {number} idpbi id del pbi
 * @returns [ {iddependencia, idpbi, idpbi2} ]
 */
ControllerDependencias.obtenerDependenciasPbi = function(idpbi) {
  return new Promise(async function(resolve, reject) {
    const sql = 'select * from dependencias where idpbi=?';
    const array = [idpbi];
    try {
      let dependencias = await connection.query(sql, array);
      resolve(dependencias[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en obtenerDependenciasPbi' });
    }
  });
};
