import React from "react";
import getAPIURL from "../../utils/getAPIURL";

const api_urls = await getAPIURL();
console.log(api_urls);


class UnloggedUserUpperMenu extends React.Component{
    render(){
        return(
            <>
            <li><a href={api_urls.profile}>Регистрация</a></li>
            <li><a href="">Войти</a></li>
            <li><a href="">Карта</a></li>
            </>
        );
    }
}

export default UnloggedUserUpperMenu;