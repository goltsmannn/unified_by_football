import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import AuthContext from "context/AuthContext";


const GetMessage = () => {
    const [message, setMessage] = useState();
    const {message_id} = useParams();
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(()=>{
        const fetchData = async ()=>{
            try{
                const response = await axios.get(`${authContext.requestHost}/api/users/messages/details/${message_id}`);
                setMessage(response.data);
            }
            catch(error){
                console.log('error while getting message details');
                console.log(error);
            }

        }
        fetchData();
    }, [message_id]);

    const handleDelete = async (e) => {
        e.preventDefault();
        try{
            const config = {
                headers: {
                    Authorization: `Bearer ${authContext.authToken.replaceAll('"', '')}`,
                }
            }
            await axios.delete(`${authContext.requestHost}/api/users/messages/delete/${message_id}`, {}, config);
        }
        catch(error){
            console.error('error while deleting message', error);
        }
        navigate('/message/submitted');
    }
 

    if(message){
        return(
            <div className="mt-[100px] w-full flex items-start justify-center">
                <div 
                    className="w-full max-w-md px-[40px] py-[30px] max-h-[300px] rounded-lg border border-solid border-navbar border-2 text-navbar flex h-full flex-col justify-between"
                >
                    <div id="message-navlinks">
                        <Link className="font-semibold text-[#ffff] bg-navbar px-4 py-2 rounded-md"
                            to={message?.sender.id === authContext.user?.id?"/message/submitted":"/message"}>{'<< Назад'}
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
                        <div id="report" className=" flex flex-row-reverse justify-end justify-between">
                            <button className="flex justify-end text-white bg-red rounded p-2" onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                  
                </div>
            </div>
        )
    }
}

export default GetMessage;