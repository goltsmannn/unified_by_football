
import React, { useState, useContext} from "react";
import axios from "axios";
import useSubscriptions from "hooks/useSubscriptions";
import AuthContext from "context/AuthContext";


const PostMessage = () => {
    const [messageTopic, setMessageTopic] = useState("");
    const [messageText, setMessageText] = useState("");
    const [messageRecipient, setMessageRecipient] = useState("");
    const subscriptions = useSubscriptions();
    const authContext = useContext(AuthContext);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const fetchData = async () => {
            const config = {
                headers: { Authorization: `Bearer ${authContext.authToken.replaceAll('"', '')}` }
            };
            const data = {
                message_topic: messageTopic,
                message_text: messageText,
                recipient_username: messageRecipient,
            };

            try {
                const response = await axios.post('http://localhost:8000/api/users/messages/create', data, config);
                console.log(response.data); 
                setMessageRecipient("");
                setMessageText("");
                setMessageTopic("");
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    };

    return (
        <div id="form-block">
            <form onSubmit={handleSubmit} id="message-form">
                <label htmlFor="recipient">Recipient:</label>
                <input
                    type="text"
                    id="recipient"
                    list="users"
                    value={messageRecipient}
                    pattern={`(${subscriptions.map(subscription => subscription.user_to.username).join('|')})`}
                    onChange={(event)=>setMessageRecipient(event.target.value)}
                    onInvalid={(event)=>{event.target.setCustomValidity('Пожалуйста, выберите пользователя из списка подписок');}}
                    required
                />
                <datalist id="users">
                    {subscriptions.map((subscription) => {
                        return(<option userId={subscription.user_to.id} key={subscription.user_to.id} value={subscription.user_to.username} />);
                    })}
                </datalist>
                <br />


                <label htmlFor="message_topic">Message Topic:</label>
                <input
                    required
                    type="text"
                    id="message_topic"
                    value={messageTopic}
                    onChange={(event) => setMessageTopic(event.target.value)}
                />
                <label htmlFor="message_text">Message Text:</label>
                <textarea
                    required
                    id="message_text"
                    value={messageText}
                    onChange={(event) => setMessageText(event.target.value)}
                />
                <button type="submit">Send Message</button>
            </form>
        </div>
    );
};

export default PostMessage;

