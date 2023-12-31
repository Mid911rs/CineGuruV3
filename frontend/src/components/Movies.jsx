//Componente que muestra la lista de películas

import { useContext } from "react";
import { DataContext } from "../context/DataContext";
import ItemMovie from "./ItemMovie";

/**
 * @classdesc Componente que muestra la lista de películas
 */

const Movies = () => {
    const { isLoading, data } = useContext(DataContext); //Obtener data y estado de carga del contexto

    if (isLoading) {
        return <div className="loading">Cargando...</div>;
    }

    return ( 
        <div className="movies-content">
            {
                !isLoading && data ?
                    data.map(item => (
                        <ItemMovie 
                        key={item.imdbID} 
                        id={item.imdbID} 
                        type={item.Type} 
                        title={item.Title} 
                        poster={item.Poster} 
                        year={item.Year}
                        />
                    ))
                : ''
            }
        </div>
    );
}
 
export default Movies;
