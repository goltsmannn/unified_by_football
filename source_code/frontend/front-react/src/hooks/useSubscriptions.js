import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "context/AuthContext";


const useSubscriptions = ()=>{
    const [subscriptions, setSubscriptions] = useState([]);
    const authContext = useContext(AuthContext);

    useEffect(()=>{
        if(authContext.user?.id){ 
            const fetchData = async()=>{
                try{
                    const config = {
                        headers: {
                            Authorization: `Bearer ${authContext.authToken.replaceAll('"', '')}`,
                        }
                    }
                    const response = await axios.get(`http://127.0.0.1:8000/api/users/subscriptions`, config);
                    setSubscriptions(response.data);
                }
                catch(error){
                    console.error('error in sub hook', error);
                }
            }
            fetchData();
        }
    },[authContext.user, authContext.authToken]);
    return subscriptions;
}

export default useSubscriptions;

// useEffect(()=>{
//     const fetchData = async () => {
//         const data = {
//             user_from_id: authContext.user.id
//         }
//         try{
//             const response = await axios.get(`http://127.0.0.1:8000/api/users/messages'`, data);
//             for(const subscription of response.data){
//                 console.log(subscription);
//             }
//         }
//         catch(error){
//             console.log('caught error while requesting for subs');
//             console.log(error);
//         }
//     }
//     if(authContext.user)
//         fetchData();
// }, authContext.user);