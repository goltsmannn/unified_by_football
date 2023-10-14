import React from "react";
import { Link } from "react-router-dom";
const Page404 = ()=>{
    return(
        <>
        <div>
            Страницы не существует, возможно, вы ошиблись адресом, или она была удалена.
            Вы можете вернуться на главную
        </div>
        <Link to="/">Домой</Link>
        </>
    )
}

export default Page404;