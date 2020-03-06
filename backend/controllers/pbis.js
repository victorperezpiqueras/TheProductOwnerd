var ControllerPbis = {};
var connection = require('../db/connection');

ControllerPbis.crearPbi = function(pbi) {
  return new Promise(function(resolve, reject) {
    var sql =
      'insert into pbis(titulo,descripcion ,done,label ,estimacion, valor ,idproyecto ,prioridad) values ' +
      '(?,?,?,?,?,?,?,?)';
    var array = [
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
  return new Promise(function(resolve, reject) {
    var sql = 'update pbis set titulo=?,descripcion=?,done=?,label=?,estimacion=?, valor=?,prioridad=? where idpbi=?';
    var array = [pbi.titulo, pbi.descripcion, pbi.done, pbi.label, pbi.estimacion, pbi.valor, pbi.prioridad, id];
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
    console.log(pbi);
    var promises = [];
    for (var pbi of pbis) {
      var promise = new Promise(function(resolve, reject) {
        var sql = 'update pbis set prioridad=? where idpbi=?';
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
      resolve(pbis);
    });
  });
};

module.exports = ControllerPbis;
