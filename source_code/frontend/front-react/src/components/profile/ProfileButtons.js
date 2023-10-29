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
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isBlackListed, setIsBlackListed] = useState(false);

    const handleSubscriptionClick = async (e)=>{
        e.preventDefault();
        setIsSubscribed(!isSubscribed);
    }

    const handleBlackListClick = async (e)=>{
        e.preventDefault();
        setIsBlackListed(!isBlackListed);        
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

    useEffect(()=>{
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
                console.error('caught error while subscribing', error);
            }
        }
        fetchData();
    }, [isSubscribed, authContext.authToken, authContext.user, pageUser]);


    useEffect(()=>{
        const fetchData = async ()=>{
            const data = {
                user_from_id: authContext.user.id,
                user_to_id: pageUser.id,
                delete: !isBlackListed,
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
        fetchData();
    }, [isBlackListed, authContext.authToken, authContext.user, pageUser]);



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
                
