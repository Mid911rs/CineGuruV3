const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const util = require('util');


const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(session({ secret: 'cineguruclinacap', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

const db = mysql.createConnection({
    host: 'peliculas.cwdpxvu8db9d.us-east-2.rds.amazonaws.com',
    user: 'cineguru',
    password: 'inacap2023',
    database: 'peliculas'
});

db.connect((err) => {
  if (err) {
      console.error('Error al conectar a la base de datos:', err);
      throw err;
  }
  console.log('Conexión a la base de datos MySQL establecida');
});



//Registro y verificación de usuario

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log('Autenticando usuario:', username); // Agrega esto
    db.query('SELECT * FROM usuarios WHERE usuario_nombre = ?', [username], function(err, results, fields) {
      if (err) { 
        console.log('Error al buscar usuario:', err); // Agrega esto
        done(err);
      }

      if (results.length === 0) {
        console.log('Usuario no encontrado:', username); // Agrega esto
        done(null, false);
      } else {
        const user = results[0];
        console.log('Usuario encontrado:', user); // Agrega esto

        if (user.usuario_contraseña === password) {
          console.log('Contraseña correcta para usuario:', username); // Agrega esto
          return done(null, user);
        } else {
          console.log('Contraseña incorrecta para usuario:', username); // Agrega esto
          return done(null, false);
        }
      }
    });
  }
));

// Ruta para registrar a un nuevo usuario
app.post('/register', function(req, res) {
  const { username, email, password } = req.body;

  // Guardar el nuevo usuario en la base de datos
  db.query('INSERT INTO usuarios (usuario_nombre, usuario_email, usuario_contraseña) VALUES (?, ?, ?)', [username, email, password], function(err, results) {
      if (err) {
          console.error(err);
          res.status(500).json({ message: 'Error al insertar el nuevo usuario en la base de datos' });
          return;
      }

      res.json({ message: 'Usuario registrado correctamente' });
  });
});


//Restringir acceso de usuarios no registrados a favoritos

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    // En lugar de redirigir, devolver un código de estado 401 y un mensaje
    return res.status(401).json({ message: 'Para agregar a favoritos debes iniciar sesión.' });
  }
}

db.query = util.promisify(db.query);


//Insertar en favoritos usuarios registrados

app.post('/addmovie', ensureAuthenticated, async (req, res) => {
  const userId = req.user.usuario_id;
  const movieTitle = req.body.title;

  if (!movieTitle) {
    res.status(400).json({ message: 'El título de la película no puede ser nulo' });
    return;
  }

  try {
    let query = 'SELECT * FROM peliculas WHERE pelicula_titulo = ?';
    let result = await db.query(query, [movieTitle]);
    let movieId;

    if(result.length > 0) {
        movieId = result[0].pelicula_id;
    } else {
        query = `INSERT INTO peliculas (pelicula_titulo) VALUES (?)`;
        result = await db.query(query, [movieTitle]);
        movieId = result.insertId;
    }

    query = `INSERT INTO favoritos (pelicula_id, usuario_id) VALUES (?, ?)`;
    await db.query(query, [movieId, userId]);

    res.json({ message: 'Película añadida correctamente a tus favoritos' });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: 'Hubo un error al añadir la película a favoritos' });
  }
});


// Ruta para iniciar sesión

app.post('/inicio_sesion', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { 
      return next(err); 
    }
    if (!user) { 
      return res.status(401).json({ message: 'Autenticación fallida' }); 
    }
    req.logIn(user, function(err) {
      if (err) { 
        return next(err); 
      }
      return res.json({ message: 'Autenticación exitosa', user: req.user });
    });
  })(req, res, next);
});


//Cerrar sesión
app.get('/logout', (req, res) => {
    req.logout(err => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al cerrar la sesión' });
      } else {
        res.json({ message: 'Sesión cerrada correctamente' });
      }
    });
  });
  
