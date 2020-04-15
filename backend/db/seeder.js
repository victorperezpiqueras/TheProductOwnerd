var connection = require('./connection');

connection.connect(function(err) {
  if (err) throw err;
  console.log('Conectado a MYSQL');
  connection.query(
    'CREATE TABLE usuarios (idusuario INT AUTO_INCREMENT PRIMARY KEY,nombre VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL,' +
      ' email VARCHAR(255) NOT NULL, nick VARCHAR(255) NOT NULL,apellido1 VARCHAR(255) NOT NULL, apellido2 VARCHAR(255) NOT NULL )',
    function(err, result) {
      if (err) throw err;
      console.log('Tabla USUARIOS creada');
      connection.query(
        'CREATE TABLE proyectos(idproyecto INT AUTO_INCREMENT PRIMARY KEY,nombre VARCHAR(255) NOT NULL, descripcion text, sprintActual int not null default 0)',
        function(err, result) {
          if (err) throw err;
          console.log('Tabla PROYECTOS creada');
          connection.query(
            'CREATE TABLE roles (nombre VARCHAR(255) NOT NULL,idusuario int, idproyecto int,' +
              ' ordenar boolean,  editarPBI boolean, estimarTam boolean,estimarValor boolean, sprintGoals boolean, mantenerUsuarios boolean,archivarProyecto boolean,setDone boolean, proyecciones boolean, ' +
              'foreign key(idusuario) references usuarios(idusuario),foreign key(idproyecto) references proyectos(idproyecto),idrol INT AUTO_INCREMENT PRIMARY KEY)',
            function(err, result) {
              if (err) throw err;
              console.log('Tabla ROLES creada');
              connection.query(
                'CREATE TABLE rolesPermisos (idrol int, foreign key(idrol) REFERENCES roles(idrol), permiso VARCHAR(255), primary key(idrol,permiso) )',
                function(err, result) {
                  if (err) throw err;
                  console.log('Tabla ROLESPERMISOS creada');
                  connection.query(
                    'create table pbis ( idpbi INT AUTO_INCREMENT PRIMARY key,titulo varchar(255) not null, descripcion text,done boolean not null, prioridad int not null' +
                      'label varchar(255) not null, estimacion int, valor int,sprint int, sprintCreacion int not null, idproyecto int not null, foreign key(idproyecto) references proyectos(idproyecto) )',
                    function(err, result) {
                      if (err) throw err;
                      console.log('Tabla PBIS creada');
                      connection.query(
                        'create table comentarios ( idcomentario INT AUTO_INCREMENT PRIMARY key,comentario text NOT NULL,fecha DATETIME NOT NULL, ' +
                          'idpbi int NOT NULL, idusuario int NOT NULL, foreign key(idpbi) references pbis(idpbi),foreign key(idusuario) references usuarios(idusuario) )',
                        function(err, result) {
                          if (err) throw err;
                          console.log('Tabla Comentarios creada');
                          connection.query(
                            'create table archivos ( idarchivo INT AUTO_INCREMENT PRIMARY key,nombre varchar(255) not null, src longblob not null, ' +
                              'idusuario int not null,foreign key(idusuario) references usuarios(idusuario),idpbi int not null,foreign key(idpbi) references pbis(idpbi) )',
                            function(err, result) {
                              if (err) throw err;
                              console.log('Tabla Archivos creada');
                              connection.query(
                                'create table criterios ( idcriterio INT AUTO_INCREMENT PRIMARY key,nombre text not null,done boolean not null ' +
                                  'idpbi int not null,foreign key(idpbi) references pbis(idpbi) )',
                                function(err, result) {
                                  if (err) throw err;
                                  console.log('Tabla Criterios creada');
                                  connection.query(
                                    'create table dependencias ( iddependencia INT AUTO_INCREMENT PRIMARY key,' +
                                      'idpbi int not null,foreign key(idpbi) references pbis(idpbi), idpbi2 int not null,foreign key(idpbi2) references pbis(idpbi) )',
                                    function(err, result) {
                                      if (err) throw err;
                                      console.log('Tabla Dependencias creada');
                                      connection.query(
                                        'create table invitaciones (' +
                                          'token text not null, idproyecto int not null, email VARCHAR(255) NOT NULL,rol VARCHAR(255) NOT NULL,' +
                                          'foreign key(idproyecto) references proyectos(idproyecto) on delete cascade, primary key (idproyecto,email))',
                                        function(err, result) {
                                          if (err) throw err;
                                          console.log('Tabla Invitaciones creada');
                                          connection.query(
                                            'create table sprintgoals (' +
                                              'idproyecto int not null, goal text NOT NULL, sprintNumber int not null,' +
                                              'foreign key(idproyecto) references proyectos(idproyecto) on delete cascade, primary key (idproyecto,sprintNumber))',
                                            function(err, result) {
                                              if (err) throw err;
                                              console.log('Tabla SprintGoals creada');
                                              connection.end();
                                              console.log('Desconectado de MYSQL');
                                            }
                                          );
                                        }
                                      );
                                    }
                                  );
                                }
                              );
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
});

/* connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "drop TABLE usuarios;";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Tabla USUARIOS borrada");
        connection.end();
    });
}); */
