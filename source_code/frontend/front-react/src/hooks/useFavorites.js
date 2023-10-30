import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "context/AuthContext";


const useFavorites = ()=>{
    const [favoritePlacemarks, setFavoritePlacemarks] = useState([]);
    const authContext = useContext(AuthContext);
    
    useEffect(()=>{
        if(authContext.user?.id){ 
            const fetchData = async ()=>{
                const config = {
                    headers: {
                        Authorization: `Bearer ${authContext.authToken.replaceAll('"', '')}` 
                    }
                }
                try{
                    const response = await axios.get('http://127.0.0.1:8000/api/map/favorites', config);
                    setFavoritePlacemarks(response.data);
                }
                catch(error){
                    console.error('error while getting favs', error);
                }
            }
            fetchData();
        }
    }, [authContext.user]);

    return favoritePlacemarks
}

export default useFavorites;