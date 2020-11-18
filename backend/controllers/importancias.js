var ControllerImportancias = {};
const connection = require('../db/connection');

/**
 * Crea una importancia
 * @param importancias contiene los datos del archivo: valor, idpbi, idrol
 */
ControllerImportancias.crearImportancia = function(importancia) {
  return new Promise(async function(resolve, reject) {
    const sql = 'insert into importancias(valor,idpbi,idrol) values ' + '(?,?,?)';
    const array = [importancia.valor, importancia.idpbi, importancia.idrol];
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
 * @param importancias contiene los datos del archivo: valor, idpbi, idrol
 */
ControllerImportancias.editarImportancia = function(idimportancia, importancia) {
  return new Promise(async function(resolve, reject) {
    const sql = 'update importancias set valor=? where idimportancia=?';
    const array = [importancia.valor, idimportancia];
    try {
      let insertion = await connection.query(sql, array);
      resolve(insertion[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en editarImportancia' });
    }
  });
};

/**
 * Obtiene los archivos de un pbi
 * @param {number} idpbi id del pbi
 * @returns [ {valor, idpbi, idrol} ]
 */
ControllerImportancias.obtenerImportanciasPbi = function(idpbi) {
  return new Promise(async function(resolve, reject) {
    const sql = 'select * from importancias where idpbi=?';
    const array = [idpbi];
    try {
      let importancias = await connection.query(sql, array);
      resolve(importancias[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en obtenerImportanciasPbi' });
    }
  });
};

module.exports = ControllerImportancias;
