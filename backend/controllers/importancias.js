var ControllerImportancias = {};
const connection = require('../db/connection');
module.exports = ControllerImportancias;

/**
 * Crea una importancia
 * @param importancias contiene los datos de la importancia: importancia, idproyecto, idrol
 */
ControllerImportancias.crearImportancia = function(importancia) {
  return new Promise(async function(resolve, reject) {
    const sql = 'insert into importancias(importancia,idproyecto,idrol) values ' + '(?,?,?)';
    const array = [importancia.importancia, importancia.idproyecto, importancia.idrol];
    try {
      let insertion = await connection.query(sql, array);
      resolve(insertion[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en crearImportancia' });
    }
  });
};

/**
 * Edita una importancia
 * @param importancias contiene los datos del archivo: importancia, idproyecto, idrol
 */
ControllerImportancias.editarImportancia = function(idimportancia, importancia) {
  return new Promise(async function(resolve, reject) {
    const sql = 'update importancias set importancia=? where idimportancia=?';
    const array = [importancia.importancia, idimportancia];
    try {
      let insertion = await connection.query(sql, array);
      resolve(insertion[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en editarImportancia' });
    }
  });
};

/**
 * Obtiene las importancias de un proyecto
 * @param {number} idproyecto id del proyecto
 * @returns [ {importancia, idproyecto, idrol} ]
 */
ControllerImportancias.obtenerImportanciasProyecto = function(idproyecto) {
  return new Promise(async function(resolve, reject) {
    const sql = 'select * from importancias where idproyecto=?';
    const array = [idproyecto];
    try {
      let importancias = await connection.query(sql, array);
      resolve(importancias[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en obtenerImportanciasProyecto' });
    }
  });
};
