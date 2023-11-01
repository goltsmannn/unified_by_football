import AuthContext from "context/AuthContext";
import React from "react";
import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";


const Login = () => {
    const authContext = useContext(AuthContext);
    const {state} = useLocation();
    const navigate = useNavigate();
    
    if(authContext.user){
        navigate('/');
    }
    return(
        <div className="h-screen w-full flex items-center justify-center">
        <div id="login-form" className="max-w-md w-full h-96 p-8 flex flex-col rounded-lg border border-solid border-navbar">
            <h1 className="text-center text-2xl text-navbar font-bold">Авторизация</h1>
            <form onSubmit={authContext.loginUser} className="text-navbar flex mt-8 h-full flex-col justify-around">
                <li className="list-none flex flex-col font-medium">                 
                    <label htmlFor="password2-field">E-mail</label>
                    <input className='rounded-lg px-1 py-2 border border-solid border-navbar focus:outline-active' type="text" name="email" placeholder="Введите почту"></input>
                </li>
                <li className="list-none flex flex-col font-medium">                 
                    <label htmlFor="password2-field">Пароль</label>
                    <input className='rounded-lg px-1 py-2 border border-solid border-navbar focus:outline-active' type="password" name="password" placeholder="Введите пароль"></input> 
                </li>
                {/* type=password всегда чтобы не было видно вводимые данные */}
                <input className="bg-navbar px-1 py-2 rounded-lg text-white" type="submit" />
            </form>
            <div id="login-link" className="text-center">
                <span>У вас нет аккаунта? </span> <Link className="text-active font-medium" to="/register"> Зарегистрироваться </Link>
            </div>
        </div>
        </div>
    );
    
}

export default Login;