//Autenticar usuarios  
passport.serializeUser(function(user, done) {
    done(null, user.usuario_id);
  });

passport.deserializeUser(function(id, done) {
    db.query('SELECT * FROM usuarios WHERE usuario_id = ?', [id], function(err, results, fields) {
      if (err) { done(err) }
      if (results.length === 0) {
        done(null, false);
      } else {
        done(null, results[0]);
      }
    });
  });


//Insertar en favoritos

app.get('/addmovie/:title', ensureAuthenticated, async (req, res) => {
  if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'No autenticado' });
  }
  let title = req.params.title;
  let userId = req.user.usuario_id; // Obtener el ID del usuario de la sesión
  let query = 'SELECT * FROM peliculas WHERE pelicula_titulo = ?';
  let result = await db.query(query, [title]); // Pasar el título a la consulta

  if(result.length > 0) {
      let movieId = result[0].pelicula_id;
      query = `SELECT * FROM favoritos WHERE pelicula_id = ? AND usuario_id = ?`;
      let favResult = await db.query(query, [movieId, userId]);

      if(favResult.length > 0) {
          res.json({ message: 'La película ya está en tu lista de favoritos.' });
      } else {
          query = `INSERT INTO favoritos (pelicula_id, usuario_id) VALUES (?, ?)`;
          await db.query(query, [movieId, userId]);
          res.json({ message: 'Película añadida correctamente a tus favoritos.' });
      }
  } else {
      query = `INSERT INTO peliculas (pelicula_titulo) VALUES (?)`;
      result = await db.query(query, [title]); // Usa parámetros de consulta para evitar la inyección de SQL
      let movieId = result.insertId;
      query = `INSERT INTO favoritos (pelicula_id, usuario_id) VALUES (?, ?)`;
      await db.query(query, [movieId, userId]);
      res.json({ message: 'Película añadida correctamente a tus favoritos.' });
  }
});


//Ver lista de favoritos

app.get('/favoritos', (req, res) => {
  // Revisar que el usuario esté autenticado
  if (!req.user) {
    return res.status(401).json({ message: 'Por favor, inicia sesión para ver tus favoritos' });
  }

  // Se crea la consulta SQL
  const sql = `
  SELECT peliculas.* 
  FROM peliculas 
  INNER JOIN favoritos ON peliculas.pelicula_id = favoritos.pelicula_id 
  WHERE favoritos.usuario_id = ?;
  `;

  // Se ejecuta la consulta
  db.query(sql, [req.user.usuario_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al buscar los favoritos' });
    }

    // Se devuelven las películas favoritas en la respuesta
    res.json(results);
  });
});


//Añadir a favoritos segun pelicula_id

app.post('/favoritos/:pelicula_id', (req, res) => {
    // Revisar que usuario este autenticado
    if (!req.user) {
      return res.status(401).json({ message: 'Por favor, inicia sesión para marcar una película como favorita' });
    }
  
    // consulta SQL
    const sql = `
    INSERT INTO favoritos (usuario_id, pelicula_id) 
    VALUES (?, ?)
    `;
  
    // ejecutar la consulta
    db.query(sql, [req.user.usuario_id, req.params.pelicula_id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al marcar la película como favorita' });
      }

      // devolver un mensaje de éxito en la respuesta
      res.json({ message: 'Película marcada como favorita con éxito' });
    });
});


// Eliminar una película favorita

app.delete('/favoritos/:pelicula_id', ensureAuthenticated, (req, res) => {
  let query = `DELETE FROM favoritos WHERE pelicula_id = ? AND usuario_id = ?`;
  db.query(query, [req.params.pelicula_id, req.user.usuario_id], (err, result) => {
      if(err) {
          throw err;
      }
      res.send('Película eliminada correctamente de favoritos');
  });
});


//Conexión establecida

app.listen(5000, () => {
    console.log('Servidor iniciado en el puerto 5000');
});





