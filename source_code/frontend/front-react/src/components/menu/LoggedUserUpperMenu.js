import AuthContext from "context/AuthContext";
import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";

const LoggedUserUpperMenu = () => {
    const authContext = useContext(AuthContext);
    return(
        <>
        <nav className="bg-gray-800">
        <ul className="flex justify-between items-center py-4 px-10">
            <li>
            <Link to="/" className="text-white hover:text-gray-300">Карта</Link>
            </li>
            <li>
            <Link to={`profile/${authContext.user.id}`} className="text-white hover:text-gray-300">Профиль</Link>
            </li>
            <li>
            <Link to="search" className="text-white hover:text-gray-300">Найти пользователя</Link>
            </li>
            <li>
            <Link to="message" className="text-white hover:text-gray-300">Почта</Link>
            </li>
            <li>
            <Link to="/" onClick={authContext.logoutUser} className="text-white hover:text-gray-300">Выйти</Link>
            </li>
        </ul>
        </nav>
        </>
    );
    
}

export default LoggedUserUpperMenu;