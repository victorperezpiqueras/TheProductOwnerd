const mysql2 = require('mysql2');
const connection = mysql2
  .createPool({
    connectionLimit: 30,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  })
  .promise();

/* generateProject(4444, "proyecto11", 21).then((err) => {
    console.log(err)
}) */

generateAllProjects().then(v => {
  console.log(v);
});

/* generatePBIs(4444).then((v) => {
    console.log(v)
}) */

async function generateAllProjects() {
  var initialId = [4444 /* , 4445, 4446, 4447, 4448 */];
  var nombres = ['proyecto11' /* , "proyecto12", "proyecto13", "proyecto14", "proyecto15" */];
  for (var i = 0; i < 5; i++) {
    await generateProject(initialId[i], nombres[i], 21, initialId[i]);
  }
}

async function generateProject(id, nombre, idusuario, idrol) {
  var sql =
    'insert into proyectos(idproyecto, nombre,descripcion,vision,sprintActual) values' +
    ' (?,?, "descripcion de ejemplo", "vision de ejemplo", 5)';
  try {
    let insertion = await connection.query(sql, [id, nombre]);
    //console.log(insertion[0])
    var idproyecto = insertion[0].insertId;
    console.log(idproyecto);
    var sql =
      'insert into roles(idrol,nombre,idusuario,idproyecto, ordenar, editarPBI,estimarTam,estimarValor, mantenerUsuarios, ' +
      'archivarProyecto, setDone, proyecciones, sprintGoals, vision)' +
      'values(?,"productOwner",?,?,1,1,1,1,1,1,1,1,1,1)';
    insertion = await connection.query(sql, [idrol, idusuario, idproyecto]);

    await generatePBIs(id);
    await generateSprintGoals(id);
  } catch (error) {
    console.log(error);
  }
}

