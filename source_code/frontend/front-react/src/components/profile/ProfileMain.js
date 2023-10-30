import AuthContext from "context/AuthContext";
import React, { useContext, useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import useSubscriptions from "hooks/useSubscriptions";
import ProfileButtons from "./ProfileButtons";
import ProfileActivity from "./ProfileActivity";


const ProfileMain = () => {
    const authContext = useContext(AuthContext);
    const page_id = useParams().user_id;
    const [pageUser, setPageUser] = useState(null); //хорошо ли так ? спросить надо
  //  const [isSubscribed, setIsSubscribed] = useState(false);
  //  const location = useLocation();
  //  const navigate = useNavigate();
   // const subscriptions = useSubscriptions();
    const location = useLocation()

    console.log(location.pathname.includes('edit'));

    useEffect(()=>{
        const fetchData = async ()=>{
            try{
                const response = await axios.get(`http://127.0.0.1:8000/api/users/${page_id}`);
                setPageUser(response.data);
            }
            catch(error){
                console.log('error while fetching page user');
                console.log(error);
            }
        }
        if(authContext.user){
            fetchData();
        }
    },[page_id, authContext.user]);





    useEffect(()=>{

    },);

    if(pageUser){
    return(
        <div 
            id="user-info-wrapper"
            className="h-[calc(100vh-56px)] w-full font-medium flex items-start justify-center"
        >
            <div 
                className="px-[20px] py-[30px] max-w-md w-full mt-[100px] text-navbar flex flex-col justify-around rounded-lg border border-solid border-navbar"
            >
            <h1 className="text-center text-2xl text-navbar font-bold">
                Профиль пользователя
            </h1>

            <div id="subscription-block">
            </div>
            <div 
                id="user-info-fields"
                className="mt-[20px]"
            >
                <div id="user-age">Возраст: {pageUser.age ?? '----'}</div>
                <div id="user-weight">Вес: {pageUser.weight ?? '----'}</div>
                <div id="user-height">Рост: {pageUser.height ?? '----'}</div>
                <div id="user-region">Регион: {pageUser.region ?? '----'}</div>
                <div id="user-username">Никнейм: {pageUser.username ?? '----'}</div>
                <div id="user-email">Почта: {pageUser.email ?? '----'}</div>
            </div>
            <div 
                id="user-info-fields-buttons"
            >
                <ProfileButtons 
                    pageUser={pageUser}
                />
            </div>
            <div id='profile-activity'>
                <ProfileActivity pageUser={pageUser}></ProfileActivity>
            </div>
            <div id="user-edit-outler">
                <Outlet></Outlet>
            </div>
            </div>

        </div>
    )
    }
}

export default ProfileMain;