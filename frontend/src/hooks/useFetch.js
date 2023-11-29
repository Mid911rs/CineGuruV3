import { useEffect, useState } from "react";

const API_ENDPOINT = `https://www.omdbapi.com/?apikey=c2da535b`;

export const useFetch = (params) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);//UTLIMO CAMBIO

    const fetchMovie = (url) => {
        setIsLoading(true);
        fetch(url)
            .then(respuesta => respuesta.json())
            .then(respuestaJson => {
                if (respuestaJson.Response === "True") {
                    //console.log("res: ", respuestaJson);
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

