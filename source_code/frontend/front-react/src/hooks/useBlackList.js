import axios from "axios";
import AuthContext from "context/AuthContext";
import { useContext, useEffect, useState } from "react";


const useBlackList = ()=>{
    const [blacklistedUsers, setBlacklistedUsers] = useState([]);
    const authContext = useContext(AuthContext);

    /**
     * Obtaining and setting the blacklisted users for current user
     */
    useEffect(()=>{
        if(authContext.user?.id){ 
            const fetchData = async()=>{
                try{
                    const config = {
                        headers: {
                            Authorization: `Bearer ${authContext.authToken.replaceAll('"', '')}`,
                        }
                    }
                    const response = await axios.get(`${authContext.requestHost}/api/users/blacklist`, config);
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