var ControllerSprintGoals = {};
const connection = require('../db/connection');

ControllerSprintGoals.crearSprintGoal = function(sprintGoal) {
  return new Promise(function(resolve, reject) {
    const sql = 'insert into sprintgoals(idproyecto, goal, sprintNumber) values ' + '(?,?,?)';
    const array = [sprintGoal.idproyecto, sprintGoal.goal, sprintGoal.sprintNumber];
    connection.query(sql, array, function(err, result) {
      if (err) {
        reject({ error: 'Error inesperado en crearSprintGoal' });
      } else {
        console.log(result);
        resolve(result);
      }
    });
  });
};
ControllerSprintGoals.actualizarSprintGoal = function(sprintGoal) {
  return new Promise(function(resolve, reject) {
    const sql = 'update sprintgoals set goal=? where idproyecto=? and sprintNumber=?';
    const array = [sprintGoal.goal, sprintGoal.idproyecto, sprintGoal.sprintNumber];
    connection.query(sql, array, function(err, result) {
      if (err) {
        console.log(err);
        reject({ error: 'Error inesperado en actualizarSprintGoal' });
      } else {
        console.log(result);
        resolve(result);
      }
    });
  });
};

module.exports = ControllerSprintGoals;
