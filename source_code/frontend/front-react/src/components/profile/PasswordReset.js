import AuthContext from "context/AuthContext";
import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";


const PasswordReset = () => {
    const [userInput, setUserInput] = useState({
        password: '',
        password2: '',
    });
    const [registerErrors, setRegisterErrors] = useState(null);
    const {uid, token} = useParams();
    const authContext = useContext(AuthContext);
    const [awaitTime, setAwaitTime] = useState(3);
    const navigate = useNavigate();
    const [successfulUpdate, setSuccessfulUpdate] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            password: e.target.password.value,
            password2: e.target.password2.value,
        }
        try{
            const response = await axios.post(`${authContext.requestHost}/api/users/reset_password/${uid}/${token}`, data);
            console.log(response);
            if(response.status === 204){
                setSuccessfulUpdate(true);
                setRegisterErrors(null);

                const interval = setInterval(()=>{
                    setAwaitTime((awaitTime) => awaitTime-1);
                }, 1000);
                setTimeout(()=>{
                    clearInterval(interval);
                    navigate('/login');
                }, 3500);
            }
        }
        catch (error){
            console.error('Error while updating password', error);
            console.log(error.response.data);
            setRegisterErrors(error.response.data);
        }
    }


    if(successfulUpdate){
        return(
            <div id="success">
                <h1 className="text-center text-2xl text-navbar font-bold">Success</h1>
                <p className="text-center">Your password has been changed. You will be redirected to the login page in {awaitTime}s.</p>
            </div>
        )
    }
    else{
        return (
        <div className="flex justify-center w-full mt-5">
        <div id="password-reset-form" className="overflow-auto max-w-md w-full h-[520px] p-8 flex flex-col justify-between rounded-lg border border-solid border-navbar">
            <form onSubmit={handleSubmit} className="min-h-[385px] text-navbar flex h-full mt-3 flex-col justify-around">

                <li className="list-none flex flex-col font-medium">
                    <label htmlFor="reset-password-field">Password</label>
                    <input 
                        className='rounded-lg px-1 py-2 border border-solid border-navbar focus:outline-active'
                        type="password" 
                        id="reset-password-field" 
                        name="password"
                        placeholder="Enter Password"
                        onChange={(e)=>setUserInput({
                        password: e.target.value
                    })}
                    />
                </li>

                <li className="list-none flex flex-col font-medium">                  
                    <label htmlFor="reset-password2-field">Password</label>
                    <input 
                        className='rounded-lg px-1 py-2 border border-solid border-navbar focus:outline-active'
                        type="password" 
                        id="reset-password2-field" 
                        name="password2"
                        placeholder="Confirm Password" 
                        onChange={(e)=>setUserInput({
                            password2: e.target.value
                        })}
                    />
                </li>

                <input className="bg-navbar px-1 py-2 rounded-lg text-white active:bg-active" type="submit" value="Submit"/>
            </form>
            {registerErrors && 
                <div 
                    id="register-errors-list"
                    className="bg-red px-1 py-1 rounded-lg text-[#ffff]"
                >
                    {Object.entries(registerErrors).map((error)=>{
                        if(error[0] === 'non_field_errors'){
                            console.log(error[1]);
                            return Object.entries(error[1]).map((errorText)=>{
                                return(<div id="register-error">
                                    {errorText[1]}
                                </div>);
                            });
                        }
                        else{
                            return (<div id="register-error">{error[1]}</div>);
                        }
                    })}
                </div>
            }
        </div>
        </div>
        );
    }
}

export default PasswordReset;