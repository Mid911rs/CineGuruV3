//Realizar solicitud a la API y manejar los estados de la soliciud y datos de respuesta

import { useEffect, useState } from "react";

/**
 * @classdesc Hook para realizar solicitud a la API y manejar los estados de la soliciud y datos de respuesta
 */

const API_ENDPOINT = `https://www.omdbapi.com/?apikey=c2da535b`;

export const useFetch = (params) => {
    const [isLoading, setIsLoading] = useState(true); //Se rastrea si la solicitud está en progreso o no
    const [error, setError] = useState(null); //Se rastrea si hay un error o no
    const [data, setData] = useState([]); //Se rastrea la respuesta de la API

    //Función para realizar la solicitud a la API
    const fetchMovie = (url) => {
        setIsLoading(true); //Se establece isLoading en true para indicar que la solicitud está en progreso
        fetch(url)
            .then(respuesta => respuesta.json())
            .then(respuestaJson => {
                if (respuestaJson.Response === "True") {
                    setData(respuestaJson.Search || respuestaJson);
                    setError(false);
                } else {
                    setError(true);
                }
                setIsLoading(false);
            }).catch(error => {console.log(error);})
    }
    useEffect(() => {
        if (params.trim() !== '') {
            fetchMovie(`${API_ENDPOINT}${params}`);
        } else {
            setError(null);
        }
    }, [params])

    return {isLoading, error, data}
}

