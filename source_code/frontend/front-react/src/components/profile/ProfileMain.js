import AuthContext from "context/AuthContext";
import React, { useContext, useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";


const ProfileMain = () => {
    const authContext = useContext(AuthContext);
    const user = authContext.user;
    const page_id = useParams().user_id;
    const [pageUser, setPageUser] = useState(null); //хорошо ли так ? спросить надо
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(()=>{
        const fetchData = async ()=>{
            const response = await axios.get(`http://127.0.0.1:8000/users/api/users/${page_id}`);
            if(response.data){
                setPageUser(response.data);
            }
            console.log('page user:')
            console.log(response.data);
        }
        fetchData();
    },[page_id])
    if(pageUser){
    return(
        <div id="user-info-wrapper">
            <div id="user-info-fields">
                <div id="user-age">Возраст: {pageUser.age}</div>
                <div id="user-weight">Вес: {pageUser.weight}</div>
                <div id="user-height">Рост: {pageUser.height}</div>
                <div id="user-region">Регион: {pageUser.region}</div>
                <div id="user-username">Никнейм: {pageUser.username}</div>
                <div id="user-email">Почта: {pageUser.email}</div>
            </div>
            <div id="user-info-fields-buttons">
                {(location.pathname===`/profile/${page_id}`) && (authContext.user) && (pageUser.id == authContext.user.id) &&
            <Link to={`edit`}>Изменить</Link>}   
            </div>
            <div id="user-edit-outler">
                <Outlet></Outlet>
            </div>
        </div>
    )
    }
}

export default ProfileMain;