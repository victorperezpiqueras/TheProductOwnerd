var ControllerDependencias = {};
const connection = require('../db/connection');

/**
 * Crea una dependencia
 * @param dependencia contiene los datos de la dependencia: idpbi, idpbi2
 */
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

/**
 * Borra una dependencia
 * @param id id de la dependencia a borrar
 * @param id2 id de la dependencia 2 a borrar
 */
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

/**
 * Obtiene las dependencias de un pbi
 * @param idpbi id del pbi
 * @returns [ {iddependencia, idpbi, idpbi2} ]
 */
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
