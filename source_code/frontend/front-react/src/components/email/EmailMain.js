import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "context/AuthContext";


const EmailMain = ()=>{
    const [messages, setMessages] = useState([]);
    const authContext = useContext(AuthContext);

    useEffect(()=>{
        const fetchData = async() => {
            try{
                const response = await axios.get(`http://127.0.0.1:8000/api/users/messages/all/${authContext.user.id}`);
                console.log(response.data);
                setMessages(response.data);
            }
            catch(error){
                console.log('caught error while getting all mails');
                console.log(error);
            }
        }
        fetchData();
    }, []);


    return(
        <div id="email-section-wrapper">
            <p>a</p>
            <div id="email-list">
                {messages.map((message)=> (
                    <div id="message-wrapper">
                        <div id="message-topic">Тема: {message.message_topic}</div>
                        <div id="message-sender">Никнейм отправителя: {message.sender.username}</div>
                    </div>
                ))}
            </div>
            <div id="navigation-links">
                {/* will be needed for pagination in the future */}
            </div>
        </div>
    );
}

export default EmailMain;