import React from "react";
import getAPIURL from "../../utils/getAPIURL";
import { Link } from "react-router-dom";


const api_urls = await getAPIURL();


class UnloggedUserUpperMenu extends React.Component{
    render(){
        return(
            <>
            <nav>
                <ul>
                    <li>
                        <Link to="register">Регистрация</Link>
                    </li>
                    <li>
                        <Link to="login">Войти</Link>
                    </li>
                    <li>
                        <Link to="/">Карта</Link>
                    </li>
                </ul>
            </nav>
            </>
        );
    }
}

export default UnloggedUserUpperMenu;