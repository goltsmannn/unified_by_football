import AuthContext from "context/AuthContext";
import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";

const LoggedUserUpperMenu = () => {
    const authContext = useContext(AuthContext);
    return(
        <>
        <nav className="bg-background">
        <ul className="flex justify-between items-center py-4 px-10">
            <li className="text-white hover:text-darkgreen">
            <Link to="/" className="text-white hover:text-darkgreen">Карта</Link>
            </li>
            <li>
            <Link to={`profile/${authContext.user.id}`} className="text-white hover:text-darkgreen">Профиль</Link>
            </li>
            <li>
            <Link to="search" className="text-white hover:text-darkgreen">Найти пользователя</Link>
            </li>
            <li>
            <Link to="message" className="text-white hover:text-darkgreen">Почта</Link>
            </li>
            <li>
            <Link to="/" onClick={authContext.logoutUser} className="text-white hover:text-darkgreen">Выйти</Link>
            </li>
        </ul>
        </nav>
        </>
    );
    
}

export default LoggedUserUpperMenu;