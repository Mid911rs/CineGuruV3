import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import UserContext from './UserContext';
import axios from 'axios';

/**
 * @classdesc Componente que muestra la barra de navegación
 */

const Navbar = () => {
    const { user, setUser } = useContext(UserContext); //Obtener el usuario del contexto
    const { setParams } = useContext(DataContext); //Obtener los parámetros de búsqueda del contexto
    const navigate = useNavigate(); //  Navegación entre páginas
    const [title, setTitle] = useState(''); //Estado inicial del título de la película, barra busqueda secundaria

    const logout = () => { //Función para cerrar sesión, solicitud get a /logout
        axios.get('http://localhost:5000/logout', { withCredentials: true })
            .then(response => {
                console.log(response.data);
                setUser(null);
                navigate('/');
            })
            .catch(error => {
                console.error(error);
            });
    }

    const handleSearch = (e) => { //Función que se ejecuta cuando el usuario envia la búsqueda
        e.preventDefault();
        if (title.trim() !== '') { //Si el título no está vacío
            setParams(title); // Actualiza los parámetros de búsqueda en el contexto
            navigate('/'); // Redirige a la página de búsqueda
            setTitle(''); // Limpia el campo de búsqueda después de la búsqueda
        }
    }

    return (
        <nav className="navbar">
            <Link to="/" className="logo">
                <h1>
                    <img src="../logobanner.png" alt="Logo de CineGuru" style={{width: '35px', 
                                                                         height: '45px',                                                                         
                                                                         boxShadow: '0 0 14px 15px rgba(43, 9, 12, 0.9)' }} />
                </h1>
            </Link>

            <div className="user_menu">
                {user && <span>Bienvenido/a, {user.usuario_nombre}</span>}
            </div>

            <div className="user_favoritos">
                {user && <Link to="/favoritos" className='favoritos_nav'>Ver favoritos</Link>}
                
            </div>

            <div className="menu_buscar">
                <form className="form-inline" onSubmit={handleSearch}>
                    <input
                        className="form-control search-input"
                        type="text"
                        placeholder="Buscar películas..."
                        aria-label="Buscar"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <button
                        className="search-button"
                        type="submit"
                    >
                        Buscar
                    </button>
                </form>
            </div>

            <div className="menu_inicio">
                {user && <button onClick={logout} className='cerrar_sesion'>Cerrar sesión</button>}
                {!user && <Link to="/inicio_sesion" className='inicio_sesion'>Iniciar sesión</Link>}
            </div>
            
        </nav>
    )
}

export default Navbar;
