import AuthContext from "context/AuthContext";
import useSubscriptions from "hooks/useSubscriptions";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import useBlackList from "hooks/useBlackList";

const ProfileButtons = ({pageUser}) =>{
    const location = useLocation();
    const authContext = useContext(AuthContext);
    const subscriptions = useSubscriptions();
    const blacklistedUsers = useBlackList();
    const page_id= useParams().user_id;
    const [isSubscribed, setIsSubscribed] = useState(null);
    const [isBlackListed, setIsBlackListed] = useState(null);

    const handleSubscriptionClick = async (e)=>{
        e.preventDefault();
        const check = !isSubscribed;
        setIsSubscribed(check);
        const fetchData = async ()=>{
            const data = {
                user_from_id: authContext.user.id,
                user_to_id: pageUser.id,
                delete: !check
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authContext.authToken.replaceAll('"', '')}`,
                }
            }
            try{
                console.log(data);
                const response = await axios.post('http://127.0.0.1:8000/api/users/subscriptions', data, config);
                console.log(response.data);
            }
            catch(error){
                console.error('caught error while subscribing', error);
            }
        }
        await fetchData();
    }

    const handleBlackListClick = async (e)=>{
        e.preventDefault();
        const check = !isBlackListed;
        setIsBlackListed(check);  
        const fetchData = async ()=>{
            const data = {
                user_from_id: authContext.user.id,
                user_to_id: pageUser.id,
                delete: !check,
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${authContext.authToken.replaceAll('"', '')}`,
                }
            }
            try{
                const response = await axios.post('http://127.0.0.1:8000/api/users/blacklist', data, config);
                console.log(response.data);
            }
            catch(error){
                console.error('caught error while blacklisting', error);
            }
        }
        await fetchData();      
    }


    useEffect(()=>{
        subscriptions.forEach((subscription)=>{
            if(subscription.user_to.id === Number(page_id)){
                setIsSubscribed(true);  
            }
        })
    }, [subscriptions, page_id]);

    useEffect(()=>{
        console.log(blacklistedUsers);
        blacklistedUsers.forEach((blacklistedUser)=>{
            if(blacklistedUser.user_to.id === Number(page_id)){
                setIsBlackListed(true);
            }
        })
    }, [blacklistedUsers, page_id]);







    if((location.pathname===`/profile/${page_id}`) && (authContext.user)){
        if(pageUser.id === authContext.user.id){
            return(
                <Link to="edit">Изменить</Link>
            );
        }
        else{
            return(
                <>
                <button onClick={handleSubscriptionClick}>{isSubscribed?"Отписаться":"Подписаться"}</button> <br></br>
                <button onClick={handleBlackListClick}>{isBlackListed?"Убрать из черного списка":"Добавить в черный список"}</button>
                </>
            );
        }
    }
    else{
        return(<></>);
    }
}   

export default ProfileButtons;
                