async function generatePBIs(idproyecto) {
  var sql =
    'insert into pbis(titulo,descripcion,done,label,estimacion,idproyecto,prioridad,sprintCreacion, valor, sprint) values ' +
    /* infra */
    '("pbi de ejemplo1", "descripcion de ejemplo", 0,"infrastructure",13,?,1,1,10,1),' +
    '("pbi de ejemplo2", "descripcion de ejemplo", 1,"infrastructure",13,?,1,1,10,1),' +
    '("pbi de ejemplo3", "descripcion de ejemplo", 1,"feature",13,?,1,1,10,1),' +
    '("pbi de ejemplo4", "descripcion de ejemplo", 1,"feature",13,?,1,1,10,1),' +
    '("pbi de ejemplo5", "descripcion de ejemplo", 1,"feature",13,?,1,1,5,2),' +
    '("pbi de ejemplo6", "descripcion de ejemplo", 1,"feature",13,?,1,1,5,2),' +
    '("pbi de ejemplo7", "descripcion de ejemplo", 1,"feature",13,?,1,1,5,2),' +
    '("pbi de ejemplo8", "descripcion de ejemplo", 1,"feature",13,?,1,1,3,3),' +
    '("pbi de ejemplo9", "descripcion de ejemplo", 1,"feature",13,?,1,1,3,3),' +
    '("pbi de ejemplo10", "descripcion de ejemplo", 1,"feature",8,?,1,2,3,4),' +
    '("pbi de ejemplo11", "descripcion de ejemplo", 1,"feature",8,?,1,2,3,4),' +
    '("pbi de ejemplo12", "descripcion de ejemplo", 1,"feature",8,?,1,3,3,4),' +
    '("pbi de ejemplo13", "descripcion de ejemplo", 1,"feature",8,?,1,3,3,4),' +
    '("pbi de ejemplo14", "descripcion de ejemplo", 1,"feature",8,?,1,4,3,4),' +
    '("pbi de ejemplo15", "descripcion de ejemplo", 1,"feature",8,?,1,4,3,4),' +
    /* TECHDEBT */
    '("pbi de ejemplo16", "descripcion de ejemplo", 1,"tech-debt",3,?,1,4,null,4),' +
    '("pbi de ejemplo17", "descripcion de ejemplo", 1,"tech-debt",3,?,1,4,null,5),' +
    '("pbi de ejemplo18", "descripcion de ejemplo", 1,"tech-debt",3,?,1,4,null,5),' +
    '("pbi de ejemplo19", "descripcion de ejemplo", 1,"tech-debt",3,?,1,4,null,5),' +
    '("pbi de ejemplo20", "descripcion de ejemplo", 1,"tech-debt",3,?,1,4,null,5),' +
    /* bugs */
    '("pbi de ejemplo21", "descripcion de ejemplo", 1,"bug",1,?,1,5,null,3),' +
    '("pbi de ejemplo22", "descripcion de ejemplo", 1,"bug",1,?,1,5,null,6),' +
    '("pbi de ejemplo23", "descripcion de ejemplo", 1,"bug",1,?,1,5,null,6),' +
    '("pbi de ejemplo24", "descripcion de ejemplo", 1,"bug",1,?,1,5,null,6),' +
    '("pbi de ejemplo25", "descripcion de ejemplo", 1,"bug",1,?,1,5,null,6),' +
    /* creados nuevos a mitad */
    '("pbi de ejemplo26", "descripcion de ejemplo", 0,"feature",8,?,1,5,3,null),' +
    '("pbi de ejemplo27", "descripcion de ejemplo", 0,"feature",5,?,1,5,3,null),' +
    '("pbi de ejemplo28", "descripcion de ejemplo", 0,"feature",5,?,1,5,3,null),' +
    '("pbi de ejemplo29", "descripcion de ejemplo", 0,"feature",3,?,1,5,3,null),' +
    '("pbi de ejemplo30", "descripcion de ejemplo", 0,"feature",2,?,1,5,3,null),' +
    '("pbi de ejemplo31", "descripcion de ejemplo", 0,"feature",8,?,1,2,3,null),' +
    '("pbi de ejemplo32", "descripcion de ejemplo", 0,"feature",5,?,1,2,3,null),' +
    '("pbi de ejemplo33", "descripcion de ejemplo", 0,"feature",5,?,1,3,3,null),' +
    '("pbi de ejemplo34", "descripcion de ejemplo", 0,"feature",5,?,1,3,3,null),' +
    '("pbi de ejemplo35", "descripcion de ejemplo", 0,"feature",21,?,1,3,3,null),' +
    '("pbi de ejemplo36","descripcion de ejemplo", 0,"feature",21,?,1,5,3,null),' +
    '("PBI PARA CAMBIAR","descripcion de ejemplo", 0,"feature",21,?,1,5,3,null)';

  let insertion = await connection.query(sql, [
    idproyecto,
    idproyecto,
    idproyecto,
    idproyecto,
    idproyecto,
    idproyecto,
    idproyecto,
    idproyecto,
    idproyecto,
    idproyecto,
    idproyecto,
    idproyecto,
    idproyecto,
    idproyecto,
    idproyecto,
    idproyecto,
    idproyecto,
    idproyecto,
    idproyecto,
    idproyecto,
    idproyecto,
    idproyecto,
    idproyecto,
    idproyecto,
    idproyecto,
    idproyecto,
    idproyecto,
    idproyecto,
    idproyecto,
    idproyecto,
    idproyecto,
    idproyecto,
    idproyecto,
    idproyecto,
    idproyecto,
    idproyecto,
    idproyecto
  ]);
  console.log(insertion);
}

async function generateSprintGoals(idproyecto) {
  var sql =
    'insert into sprintgoals(idproyecto,goal,sprintNumber) values ' +
    '(?,"El objetivo del sprint es que por dios y por la virgen no salga ningún error", 5)';

  let insertion = await connection.query(sql, [idproyecto]);
  console.log(insertion);
}

async function seederTest() {
  var sql =
    'insert into proyectos(idproyecto,nombre,descripcion,vision,sprintActual) values' +
    '(5000,proyecto1, descripcion de ejemplo, vision de ejemplo, 5),' +
    '(5001,proyecto2, descripcion de ejemplo, vision de ejemplo, 5),' +
    '5002,(proyecto3, descripcion de ejemplo, vision de ejemplo, 5),' +
    '(5003,proyecto4, descripcion de ejemplo, vision de ejemplo, 5),' +
    '(5004,proyecto5, descripcion de ejemplo, vision de ejemplo, 5)';
  try {
    let insertion = await connection.query(sql);
    var sql =
      'insert into roles(nombre,idusuario,idproyecto, ordenar, editarPBI,estimarTam,estimarValor, mantenerUsuarios, ' +
      'archivarProyecto, setDone, proyecciones, sprintGoals, vision)' +
      'values(productOwner,21,';
  } catch (error) {}
}
/*
seederTest(); */
