var connection = require('./connection');

connection.connect(function(err) {
  if (err) throw err;
  console.log('Conectado a MYSQL');
  connection.query(
    'CREATE TABLE usuarios (idusuario INT AUTO_INCREMENT PRIMARY KEY,nombre VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL )',
    function(err, result) {
      if (err) throw err;
      console.log('Tabla USUARIOS creada');
      connection.query(
        'CREATE TABLE proyectos(idproyecto INT AUTO_INCREMENT PRIMARY KEY,nombre VARCHAR(255) NOT NULL, descripcion text )',
        function(err, result) {
          if (err) throw err;
          console.log('Tabla PROYECTOS creada');
          connection.query(
            'CREATE TABLE roles (nombre VARCHAR(255) NOT NULL,idusuario int, idproyecto int,foreign key(idusuario)' +
              ' references usuarios(idusuario),foreign key(idproyecto) references proyectos(idproyecto),idrol INT AUTO_INCREMENT PRIMARY KEY)',
            function(err, result) {
              if (err) throw err;
              console.log('Tabla ROLES creada');
              connection.query(
                'CREATE TABLE rolesPermisos (idrol int, foreign key(idrol) REFERENCES roles(idrol), permiso VARCHAR(255), primary key(idrol,permiso) )',
                function(err, result) {
                  if (err) throw err;
                  console.log('Tabla ROLESPERMISOS creada');
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
