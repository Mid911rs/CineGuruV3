import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from './UserContext';

/**
 * @classdesc Componente que muestra el formulario de inicio de sesión
 */

function LoginPage() {
  const [username, setUsername] = useState(''); //Estado inicial de usuario
  const [password, setPassword] = useState(''); //Estado inicial de contraseña
  const { setUser } = useContext(UserContext); //Obtener el usuario del contexto
  const navigate = useNavigate(); //Navegación entre páginas

  const handleSubmit = (event) => { //Función que se ejecuta cuando el usuario envia el formulario
    event.preventDefault(); //Prevenir que el formulario se envie por defecto

    axios.post('http://localhost:5000/inicio_sesion', { username, password }, { withCredentials: true }) 
                                                                      //Solicitud post a /inicio_sesion
      .then((response) => {
        console.log(response);
        setUser(response.data.user);

        const prevPath = localStorage.getItem('prevPath'); //Obtener la ruta previa

        if (prevPath) { //Si existe una ruta previa, redirigir a esa ruta
          navigate(prevPath);
          localStorage.removeItem('prevPath');
        } else {
          navigate('/');
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          alert('Nombre de usuario o contraseña incorrectos');
        } else {
          console.error(error);
        }
      });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre de usuario</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>

          <p>¿No tienes una cuenta? <Link to="/register">Regístrate ahora</Link>.</p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
