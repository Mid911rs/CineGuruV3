//Compartir datos de la API entre componentes

import { createContext, useState, useEffect } from "react";

/**
 * @classdesc Contexto de datos
 */

export const DataContext = createContext();

//Esta función permite que cualquier compoenente hijo acceda al data context
export const DataProvider = ({ children }) => { 
    const [params, setParams] = useState(''); //Estado inicial de la búsqueda
    const [data, setData] = useState([]); //Estado inicial de la data
    const [isLoading, setIsLoading] = useState(false); //Estado inicial de la carga
    const [error, setError] = useState(null); //Estado inicial de error

useEffect(() => { //useEffect se ejecuta después de cada renderizado, cambiar con cada busqueda en la api
    const search = async () => {    //Función asincrona para buscar en la api
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://www.omdbapi.com/?apikey=faf7e5bb&s=${params}`);
            const data = await response.json();
            if (data.Response === "True") {
                setData(data.Search);
            } else {
                setError(data.Error);
            }
        } catch (error) {
            setError(error.message);
        }
        setIsLoading(false);
    };
    if (params !== '') { //Si el parámetro de busqueda no está vacio, se ejecuta la búsqueda
        search();
    }
}, [params]); //Se ejecuta cada vez que cambia el parámetro de busqueda


return (        //Retorna el data context, cualquier componente hijo puede acceder a estos datos
    <DataContext.Provider value={{ data, setData, params, setParams, isLoading, error }}>
        {children}
    </DataContext.Provider>
);

};

export default DataProvider;

