import { useContext, useEffect } from 'react';
import FormSearch from "./FormSearch";
import Movies from "./Movies";
import { DataContext } from "../context/DataContext";

const MainPage = () => {
    const { data, setData, setParams } = useContext(DataContext);

    useEffect(() => {
        return () => {
            setParams(''); // Restablece params a su estado inicial cuando MainPage se desmonta
            setData([]); // Restablece data a su estado inicial cuando MainPage se desmonta
        };
    }, []);

    return ( 
        <>
            <FormSearch/>
            {data.length > 0 && <Movies/>}
        </>
    );
}
 
export default MainPage;

