var ControllerPbis = {};
const connection = require('../db/connection');
module.exports = ControllerPbis;

/**
 * Crea un pbi
 * @param pbi contiene los datos del pbi: titulo, descripcion, done, label, estimacion, valor, idproyecto, prioridad, sprintCreacion
 */
ControllerPbis.crearPbi = function(pbi) {
  return new Promise(async function(resolve, reject) {
    const sql =
      'insert into pbis(titulo,descripcion,done,label,estimacion,valor,idproyecto,prioridad,sprintCreacion) values ' +
      '(?,?,?,?,?,?,?,?,?)';
    const array = [
      pbi.titulo,
      pbi.descripcion,
      pbi.done,
      pbi.label,
      pbi.estimacion,
      pbi.valor,
      pbi.idproyecto,
      pbi.prioridad,
      pbi.sprintCreacion
    ];
    try {
      let insertion = await connection.query(sql, array);
      resolve(insertion[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en crearPbi' });
    }
  });
};

/**
 * Edita un pbi
 * @param {number} idpbi id del pbi a editar
 * @param pbi contiene los datos del pbi: titulo, descripcion, done, label, estimacion, valor, prioridad, sprintCreacion
 */
ControllerPbis.editarPbi = function(idpbi, pbi) {
  return new Promise(async function(resolve, reject) {
    console.log(pbi);
    console.log(pbi.valor);
    if (pbi.sprint == 'null') pbi.sprint = null;
    if (pbi.valor == 'null') pbi.valor = null;
    const sql =
      'update pbis set titulo=?,descripcion=?,done=?,label=?,estimacion=?,valor=?,prioridad=?,sprint=?,sprintCreacion=? where idpbi=?';
    const array = [
      pbi.titulo,
      pbi.descripcion,
      pbi.done,
      pbi.label,
      pbi.estimacion,
      pbi.valor,
      pbi.prioridad,
      pbi.sprint,
      pbi.sprintCreacion,
      idpbi
    ];
    try {
      let update = await connection.query(sql, array);
      resolve(update[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en editarPbi' });
    }
  });
};

/**
 * Edita las prioridades de un pbi
 * @param pbis contiene los datos de los pbis a editar: pbis[]=> prioridad, idpbi
 */
ControllerPbis.editarPrioridadesPbis = function(pbis) {
  return new Promise(async function(resolve, reject) {
    try {
      var responses = [];
      for (let pbi of pbis) {
        var sql = 'update pbis set prioridad=? where idpbi=?';
        var array = [pbi.prioridad, pbi.idpbi];
        let update = await connection.query(sql, array);
        responses.push(update);
      }
      resolve({ response: 'ok' });
      /* resolve(responses); */
    } catch (error) {
      reject({ error: 'Error inesperado en editarPrioridadesPbis' });
    }
  });
};

/**
 * Obtiene los pbis de un proyecto
 * @param {number} idproyecto id del proyecto
 * @returns [ {idpbi, titulo, descripcion, done, label, estimacion, idproyecto, prioridad, valor, sprint, sprintCreacion} ]
 */
ControllerPbis.getProyectoPBIs = function(idproyecto) {
  return new Promise(async function(resolve, reject) {
    const sql = 'select p.* from pbis p, proyectos pr where pr.idproyecto=p.idproyecto and p.idproyecto = ?';
    try {
      const pbis = await connection.query(sql, [idproyecto]);
      resolve(pbis[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en getProyectoPBIs' });
    }
  });
};
