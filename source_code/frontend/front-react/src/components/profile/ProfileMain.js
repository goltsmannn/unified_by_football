import AuthContext from "context/AuthContext";
import React, { useContext } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";


const ProfileMain = () => {
    const authContext = useContext(AuthContext);
    const user = authContext.user;
    const page_id = useParams().user_id;
    const location = useLocation();
    const navigate = useNavigate();

    return(
        <div id="user-info-wrapper">
            <div id="user-info-fields">
                <div id="user-age">Возраст: {user.age}</div>
                <div id="user-weight">Вес: {user.weight}</div>
                <div id="user-height">Рост: {user.height}</div>
                <div id="user-region">Регион: {user.region}</div>
                <div id="user-username">Никнейм: {user.username}</div>
                <div id="user-email">Почта: {user.email}</div>
            </div>
            <div id="user-info-fields-buttons">
                {(location.pathname===`/profile/${page_id}`) &&
            <Link to={`edit`}>Изменить</Link>}   
            </div>
            <div id="user-edit-outler">
                <Outlet></Outlet>
            </div>
        </div>
    )
}

export default ProfileMain;