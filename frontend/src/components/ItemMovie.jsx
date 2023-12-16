//Detalles de los cuadros con la información de las películas que se muestran en la página de búsqueda

import DefaultImage from "/NoImage.png"
import { Link } from "react-router-dom";

/**
 * @classdesc Componente que muestra la información de cada película
 */

const ItemMovie = ({ id, title, type, year, poster }) => { //Componente que muestra la información de cada película
    
    let image = poster === "N/A" ? DefaultImage : poster; //Si la película no tiene poster, se muestra una imagen por defecto

    return ( 
        <Link to={`/movies/${id}`} style={{ color: 'inherit', textDecoration: 'inherit'}}> 
            <article>
            <div className="item-movie" style={{ backgroundImage: `url(${image})` }}>
                <div className="info">
                    <h4>{title}</h4>
                    <p className="row-info"><span>{type}</span><span>{year}</span></p>
                </div>
            </div>
            </article>
        </Link>
    );
}
 
export default ItemMovie;