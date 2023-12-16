import { useContext, useEffect } from 'react';
import FormSearch from "./FormSearch";
import Movies from "./Movies";
import { DataContext } from "../context/DataContext";

/**
 * @classdesc Componente principal de la página de búsqueda
 */

const MainPage = () => { //Componente principal de la página de búsqueda
    const { data, setData, setParams } = useContext(DataContext); //Obtener data y parámetros de búsqueda del contexto

    useEffect(() => { //useEffect se ejecuta después de cada renderizado, cambiar con cada busqueda en la api
        return () => {
            setParams(''); // Restablece params a su estado inicial cuando MainPage se desmonta
            setData([]); // Restablece data a su estado inicial cuando MainPage se desmonta
        };
    }, []);


    //Movies se mostrará solo si hay datos    
    return ( 
        <>
            <FormSearch/>
            {data.length > 0 && <Movies/>} 
        </>
    );
}
 
export default MainPage;

