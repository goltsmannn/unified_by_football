import AuthContext from "context/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Verification = () => {
    const {uid, token} = useParams();
    const [response, setResponse] = useState(null);
    const navigate = useNavigate();
    const [awaitTime, setAwaitTime] = useState(3);
    const authContext = useContext(AuthContext);

    
    useEffect(()=>{
        const fetchData = async () => {
            try{
                const response = await fetch(`${authContext.requestHost}/api/users/confirm/${uid}/${token}`);
                setResponse(response);
                const interval = setInterval(()=>{
                    setAwaitTime((awaitTime) => awaitTime-1);
                }, 1000);
                setTimeout(()=>{
                    clearInterval(interval);
                    navigate('/login');
                }, 3500);
            }
            catch (error){
                setResponse(error);
                console.log(error);
            }
        }
        console.log(uid, token);
        fetchData();
    }, [uid, token]);


    if(response?.status === 200){
        return(
            <div id="success">
                <h1 className="text-center text-2xl text-navbar font-bold">Success</h1>
                <p className="text-center">Your account has been activated. You will be redirected to the login page in {awaitTime}s.</p>
            </div>
        )
    }
    else if(response){
        return(
            <div id="failure">
                <h1 className="text-center text-2xl text-red font-bold">Failure</h1>
                <p className="text-center">Account confirmation failed. Please check your link.</p>
            </div>
        )    }
    else {
        return (
            <div id="loading">
                <h1 className="text-center text-2xl text-black font-bold">Loading</h1>
            </div>
        )
    }
}

export default Verification;