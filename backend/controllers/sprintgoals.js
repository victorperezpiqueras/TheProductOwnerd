var ControllerSprintGoals = {};
const connection = require('../db/connection');
module.exports = ControllerSprintGoals;

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

/**
 * Obtiene los sprintgoals de un proyecto
 * @param {number} idproyecto id del proyecto
 * @returns [ {idproyecto, goal, sprintNumber} ]
 */
ControllerSprintGoals.getProyectoSprintGoals = function(idproyecto) {
  return new Promise(async function(resolve, reject) {
    const sql = 'select * from sprintgoals where idproyecto = ?';
    try {
      const sprintGoals = await connection.query(sql, [idproyecto]);
      resolve(sprintGoals[0]);
    } catch (error) {
      reject({ error: 'Error inesperado en getProyectoSprintGoals' });
    }
  });
};
