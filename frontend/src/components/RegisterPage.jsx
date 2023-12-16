import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

/**
 Esta es la página de registro.
 @classdesc
*/

function RegisterPage() {
  const [username, setUsername] = useState(''); //Estado inicial de usuario
  const [password, setPassword] = useState(''); //Estado inicial de contraseña
  const [email, setEmail] = useState(''); //Estado inicial de email
  const navigate = useNavigate(); //  Navegación entre páginas

  const handleSubmit = (event) => { //Función que se ejecuta cuando el usuario envia el formulario
    event.preventDefault(); //Prevenir que el formulario se envie por defecto

    if (!username || !password || !email) { //Validar que los campos no estén vacíos
      alert('Debe ingresar datos válidos');
      return;
    }

    axios.post('http://localhost:5000/register', { username, password, email }) //Solicitud post a /register
      .then((response) => {
        console.log(response.data);
        alert('¡La cuenta se ha creado con éxito!'); 
        navigate('/inicio_sesion'); // Redirige al usuario a la página de inicio de sesión después de registrarse
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          alert('Debe ingresar datos validos');
        } else {
          console.error(error);
        }
      });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Crear una nueva cuenta</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre de usuario</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Crear cuenta</button>

          <p>¿Ya tienes una cuenta? <Link to="/inicio_sesion">Iniciar sesión</Link>.</p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;