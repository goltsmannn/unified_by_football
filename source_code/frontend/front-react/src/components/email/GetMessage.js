import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import AuthContext from "context/AuthContext";


const GetMessage = () => {
    const [message, setMessage] = useState();
    const {message_id} = useParams();
    const authContext = useContext(AuthContext);


    useEffect(()=>{
        const fetchData = async ()=>{
            try{
                const response = await axios.get(`http://127.0.0.1:8000/api/users/messages/details/${message_id}`);
                setMessage(response.data);
            }
            catch(error){
                console.log('error while getting message details');
                console.log(error);
            }

        }
        fetchData();
    }, );

    if(message){
        return(
            <div className="h-screen w-full flex items-start justify-center">
                <div 
                    className="w-full max-w-md px-[40px] py-[30px] max-h-[200px] rounded-lg border border-solid border-navbar border-2 text-navbar flex h-full mt-[100px] flex-col justify-around"
                >
                    <div id="message-navlinks">
                        <Link className="font-semibold text-[#ffff] bg-navbar px-4 py-2 rounded-md"
                            to={message.sender.id === authContext.user.id?"/message/submitted":"/message"}>{'<< Назад'}
                        </Link>
                    </div>
                    <div id="message-details-block" className="mt-[20px] font-medium">
                        <div id="header">
                            <div id="message-topic">Subject: {message.message_topic}</div>
                            <div id="message-sender">From: {message.sender.username}</div>
                        </div>
                        <div id="body">
                            <div id="message-text">Text: {message.message_text}</div>
                        </div>
                        <div id="footer">
                            <div id="message-datetime">Received at: {new Date(message.message_datetime).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default GetMessage;