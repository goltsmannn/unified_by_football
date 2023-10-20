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
                        <input type="password" id="password-field" name="password" onChange={(e)=>setRegisterInfo({
                            password: e.target.value
                        })}/>
                        <label htmlFor="password-field">Пароль</label>
                        <input type="password" id="password2-field" name="password2" onChange={(e)=>setRegisterInfo({
                            password2: e.target.value
                        })}/>
                        <label htmlFor="password2-field">Пароль</label>
                        <input type="submit" />
                    </form>
                    <div id="register-errors-list">
                        {registerErrors && Object.entries(registerErrors).map((error)=>{
                            return (<div id="register-error">
                                {`${error[0]}: ${error[1]}`}
                            </div>);
                        })}
                    </div>
                </div>
                <div id="login-link">
                    <Link to="/login">Уже есть аккаунт? Войти</Link>
                </div>
            </>
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