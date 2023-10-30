import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import useBlackList from "hooks/useBlackList";

const MessageList = ()=>{
    const [messages, setMessages] = useState([]);
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const blacklistedUsers = useBlackList();
    const [blackListedId, setBlackListedId] = useState([]);

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

    useEffect(()=>{
        blacklistedUsers.forEach((blacklistedUser)=>{
            setBlackListedId((blackListedId)=>[...blackListedId, blacklistedUser.user_to.id]);
        });
    }, [blacklistedUsers]);

    return(
        <div className="h-[calc(100vh-56px)] w-full flex items-start justify-center">
            <div className="w-full max-w-md">
                <div id="write-message" className="my-2 w-full text-center bg-navbar text-[#ffff] font-bold text-xl border-2 border-lightgreen p-4 mb-4 rounded-md cursor-pointer transition duration-300 ease-in-out hover:bg-accent hover:text-text hover:border-background2border">
                    <Link to="post">Написать сообщение</Link>
                </div>
                <div id="message-section-wrapper">
                    <div id="message-list">
                        {messages.map((message)=> {
                            if(!blackListedId.includes(message.sender.id)){
                                return(
                                <div id="message-wrapper" className="w-full text-navbar border-2 border-navbar p-4 mb-4 rounded-md cursor-pointer transition duration-300 ease-in-out hover:text-active hover:border-active" key={message.id} onClick={()=>navigate(`${message.id}`)}>
                                    <div className="font-bold mb-2">Тема сообщения: {message.message_topic}</div>
                                    <div className="mb-2">Никнейм отправителя: {message.sender.username}</div>
                                    <div>Время отправки: {new Date(message.message_datetime).toLocaleString()}</div>
                                </div>);    
                            }
                        })}
                    </div>
                    <div id="navigation-links">
                        {/* will be needed for pagination in the future */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MessageList;