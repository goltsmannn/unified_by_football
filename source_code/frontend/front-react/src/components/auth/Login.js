import AuthContext from "context/AuthContext";
import React from "react";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";


const Login = () => {
    const authContext = useContext(AuthContext);
    const {state} = useLocation();
    const navigate = useNavigate();

    if(authContext.user){
        navigate('/');
    }
    return(
        <>
        <div id="redirect-error">
            {state? <p>{state.error}</p>:null}
        </div>
        <div id="login-form">
            <form onSubmit={authContext.loginUser}>
                <input type="text" name="email" placeholder="Введите почту"></input>
                <input type="password" name="password" placeholder="Введите пароль"></input> 
                {/* type=password всегда чтобы не было видно вводимые данные */}
                <input type="submit" />
            </form>
        </div>
        </>
    );
    
}

export default Login;
