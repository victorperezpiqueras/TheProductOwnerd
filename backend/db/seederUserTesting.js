const controllerInvitaciones = require('../controllers/invitaciones');
const controllerImportancias = require('../controllers/importancias');
const controllerUsuarios = require('../controllers/usuarios');
const controllerPbis = require('../controllers/pbis');
const controllerValores = require('../controllers/valores');
const controllerProyectos = require('../controllers/proyectos');
const controllerReleases = require('../controllers/releases');
const controllerSprintGoals = require('../controllers/sprintgoals');

async function start(usuario, stakeholdersIds, developersIds) {
  try {
    let userId = null;
    let projectId = null;
    let pbisIds = [];

    /* crear usuario */
    data = await controllerUsuarios.registroUsuario(usuario);
    console.log('user created');
    userId = data.insertId;
    console.log('userid:', userId);

    /* crear proyecto */
    let proyecto = { nombre: 'Example project', descripcion: 'Example description', idusuario: userId };
    data = await controllerProyectos.crearProyecto(proyecto);
    console.log('project created');
    projectId = data.insertId;
    console.log('projectid:', projectId);

    /* actualizar proyecto */
    let updatedProyecto = {
      nombre: 'Example project',
      descripcion: 'Example description',
      vision: 'Vision example',
      sprintActual: 5,
      deadline: 7
    };
    data = await controllerProyectos.actualizarProyecto(projectId, updatedProyecto);
    console.log('project updated');

    /* invitar stakeholders */
    let stakeholdersRolesIds = [];
    for (let id of stakeholdersIds) {
      data = await controllerProyectos.proyectoAgregarUsuario(projectId, { idusuario: id, rol: 'stakeholder' });
      stakeholdersRolesIds.push(data.insertId);
      console.log('stakeholder invited');
    }

    /* invitar developers */
    let developersRolesIds = [];
    for (let id of developersIds) {
      data = await controllerProyectos.proyectoAgregarUsuario(projectId, { idusuario: id, rol: 'desarrollador' });
      developersRolesIds.push(data.insertId);
      console.log('developer invited');
    }

    /* invitar roles */
    /* data = await controllerProyectos.proyectoAgregarUsuario(projectId, { idusuario: 13, rol: 'stakeholder' });
        stakeholdersIds.push(data.insertId);
        console.log("user invited")
        data = await controllerProyectos.proyectoAgregarUsuario(projectId, { idusuario: 14, rol: 'stakeholder' });
        stakeholdersIds.push(data.insertId);
        console.log("user invited")
        data = await controllerProyectos.proyectoAgregarUsuario(projectId, { idusuario: 15, rol: 'stakeholder' });
        stakeholdersIds.push(data.insertId);
        console.log("user invited")
        data = await controllerProyectos.proyectoAgregarUsuario(projectId, { idusuario: 16, rol: 'desarrollador' });
        console.log("user invited") */

    /* crear pbis */
    data = await controllerPbis.crearPbi({
      titulo: 'pbi 1',
      descripcion: 'example description',
      done: 0,
      label: 'feature',
      estimacion: 13,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 1
    });
    console.log('pbi created');
    pbisIds.push(data.insertId);
    data = await controllerPbis.crearPbi({
      titulo: 'pbi 2',
      descripcion: 'example description',
      done: 0,
      label: 'feature',
      estimacion: 2,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 1
    });
    console.log('pbi created');
    pbisIds.push(data.insertId);
    data = await controllerPbis.crearPbi({
      titulo: 'pbi 3',
      descripcion: 'example description',
      done: 0,
      label: 'infrastructure',
      estimacion: 3,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 1
    });
    console.log('pbi created');
    pbisIds.push(data.insertId);
    data = await controllerPbis.crearPbi({
      titulo: 'pbi 4',
      descripcion: 'example description',
      done: 0,
      label: 'feature',
      estimacion: 8,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 1
    });
    console.log('pbi created');
    pbisIds.push(data.insertId);
    data = await controllerPbis.crearPbi({
      titulo: 'pbi 5',
      descripcion: 'example description',
      done: 0,
      label: 'bug',
      estimacion: 5,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 2
    });
    console.log('pbi created');
    pbisIds.push(data.insertId);
    data = await controllerPbis.crearPbi({
      titulo: 'pbi 6',
      descripcion: 'example description',
      done: 0,
      label: 'feature',
      estimacion: 2,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 2
    });
    console.log('pbi created');
    pbisIds.push(data.insertId);
    data = await controllerPbis.crearPbi({
      titulo: 'pbi 7',
      descripcion: 'example description',
      done: 0,
      label: 'feature',
      estimacion: 13,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 3
    });
    console.log('pbi created');
    pbisIds.push(data.insertId);
    data = await controllerPbis.crearPbi({
      titulo: 'pbi 8',
      descripcion: 'example description',
      done: 0,
      label: 'feature',
      estimacion: 8,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 3
    });
    console.log('pbi created');
    pbisIds.push(data.insertId);
    data = await controllerPbis.crearPbi({
      titulo: 'pbi 9',
      descripcion: 'example description',
      done: 0,
      label: 'tech-debt',
      estimacion: 3,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 3
    });
    console.log('pbi created');
    pbisIds.push(data.insertId);
    data = await controllerPbis.crearPbi({
      titulo: 'pbi 10',
      descripcion: 'example description',
      done: 0,
      label: 'infrastructure',
      estimacion: 8,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 3
    });
    console.log('pbi created');
    pbisIds.push(data.insertId);
    data = await controllerPbis.crearPbi({
      titulo: 'pbi 11',
      descripcion: 'example description',
      done: 0,
      label: 'feature',
      estimacion: 5,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 3
    });
    console.log('pbi created');
    pbisIds.push(data.insertId);
    data = await controllerPbis.crearPbi({
      titulo: 'pbi 12',
      descripcion: 'example description',
      done: 0,
      label: 'feature',
      estimacion: 8,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 3
    });
    console.log('pbi created');
    pbisIds.push(data.insertId);
    data = await controllerPbis.crearPbi({
      titulo: 'pbi 13',
      descripcion: 'example description',
      done: 0,
      label: 'bug',
      estimacion: 2,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 3
    });
    console.log('pbi created');
    pbisIds.push(data.insertId);
    data = await controllerPbis.crearPbi({
      titulo: 'pbi 14',
      descripcion: 'example description',
      done: 0,
      label: 'infrastructure',
      estimacion: 8,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 1
    });
    console.log('pbi created');
    pbisIds.push(data.insertId);
    data = await controllerPbis.crearPbi({
      titulo: 'pbi 15',
      descripcion: 'example description',
      done: 0,
      label: 'tech-debt',
      estimacion: 13,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 4
    });
    console.log('pbi created');
    pbisIds.push(data.insertId);
    data = await controllerPbis.crearPbi({
      titulo: 'pbi 16',
      descripcion: 'example description',
      done: 0,
      label: 'feature',
      estimacion: 5,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 4
    });
    console.log('pbi created');
    pbisIds.push(data.insertId);
    data = await controllerPbis.crearPbi({
      titulo: 'pbi 17',
      descripcion: 'example description',
      done: 0,
      label: 'feature',
      estimacion: 8,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 4
    });
    console.log('pbi created');
    pbisIds.push(data.insertId);
    data = await controllerPbis.crearPbi({
      titulo: 'pbi 18',
      descripcion: 'example description',
      done: 0,
      label: 'bug',
      estimacion: 1,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 4
    });
    console.log('pbi created');
    pbisIds.push(data.insertId);
    data = await controllerPbis.crearPbi({
      titulo: 'pbi 19',
      descripcion: 'example description',
      done: 0,
      label: 'feature',
      estimacion: 5,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 4
    });
    console.log('pbi created');
    pbisIds.push(data.insertId);
    data = await controllerPbis.crearPbi({
      titulo: 'pbi 20',
      descripcion: 'example description',
      done: 0,
      label: 'feature',
      estimacion: 13,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 4
    });
    console.log('pbi created');
    pbisIds.push(data.insertId);
    data = await controllerPbis.crearPbi({
      titulo: 'pbi 21',
      descripcion: 'example description',
      done: 0,
      label: 'feature',
      estimacion: 13,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 4
    });
    console.log('pbi created');
    pbisIds.push(data.insertId);
    data = await controllerPbis.crearPbi({
      titulo: 'pbi 22',
      descripcion: 'example description',
      done: 0,
      label: 'feature',
      estimacion: 13,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 4
    });
    console.log('pbi created');
    pbisIds.push(data.insertId);

    /* crear release */
    let release = { version: 'v1.0', descripcion: 'example release description', sprint: 5, idproyecto: projectId };
    data = await controllerReleases.crearRelease(release);
    releaseId = data.insertId;
    console.log('release created', releaseId);

    editPbis = [];
    /* editar pbis para asignar release y sprint finalizacion */
    data = await controllerPbis.editarPbi(pbisIds[0], {
      titulo: 'pbi 1',
      descripcion: 'example description',
      done: 1,
      label: 'feature',
      estimacion: 13,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 1,
      sprint: 1,
      idrelease: releaseId
    });
    console.log('pbi edited');
    data = await controllerPbis.editarPbi(pbisIds[1], {
      titulo: 'pbi 2',
      descripcion: 'example description',
      done: 1,
      label: 'feature',
      estimacion: 21,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 1,
      sprint: 1,
      idrelease: releaseId
    });
    console.log('pbi edited');
    data = await controllerPbis.editarPbi(pbisIds[2], {
      titulo: 'pbi 3',
      descripcion: 'example description',
      done: 1,
      label: 'infrastructure',
      estimacion: 21,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 1,
      sprint: 1,
      idrelease: releaseId
    });
    console.log('pbi edited');
    data = await controllerPbis.editarPbi(pbisIds[3], {
      titulo: 'pbi 4',
      descripcion: 'example description',
      done: 1,
      label: 'tech-debt',
      estimacion: 13,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 1,
      sprint: 2,
      idrelease: releaseId
    });
    console.log('pbi edited');
    data = await controllerPbis.editarPbi(pbisIds[4], {
      titulo: 'pbi 5',
      descripcion: 'example description',
      done: 1,
      label: 'feature',
      estimacion: 21,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 2,
      sprint: 2,
      idrelease: releaseId
    });
    console.log('pbi edited');
    data = await controllerPbis.editarPbi(pbisIds[5], {
      titulo: 'pbi 6',
      descripcion: 'example description',
      done: 1,
      label: 'feature',
      estimacion: 5,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 2,
      sprint: 2,
      idrelease: releaseId
    });
    console.log('pbi edited');
    data = await controllerPbis.editarPbi(pbisIds[6], {
      titulo: 'pbi 7',
      descripcion: 'example description',
      done: 1,
      label: 'feature',
      estimacion: 13,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 2,
      sprint: 3,
      idrelease: releaseId
    });
    console.log('pbi edited');
    editPbis.push(pbisIds[6]);
    data = await controllerPbis.editarPbi(pbisIds[7], {
      titulo: 'pbi 8',
      descripcion: 'example description',
      done: 1,
      label: 'feature',
      estimacion: 8,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 2,
      sprint: 3,
      idrelease: releaseId
    });
    console.log('pbi edited');
    data = await controllerPbis.editarPbi(pbisIds[8], {
      titulo: 'pbi 9',
      descripcion: 'example description',
      done: 1,
      label: 'feature',
      estimacion: 8,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 2,
      sprint: 3,
      idrelease: releaseId
    });
    console.log('pbi edited');
    data = await controllerPbis.editarPbi(pbisIds[9], {
      titulo: 'pbi 10',
      descripcion: 'example description',
      done: 1,
      label: 'feature',
      estimacion: 8,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 3,
      sprint: 4,
      idrelease: releaseId
    });
    console.log('pbi edited');
    data = await controllerPbis.editarPbi(pbisIds[10], {
      titulo: 'pbi 11',
      descripcion: 'example description',
      done: 1,
      label: 'feature',
      estimacion: 13,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 1,
      sprint: 4,
      idrelease: releaseId
    });
    console.log('pbi edited');
    data = await controllerPbis.editarPbi(pbisIds[11], {
      titulo: 'pbi 12',
      descripcion: 'example description',
      done: 1,
      label: 'feature',
      estimacion: 8,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 3,
      sprint: 4,
      idrelease: releaseId
    });
    console.log('pbi edited');
    data = await controllerPbis.editarPbi(pbisIds[12], {
      titulo: 'pbi 13',
      descripcion: 'example description',
      done: 0,
      label: 'bug',
      estimacion: 2,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 3,
      sprint: null,
      idrelease: null
    });
    console.log('pbi edited');
    editPbis.push(pbisIds[12]);
    data = await controllerPbis.editarPbi(pbisIds[13], {
      titulo: 'pbi 14',
      descripcion: 'example description',
      done: 0,
      label: 'infrastructure',
      estimacion: 8,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 1,
      sprint: null,
      idrelease: null
    });
    console.log('pbi edited');
    editPbis.push(pbisIds[13]);
    data = await controllerPbis.editarPbi(pbisIds[14], {
      titulo: 'pbi 15',
      descripcion: 'example description',
      done: 0,
      label: 'tech-debt',
      estimacion: 13,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 4,
      sprint: null,
      idrelease: null
    });
    console.log('pbi edited');
    editPbis.push(pbisIds[14]);
    data = await controllerPbis.editarPbi(pbisIds[15], {
      titulo: 'pbi 16',
      descripcion: 'example description',
      done: 0,
      label: 'feature',
      estimacion: 5,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 4,
      sprint: null,
      idrelease: null
    });
    console.log('pbi edited');
    editPbis.push(pbisIds[15]);
    data = await controllerPbis.editarPbi(pbisIds[16], {
      titulo: 'pbi 17',
      descripcion: 'example description',
      done: 0,
      label: 'feature',
      estimacion: 8,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 4,
      sprint: null,
      idrelease: null
    });
    console.log('pbi edited');
    editPbis.push(pbisIds[16]);
    data = await controllerPbis.editarPbi(pbisIds[17], {
      titulo: 'pbi 18',
      descripcion: 'example description',
      done: 0,
      label: 'bug',
      estimacion: 1,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 4,
      sprint: null,
      idrelease: null
    });
    console.log('pbi edited');
    editPbis.push(pbisIds[17]);
    data = await controllerPbis.editarPbi(pbisIds[18], {
      titulo: 'pbi 19',
      descripcion: 'example description',
      done: 0,
      label: 'feature',
      estimacion: 5,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 4,
      sprint: null,
      idrelease: null
    });
    console.log('pbi edited');
    editPbis.push(pbisIds[18]);
    data = await controllerPbis.editarPbi(pbisIds[19], {
      ///////////2
      titulo: 'pbi 20',
      descripcion: 'example description',
      done: 0,
      label: 'feature',
      estimacion: 13,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 4,
      sprint: null,
      idrelease: null
    });
    console.log('pbi edited');
    editPbis.push(pbisIds[19]);
    data = await controllerPbis.editarPbi(pbisIds[20], {
      titulo: 'pbi 21',
      descripcion: 'example description',
      done: 0,
      label: 'tech-debt',
      estimacion: 8,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 5,
      sprint: null,
      idrelease: null
    });
    console.log('pbi edited');
    editPbis.push(pbisIds[20]);
    data = await controllerPbis.editarPbi(pbisIds[21], {
      titulo: 'pbi 22',
      descripcion: 'example description',
      done: 0,
      label: 'feature',
      estimacion: 13,
      valor: null,
      idproyecto: projectId,
      prioridad: 0,
      sprintCreacion: 5,
      sprint: null,
      idrelease: null
    });
    console.log('pbi edited');
    editPbis.push(pbisIds[21]);

    /* asignar valores de stakeholder a pbis */
    let valores = [
      /* [5, 3, 0, 1, 2, 0, 2, 0, 2, 5, 5],
            [4, 5, 5, 5, 5, 5, 5, 1, 4, 1, 1],
            [2, 1, 2, 2, 3, 3, 4, 3, 4, 2, 1] */
      [5, 4, 5, 3, 3, 3, 3, 1, 2, 1, 2],
      [1, 2, 2, 5, 4, 5, 4, 3, 1, 3, 3],
      [2, 1, 1, 5, 4, 5, 5, 4, 3, 4, 3]
    ]; //14

    console.log(stakeholdersRolesIds);
    console.log(editPbis.length);
    for (let i = 0; i < stakeholdersRolesIds.length; i++) {
      for (let j = 0; j < editPbis.length; j++) {
        valor = {
          valor: valores[i][j],
          idpbi: editPbis[j],
          idrol: stakeholdersRolesIds[i]
        };
        console.log('valor creado', valor);
        data = await controllerValores.crearValor(valor);
      }
    }

    /* crear sprint goals */
    for (let i = 1; i <= 8; i++) {
      goal = { idproyecto: projectId, goal: 'example sprint goal ' + i.toString(), sprintNumber: i };
      data = await controllerSprintGoals.crearSprintGoal(goal);
      console.log('sprintgoal creado', goal);
    }

    console.log('end of script');
  } catch (e) {
    console.log('Catch an error: ', e);
  }
}

