import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


const MessageList = ()=>{
    const [messages, setMessages] = useState([]);
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();


    useEffect(()=>{
        const fetchData = async() => {
            try{
                const response = await axios.get(`http://127.0.0.1:8000/api/users/messages/all/${authContext.user.id}`);
                setMessages(response.data);
            }
            catch(error){
                console.log('caught error while getting all mails');
                console.log(error);
            }
        }
        fetchData();
    }, [authContext.user]);


    return(
        <>
        <div id="write-message">
            <Link to="post">Написать сообщение</Link>
        </div>
        <div id="message-section-wrapper">
            <div id="message-list">
                {messages.map((message)=> {
                    return(
                    <div id="message-wrapper" key={message.id} onClick={()=>navigate(`${message.id}`)}>
                        <div id="message-topic">Тема сообщения: {message.message_topic}</div>
                        <div id="message-sender">Никнейм отправителя: {message.sender.username}</div>
                        <div id="message-date">Время отправки: {new Date(message.message_datetime).toLocaleString()}</div>
                    </div>);
                })}
            </div>
            <div id="navigation-links">
                {/* will be needed for pagination in the future */}
            </div>
        </div>
        </>
    );
}

export default MessageList;