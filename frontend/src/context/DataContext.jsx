import { createContext, useState, useEffect } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => { 
    const [params, setParams] = useState(''); 
    const [data, setData] = useState([]); 
    const [isLoading, setIsLoading] = useState(false); 
    const [error, setError] = useState(null);

useEffect(() => {
    const search = async () => {
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
    if (params !== '') {
        search();
    }
}, [params]);

return (
    <DataContext.Provider value={{ data, setData, params, setParams, isLoading, error }}>
        {children}
    </DataContext.Provider>
);

};

export default DataProvider;

