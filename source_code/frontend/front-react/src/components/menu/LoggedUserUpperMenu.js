import React from "react";
import { Link } from "react-router-dom";


class LoggedUserUpperMenu extends React.Component{
    render(){
        return(
            <>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Карта</Link>
                    </li>
                    <li>
                        <Link to="profile">Профиль</Link>
                    </li>
                    <li>
                        <Link to="exit">Выйти</Link>
                    </li>
                </ul>
            </nav>
            </>
        );
    }
}

export default LoggedUserUpperMenu;