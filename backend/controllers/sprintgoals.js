var ControllerSprintGoals = {};
const connection = require('../db/connection');

/**
 * Crea un sprintgoal
 * @param sprintGoal datos del sprintgoal: idproyecto, goal, sprintNumber
 */
ControllerSprintGoals.crearSprintGoal = function(sprintGoal) {
  return new Promise(async function(resolve, reject) {
    const sql = 'insert into sprintgoals(idproyecto, goal, sprintNumber) values ' + '(?,?,?)';
    const array = [sprintGoal.idproyecto, sprintGoal.goal, sprintGoal.sprintNumber];
    try {
      let insertion = await connection.query(sql, array);
      resolve(insertion[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en crearSprintGoal' });
    }
  });
};

/**
 * Actualiza el goal de un sprintgoal
 * @param sprintGoal datos del sprintgoal: idproyecto, goal, sprintNumber
 */
ControllerSprintGoals.actualizarSprintGoal = function(sprintGoal) {
  return new Promise(async function(resolve, reject) {
    const sql = 'update sprintgoals set goal=? where idproyecto=? and sprintNumber=?';
    const array = [sprintGoal.goal, sprintGoal.idproyecto, sprintGoal.sprintNumber];
    try {
      let update = await connection.query(sql, array);
      resolve(update[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en actualizarSprintGoal' });
    }
  });
};

module.exports = ControllerSprintGoals;
