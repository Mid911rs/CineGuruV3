import { useContext, useState } from "react"; 
import { DataContext } from "../context/DataContext";
import { Link } from 'react-router-dom';

/**
 * @classdesc Componente que muestra el formulario de búsqueda principal
 */

const FormSearch = () => { 

    const [title, setTitle] = useState(''); //Estado inicial del título de la película, barra busqueda principal
    const { setParams, error } = useContext(DataContext); //Obtener los parámetros de búsqueda del contexto

const handleSubmit = (e) => { //Función que se ejecuta cuando el usuario envia la búsqueda
    e.preventDefault(); //Prevenir que el formulario se envie por defecto

    if (title.trim() !== '') { //Si el título no está vacío
        setParams(title);
    }
}

return ( 
    <div className="form-search">
        <Link to="/" className="link_main">
        <img src="../logo.png" alt="Logo de CineGuru"  style={{ width: '700px', 
                                                                height: '250px',
                                                                marginBottom: '20px', 
                                                                boxShadow: '0 0 15px 15px rgba(43, 9, 12, 0.9)' }} />
        </Link>
        
        <form onSubmit={ handleSubmit }>
            <input type="text" placeholder="Nombre de la película" onChange={e=>setTitle(e.target.value)}/>
            <input className="buscar_main" type="submit" value="Buscar" />
        </form>
        { error === true && <p className="error">No se encuentra esta película </p> }
    </div>
)

}

export default FormSearch;

