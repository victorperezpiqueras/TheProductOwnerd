const express = require('express');
const router = express.Router();
const controllerSprintGoals = require('../controllers/sprintgoals');
const verifyToken = require('../middlewares/verify-token');
const { ErrorHandler } = require('../helpers/error');
const { propertyChecker } = require('../helpers/propertyChecker');

router.post('/', verifyToken, function(req, res, next) {
  console.log('crearSprintGoal');
  if (!propertyChecker(req.body, ['idproyecto', 'goal', 'sprintNumber']))
    throw new ErrorHandler(422, 'Missing required fields: idproyecto, goal, sprintNumber');
  controllerSprintGoals
    .crearSprintGoal(req.body)
    .then(function(sprintGoal) {
      res.json(sprintGoal);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.put('/', verifyToken, function(req, res, next) {
  console.log('actualizarSprintGoal');
  if (!propertyChecker(req.body, ['idproyecto', 'goal', 'sprintNumber']))
    throw new ErrorHandler(422, 'Missing required fields: idproyecto, goal, sprintNumber');
  controllerSprintGoals
    .actualizarSprintGoal(req.body)
    .then(function(sprintGoal) {
      res.json(sprintGoal);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

module.exports = router;
