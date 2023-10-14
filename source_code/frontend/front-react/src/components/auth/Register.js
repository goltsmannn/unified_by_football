import React, { useState } from "react";
import { Link } from "react-router-dom";


const Register = () => {
    const [registerInfo, setRegisterInfo] = useState({
        email: '',
        username:'',
        password:'',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return(
        <>
            <div id="register-form">
                <form onSubmit={handleSubmit}>
                    <input type="text" id="email-field" name="email" onChange={(e)=>setRegisterInfo({
                        email: e.target.value
                    })}/>
                    <label htmlFor="email-field">Почта</label>
                    <input type="text" id="username-field" name="username" onChange={(e)=>setRegisterInfo({
                        username: e.target.value
                    })}/>
                    <label htmlFor="username-field">Имя пользователя</label>
                    <input type="text" id="password-field" name="password" onChange={(e)=>setRegisterInfo({
                        password: e.target.value
                    })}/>
                    <label htmlFor="password-field">Пароль</label>
                </form>
            </div>
            <div id="login-link">
                <Link to="/login">Уже есть аккаунт? Войти</Link>
            </div>
        </>
    )
}

export default Register;