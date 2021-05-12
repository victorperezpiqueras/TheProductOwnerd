var ControllerValores = {};
const connection = require('../db/connection');
module.exports = ControllerValores;

/**
 * Crea un valor
 * @param valor contiene los datos del valor: valor, idpbi, idrol
 */
ControllerValores.crearValor = function(valor) {
  return new Promise(async function(resolve, reject) {
    const sql = 'insert into valores(valor,idpbi,idrol) values ' + '(?,?,?)';
    const array = [valor.valor, valor.idpbi, valor.idrol];
    try {
      let insertion = await connection.query(sql, array);
      resolve(insertion[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en crearValor', details: error });
    }
  });
};

/**
 * Edita un valor
 * @param valor contiene los datos del valor: valor, idpbi, idrol
 */
ControllerValores.editarValor = function(idvalor, valor) {
  return new Promise(async function(resolve, reject) {
    const sql = 'update valores set valor=? where idvalor=?';
    const array = [valor.valor, idvalor];
    try {
      let insertion = await connection.query(sql, array);
      resolve(insertion[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en editarValor' });
    }
  });
};

/**
 * Obtiene los valores de un pbi
 * @param {number} idpbi id del pbi
 * @returns [ {valor, idpbi, idrol} ]
 */
ControllerValores.obtenerValoresPbi = function(idpbi) {
  return new Promise(async function(resolve, reject) {
    const sql = 'select * from valores where idpbi=?';
    const array = [idpbi];
    try {
      let valores = await connection.query(sql, array);
      resolve(valores[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en obtenerValoresPbi' });
    }
  });
};
