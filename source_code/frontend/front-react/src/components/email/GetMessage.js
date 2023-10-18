import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const GetMessage = () => {
    const [message, setMessage] = useState();
    const {message_id} = useParams();


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
            <>
                <div id="message-details-block">
                    <div id="header">
                        <div id="message-topic">Тема письма: {message.message_topic}</div>
                        <div id="message-sender">Отправитель: {message.sender.username}</div>
                    </div>
                    <div id="body">
                        <div id="message-text">Текст: {message.message_text}</div>
                    </div>
                    <div id="footer">
                        <div id="message-datetime">Время отправки: {new Date(message.message_datetime).toLocaleString()}</div>
                    </div>
                </div>
                <div id="message-navlinks">
                    <Link to="/message">Назад</Link>
                </div>
            </>
        )
    }
}

export default GetMessage;