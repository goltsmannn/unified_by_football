import AuthContext from "context/AuthContext";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
    const [registerInfo, setRegisterInfo] = useState({
        email: '',
        username:'',
        password:'',
    });
    const [registerErrors, setRegisterErrors] = useState(null);
    const [userWasCreated, setUserWasCreated] = useState(false);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            email: e.target.email.value,
            password: e.target.password.value,
            password2: e.target.password2.value,
            username: e.target.username.value
        }
        try{
            const response = await axios.post('http://127.0.0.1:8000/api/users/auth/register', data);
            setUserWasCreated(true);
            setTimeout(()=>{
                navigate("/login");
            })
            console.log('User successfully created');
        }       
        catch(error){
            // for(const key of Object.keys(error.response.data)){
            //     setRegisterErrors({
            //         [key]: error.response.data[key]
            //     });
            // }
            setRegisterErrors(error.response.data);
        }
    }
    if(!userWasCreated){
        return(
            <div className="h-screen w-full flex items-center justify-center">
                <div id="register-form" className="overflow-auto max-w-md w-full h-[520px] p-8 flex flex-col justify-between rounded-lg border border-solid border-navbar">
                <h1 className="text-center text-2xl text-navbar font-bold">Регистрация</h1>
                    <form onSubmit={handleSubmit} className="min-h-[385px] text-navbar flex h-full mt-3 flex-col justify-around">
                        <li className="list-none flex flex-col font-medium">
                            <label 
                                className="w-full" 
                                htmlFor="email-field"
                            >
                                E-mail
                            </label>
                            <input 
                                className='rounded-lg px-1 py-2 border border-solid border-navbar focus:outline-active'
                                type="text" 
                                id="email-field" 
                                name="email" 
                                placeholder="Введите почту"
                                onChange={(e)=>setRegisterInfo({
                                    email: e.target.value
                                })}
                            />
                        </li>

                        <li className="list-none flex flex-col font-medium">
                            <label htmlFor="username-field">Имя пользователя</label>
                            <input 
                                className='rounded-lg px-1 py-2 border border-solid border-navbar focus:outline-active'
                                type="text" 
                                id="username-field" 
                                name="username"
                                placeholder="Введите имя" 
                                onChange={(e)=>setRegisterInfo({
                                    username: e.target.value
                                })}
                            />
                        </li>

                        <li className="list-none flex flex-col font-medium">
                            <label htmlFor="password-field">Пароль</label>
                            <input 
                                className='rounded-lg px-1 py-2 border border-solid border-navbar focus:outline-active'
                                type="password" 
                                id="password-field" 
                                name="password"
                                placeholder="Введите пароль" 
                                onChange={(e)=>setRegisterInfo({
                                password: e.target.value
                            })}
                            />
                        </li>

                        <li className="list-none flex flex-col font-medium">                  
                            <label htmlFor="password2-field">Пароль</label>
                            <input 
                                className='rounded-lg px-1 py-2 border border-solid border-navbar focus:outline-active'
                                type="password" 
                                id="password2-field" 
                                name="password2"
                                placeholder="Повторите пароль" 
                                onChange={(e)=>setRegisterInfo({
                                    password2: e.target.value
                                })}
                            />
                        </li>
                        <input className="bg-navbar px-1 py-2 rounded-lg text-white active:bg-active" type="submit" />

                        {/* <input className="bg-navbar px-1 py-2 rounded-lg text-white active:border border-solid border-[#1af050] border-4px" type="submit" /> */}
                    </form>
                    {registerErrors && 
                    <div 
                        id="register-errors-list"
                        className="bg-active px-1 py-1 rounded-lg text-[#ffff]"
                    >
                        {registerErrors && Object.entries(registerErrors).map((error)=>{
                            return (<div id="register-error">
                                {`${error[0]}: ${error[1]}`}
                            </div>);
                        })}
                    </div>
                    }
                <div id="login-link" className="text-center">
                    <span>Уже есть аккаунт? </span> <Link className="text-active font-medium" to="/login"> Войти</Link>
                </div>
                </div>
            </div>
        )
    }
    else{
        return(
            <div id="wrapper">
                <div id="message">Пользователь успешно создан, вы будете переадресованы на страницу входа через 10 секунд</div>
                <Link to="login">Войти</Link>
            </div>
        )
    }
}

export default Register;