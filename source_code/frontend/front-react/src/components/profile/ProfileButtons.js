import AuthContext from "context/AuthContext";
import useSubscriptions from "hooks/useSubscriptions";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";


const ProfileButtons = ({pageUser}) =>{
    const location = useLocation();
    const authContext = useContext(AuthContext);
    const subscriptions = useSubscriptions();
    const page_id= useParams().user_id;
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleClick = (e)=>{
        e.preventDefault();
        setIsSubscribed(!isSubscribed);
    }

    useEffect(()=>{
        subscriptions.forEach((subscription)=>{
            if(subscription.user_to.id === Number(page_id)){
                setIsSubscribed(true);  
            }
        })
    }, [subscriptions]);

    useEffect(()=>{
        console.log(isSubscribed);
        const fetchData = async ()=>{
            const data = {
                user_from_id: authContext.user.id,
                user_to_id: pageUser.id,
                delete: !isSubscribed
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authContext.authToken.replaceAll('"', '')}`,
                }
            }
            try{
                const response = await axios.post('http://127.0.0.1:8000/api/users/subscriptions', data, config);
                console.log(response.data);
            }
            catch(error){
                console.error('caught error while getting subs', error);
            }
        }
        fetchData();
    }, [isSubscribed]);


    if((location.pathname===`/profile/${page_id}`) && (authContext.user)){
        if(pageUser.id === authContext.user.id){
            return(
                <Link to="edit">Изменить</Link>
            );
        }
        else{
            return(
                <>
                <button onClick={handleClick}>{isSubscribed?"Отписаться":"Подписаться"}</button>
                </>
            );
        }
    }
    else{
        return(<></>);
    }
}   

export default ProfileButtons;
                
