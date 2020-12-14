var ControllerReleases = {};
const connection = require('../db/connection');
module.exports = ControllerReleases;

/**
 * Crea una release
 * @param release contiene los datos de la release: version, descripcion, sprint, idproyecto
 */
ControllerReleases.crearRelease = function(release) {
  console.log(release);
  return new Promise(async function(resolve, reject) {
    const sql = 'insert into releases(version, descripcion, sprint, idproyecto) values ' + '(?,?,?,?)';
    const array = [release.version, release.descripcion, release.sprint, release.idproyecto];
    try {
      let insertion = await connection.query(sql, array);
      resolve(insertion[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en crearRelease' });
    }
  });
};

/**
 * Borra una release
 * @param {number} idrelease id de la release
 */
ControllerReleases.borrarRelease = function(idrelease) {
  return new Promise(async function(resolve, reject) {
    const sql = 'delete from releases where idrelease=?';
    const array = [idrelease];
    try {
      let deletion = await connection.query(sql, array);
      resolve(deletion[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en borrarRelease' });
    }
  });
};

/**
 * Edita una release
 * @param release contiene los datos de la release: version, descripcion, sprint, idproyecto
 */
ControllerReleases.editarRelease = function(idrelease, release) {
  return new Promise(async function(resolve, reject) {
    const sql = 'update releases set version=?, descripcion=?,sprint=? where idrelease=?';
    const array = [release.version, release.descripcion, release.sprint, idrelease];
    try {
      let edit = await connection.query(sql, array);
      resolve(edit[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en editarRelease' });
    }
  });
};

/**
 * Obtiene las releases de un proyecto
 * @param {number} idproyecto id del proyecto
 * @returns [ {idrelease, version, descripcion, sprint, idproyecto} ]
 */
ControllerReleases.getProyectoReleases = function(idproyecto) {
  return new Promise(async function(resolve, reject) {
    const sql = 'select * from releases where idproyecto = ?';
    try {
      const releases = await connection.query(sql, [idproyecto]);
      resolve(releases[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en getProyectoReleases' });
    }
  });
};
