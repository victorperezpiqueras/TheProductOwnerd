const express = require('express');
const router = express.Router();

const apiUsuarios = require('./usuarios');
const apiProyectos = require('./proyectos');
const apiPbis = require('./pbis');
const apiComentarios = require('./comentarios');
const apiArchivos = require('./archivos');
const apiCriterios = require('./criterios');
const apiDependencias = require('./dependencias');
const apiInvitaciones = require('./invitaciones');
const apiSprintGoals = require('./sprintgoals');
const apiValores = require('./valores');
const apiImportancias = require('./importancias');
const apiReleases = require('./releases');

/* USUARIOS */
router.use('/usuarios', apiUsuarios);

/* PROYECTOS */
router.use('/proyectos', apiProyectos);

/* PBIS */
router.use('/pbis', apiPbis);

/* COMENTARIOS */
router.use('/comentarios', apiComentarios);

/* ARCHIVOS */
router.use('/archivos', apiArchivos);

/* CRITERIOS */
router.use('/criterios', apiCriterios);

/* DEPENDENCIAS */
router.use('/dependencias', apiDependencias);

/* INVITACIONES */
router.use('/invitaciones', apiInvitaciones);

/* SPRINTGOALS */
router.use('/sprintgoals', apiSprintGoals);

/* VALORES */
router.use('/valores', apiValores);

/* IMPORTANCIAS */
router.use('/importancias', apiImportancias);

/* RELEASES */
router.use('/releases', apiReleases);

module.exports = router;
