import AuthContext from "context/AuthContext";
import React, { useState } from "react";
import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";


const Login = () => {
    const authContext = useContext(AuthContext);
    const {state} = useLocation();
    const navigate = useNavigate();
    const [errors, setErrors] = useState(null);
    if(authContext.user){
        navigate('/');
    }

    const handleSubmit = async(e) =>{
        e.preventDefault();
        const error = await authContext.loginUser(e);
        if(error){
            setErrors(error.response.data);
        }
    }


    return(
        <div className="h-screen w-full flex items-center justify-center">
        <div id="login-form" className="max-w-md w-full h-96 p-8 flex flex-col rounded-lg border border-solid border-navbar">
            <h1 className="text-center text-2xl text-navbar font-bold">Authorization</h1>
            <form onSubmit={handleSubmit} className="text-navbar flex mt-8 h-full flex-col justify-around">
                <li className="list-none flex flex-col font-medium">                 
                    <label htmlFor="password2-field">E-mail</label>
                    <input className='rounded-lg px-1 py-2 border border-solid border-navbar focus:outline-active' type="text" name="email" placeholder="Enter email"></input>
                </li>
                <li className="list-none flex flex-col font-medium">                 
                    <label htmlFor="password2-field">Password</label>
                    <input className='rounded-lg px-1 py-2 border border-solid border-navbar focus:outline-active' type="password" name="password" placeholder="Enter password"></input> 
                </li>
                {/* type=password всегда чтобы не было видно вводимые данные */}
                <input className="bg-navbar px-1 py-2 rounded-lg text-white" type="submit" value="Submit"/>
            </form>
            {errors&&<div 
                id="login-errors-list"
                className="bg-red px-1 py-1 rounded-lg text-[#ffff]">
                {errors && Object.entries(errors).map((error)=>{
                    return (<div id="register-error">
                        {`${error[0]=='detail'?"":error[0]+":"} ${error[1]}`}
                    </div>);
                })}
            </div>}
            <div id="login-link" className="text-center">
                <span>Do not have an account yet? </span> <Link className="text-active font-medium" to="/register"> Sign up </Link>
            </div>
        </div>
        </div>
    );
    
}

export default Login;
