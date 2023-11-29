import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Favoritos = () => {
    const [favoritos, setFavoritos] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/favoritos', { withCredentials: true })
        .then(res => {
            if (res.status === 200 && Array.isArray(res.data)) {
                console.log(res.data); 
                setFavoritos(res.data);
            } else {
                console.error('Error al obtener los favoritos:', res);
            }
        })
        .catch(err => {
            console.error(err);
        });
    }, []);

    const eliminarPelicula = (id) => {
        console.log(`Eliminando película con ID: ${id}`); 
        axios.delete(`http://localhost:5000/favoritos/${id}`, { withCredentials: true })
        .then(res => {
            setFavoritos(prevFavoritos => prevFavoritos.filter(pelicula => pelicula.pelicula_id !== id));
        })
        .catch(err => {
            console.error(err);
        });
    };

    return (
        <div className="favoritos">
            {favoritos.map((pelicula, index) => (
                <div>
                    <div className="favoritos_peliculas" key={index}>
                        <h2>{pelicula.pelicula_titulo}</h2>
                        {pelicula.pelicula_imagen && (
                            <img src={pelicula.pelicula_imagen} alt={pelicula.pelicula_titulo} />
                        )}
                    </div>
                    <div className="favoritos_eliminar">
                        <button onClick={() => eliminarPelicula(pelicula.pelicula_id)} className='erase-movie'>Eliminar</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Favoritos;