async function main() {
  let num_participantes = 10;
  let stakeholders = [
    {
      nick: 'paco',
      nombre: 'paco',
      apellido1: 'paco',
      apellido2: 'paco',
      password: 'password',
      email: 'paco@paco.com'
    },
    {
      nick: 'pepe',
      nombre: 'pepe',
      apellido1: 'pepe',
      apellido2: 'pepe',
      password: 'password',
      email: 'pepe@pepe.com'
    },
    {
      nick: 'jose',
      nombre: 'jose',
      apellido1: 'jose',
      apellido2: 'jose',
      password: 'password',
      email: 'jose@jose.com'
    }
  ];

  let developers = [
    {
      nick: 'developer1',
      nombre: 'developer1',
      apellido1: 'developer1',
      apellido2: 'developer1',
      password: 'password',
      email: 'developer1@developer1.com'
    },
    {
      nick: 'developer2',
      nombre: 'developer2',
      apellido1: 'developer2',
      apellido2: 'developer2',
      password: 'password',
      email: 'developer2@developer2.com'
    },
    {
      nick: 'developer3',
      nombre: 'developer3',
      apellido1: 'developer3',
      apellido2: 'developer3',
      password: 'password',
      email: 'developer3@developer3.com'
    },
    {
      nick: 'developer4',
      nombre: 'developer4',
      apellido1: 'developer4',
      apellido2: 'developer4',
      password: 'password',
      email: 'developer4@developer4.com'
    }
  ];
  stakeholdersIds = [];
  /* crear stakeholders */
  for (st of stakeholders) {
    data = await controllerUsuarios.registroUsuario(st);
    console.log('stakeholder created');
    stakeholdersIds.push(data.insertId);
    console.log('stakeholderid:', data.insertId);
  }

  /* crear developers */
  developersIds = [];
  for (dev of developers) {
    data = await controllerUsuarios.registroUsuario(dev);
    console.log('developer created');
    developersIds.push(data.insertId);
    console.log('developerid:', data.insertId);
  }

  let usuarioNick = 'testing_user';
  for (let i = 1; i <= num_participantes; i++) {
    let usuario = {
      nick: usuarioNick + i,
      nombre: usuarioNick + i,
      apellido1: usuarioNick + i,
      apellido2: usuarioNick + i,
      password: 'password',
      email: usuarioNick + i + '@' + usuarioNick + i + '.com'
    };
    console.log('creating user testing_user' + i + ' data');
    await start(usuario, stakeholdersIds, developersIds);
  }
}

main();
