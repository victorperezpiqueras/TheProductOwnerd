var ControllerArchivos = {};
const connection = require('../db/connection');

/**
 * Crea un archivo
 * @param archivo contiene los datos del archivo: nombre, src, idpbi, idusuario
 */
ControllerArchivos.crearArchivo = function(archivo) {
  return new Promise(async function(resolve, reject) {
    const sql = 'insert into archivos(nombre,src,idpbi,idusuario) values ' + '(?,?,?,?)';
    const array = [archivo.nombre, archivo.src, archivo.idpbi, archivo.idusuario];
    try {
      let insertion = await connection.query(sql, array);
      resolve(insertion[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en crearArchivo' });
    }
  });
};

/**
 * Borra un archivo
 * @param {number} idarchivo id del archivo
 */
ControllerArchivos.borrarArchivo = function(idarchivo) {
  return new Promise(async function(resolve, reject) {
    const sql = 'delete from archivos where idarchivo=?';
    const array = [idarchivo];
    try {
      let deletion = await connection.query(sql, array);
      resolve(deletion[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en borrarArchivo' });
    }
  });
};

/**
 * Obtiene los archivos de un pbi
 * @param {number} idpbi id del pbi
 * @returns [ {idarchivo, nombre, src, idpbi, idusuario, nombreUsuario} ]
 */
ControllerArchivos.obtenerArchivosPbi = function(idpbi) {
  return new Promise(async function(resolve, reject) {
    const sql =
      'select a.*, u.nick as nombreUsuario from archivos a, usuarios u  where a.idpbi=? and a.idusuario=u.idusuario';
    const array = [idpbi];
    try {
      let archivos = await connection.query(sql, array);
      resolve(archivos[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en obtenerArchivosPbi' });
    }
  });
};

module.exports = ControllerArchivos;
