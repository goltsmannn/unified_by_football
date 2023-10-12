import AuthContext from "context/AuthContext";
import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";

const LoggedUserUpperMenu = () => {
    const authContext = useContext(AuthContext);
    return(
        <>
        <nav>
            <ul>
                <li>
                    <Link to="/">Карта</Link>
                </li>
                <li>
                    <Link to={`profile/${authContext.user.id}`}>Профиль</Link>
                </li>
                <li>
                    <Link to="/" onClick={authContext.logoutUser}>Выйти</Link>
                </li>
            </ul>
        </nav>
        </>
    );
    
}

export default LoggedUserUpperMenu;