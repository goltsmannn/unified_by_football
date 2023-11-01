import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "context/AuthContext";


const useBlackList = ()=>{
    const [blacklistedUsers, setBlacklistedUsers] = useState([]);
    const authContext = useContext(AuthContext);

    useEffect(()=>{
        if(authContext.user?.id){ //читать про это) опциональная цепочка
            const fetchData = async()=>{
                try{
                    const config = {
                        headers: {
                            Authorization: `Bearer ${authContext.authToken.replaceAll('"', '')}`,
                        }
                    }
                    const response = await axios.get(`http://127.0.0.1:8000/api/users/blacklist`, config);
                    setBlacklistedUsers(response.data);
                }
                catch(error){
                    console.error('error in blacklist hook', error);
                }
            }
            fetchData();
        }
    },[authContext.user, authContext.authToken]);
    //console.log(blacklistedUsers);
    return blacklistedUsers;
}

export default useBlackList;