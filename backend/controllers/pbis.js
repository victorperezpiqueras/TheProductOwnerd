var ControllerPbis = {};
const connection = require('../db/connection');

ControllerPbis.crearPbi = function(pbi) {
  return new Promise(function(resolve, reject) {
    const sql =
      'insert into pbis(titulo,descripcion ,done,label ,estimacion, valor ,idproyecto ,prioridad) values ' +
      '(?,?,?,?,?,?,?,?)';
    const array = [
      pbi.titulo,
      pbi.descripcion,
      pbi.done,
      pbi.label,
      pbi.estimacion,
      pbi.valor,
      pbi.idproyecto,
      pbi.prioridad
    ];
    connection.query(sql, array, function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado en editarPbi' });
      } else {
        console.log(result);
        resolve(result);
      }
    });
  });
};
ControllerPbis.editarPbi = function(id, pbi) {
  console.log(pbi);
  console.log(pbi.valor);
  if (pbi.sprint == 'null') pbi.sprint = null;
  if (pbi.valor == 'null') pbi.valor = null;
  return new Promise(function(resolve, reject) {
    const sql =
      'update pbis set titulo=?,descripcion=?,done=?,label=?,estimacion=?,valor=?,prioridad=?,sprint=? where idpbi=?';
    const array = [
      pbi.titulo,
      pbi.descripcion,
      pbi.done,
      pbi.label,
      pbi.estimacion,
      pbi.valor,
      pbi.prioridad,
      pbi.sprint,
      id
    ];
    connection.query(sql, array, function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado en editarPbi' });
      } else {
        console.log(result);
        resolve(result);
      }
    });
  });
};
ControllerPbis.editarPrioridadesPbis = function(pbis) {
  return new Promise(function(resolve, reject) {
    console.log(pbis);
    var promises = [];
    for (let pbi of pbis) {
      var promise = new Promise(function(resolve, reject) {
        const sql = 'update pbis set prioridad=? where idpbi=?';
        var array = [pbi.prioridad, pbi.idpbi];
        connection.query(sql, array, function(err, result) {
          if (err) {
            reject({ error: 'Error inesperado en editarPrioridadesPbis' });
          } else {
            console.log(result);
            resolve(result);
          }
        });
      });
      promises.push(promise);
    }
    Promise.all(promises).then(pbis => {
      console.log(pbis);
      resolve(pbis);
    });
  });
};

module.exports = ControllerPbis;
