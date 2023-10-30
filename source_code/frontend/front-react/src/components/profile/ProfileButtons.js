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
    const [isHidden, setIsHidden] = useState(authContext.user.show_activity);


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


    const handleIsHiddenChange = () => {
        const check = !isHidden;
        setIsHidden(check);
        const fetchData = async () => {
            const config = {
                headers: {
                    Authorization: `Bearer ${authContext.authToken.replaceAll('"', '')}` 
                }
            }
            const tmpUser = authContext.user;
            tmpUser.show_activity = check;
            try{
                const response = await axios.post('http://127.0.0.1:8000/api/users/auth/update_user_by_token', tmpUser, config);
            }
            catch(error){
                console.error('error while updating activity boolean value')
            }
        }
        fetchData();
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
                <>
                <Link 
                   className={`mt-[30px] text-center w-full block bg-navbar px-1 py-2 rounded-lg text-white active:bg-active`}
                   to="edit">Изменить</Link>
                <button onClick={handleIsHiddenChange}>{isHidden?"Показать активность":"Скрыть активность"}</button>
                </>
            );
        }
        else{
            return(
                <div className="mt-[20px]">
                    <button className="bg-navbar text-[#ffff] text-center px-2 py-1 rounded-md" onClick={handleSubscriptionClick}>{isSubscribed?"Отписаться":"Подписаться"}</button> <br></br>
                    <button className="mt-[10px] bg-[#cf0404] text-[#ffff] px-2 py-1 rounded-md" onClick={handleBlackListClick}>{isBlackListed?"Убрать из черного списка":"Добавить в черный список"}</button>
                </div>
            );
        }
    }
    else{
        return <></>;
    }
}   

export default ProfileButtons;
                
