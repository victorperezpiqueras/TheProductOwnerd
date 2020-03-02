var ControllerPbis = {};
var connection = require('../db/connection');

ControllerPbis.crearPbi = function(pbi) {
  return new Promise(function(resolve, reject) {
    var sql =
      'insert into pbis(titulo,descripcion ,done,label ,estimacion ,idproyecto ,prioridad) values ' + '(?,?,?,?,?,?,?)';
    var array = [pbi.titulo, pbi.descripcion, pbi.done, pbi.label, pbi.estimacion, pbi.idproyecto, pbi.prioridad];
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
    var sql = 'update pbis set titulo=?,descripcion=?,done=?,label=?,estimacion=?,prioridad=? where idpbi=?';
    var array = [pbi.titulo, pbi.descripcion, pbi.done, pbi.label, pbi.estimacion, pbi.prioridad, id];
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

module.exports = ControllerPbis;
