import AuthContext from "context/AuthContext";
import React from "react";
import { Link } from "react-router-dom";


class LoggedUserUpperMenu extends React.Component{
    static contextType = AuthContext;
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
                        <Link to="/" onClick={this.context.logoutUser}>Выйти</Link>
                    </li>
                </ul>
            </nav>
            </>
        );
    }
}

export default LoggedUserUpperMenu;