
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
        <div id="form-block" className="h-screen w-full flex items-start justify-center">
            <form 
                onSubmit={handleSubmit} 
                id="message-form"
                className="w-full max-w-md px-[30px] max-h-[450px] rounded-lg border border-solid border-navbar text-navbar flex h-full mt-[100px] flex-col justify-around"
            >
                <li className="list-none flex flex-col font-medium">
                    <label htmlFor="recipient">Recipient:</label>
                    <input
                        className='rounded-lg px-1 py-2 border border-solid border-navbar focus:outline-active'
                        type="text"
                        id="recipient"
                        list="users"
                        value={messageRecipient}
                        pattern={`(${subscriptions.map(subscription => subscription.user_to.username).join('|')})`}
                        onChange={(event)=>setMessageRecipient(event.target.value)}
                        onInvalid={(event)=>{event.target.setCustomValidity('Пожалуйста, выберите пользователя из списка подписок');}}
                        required
                    />
                </li>
                <datalist id="users">
                    {subscriptions.map((subscription) => {
                        return(<option userId={subscription.user_to.id} key={subscription.user_to.id} value={subscription.user_to.username} />);
                    })}
                </datalist>
                <br />

                <li className="list-none flex flex-col font-medium">
                    <label htmlFor="message_topic">Message Topic:</label>
                    <input
                        className='rounded-lg px-1 py-2 border border-solid border-navbar focus:outline-active'
                        required
                        type="text"
                        id="message_topic"
                        value={messageTopic}
                        onChange={(event) => setMessageTopic(event.target.value)}
                    />
                </li>

                <li className="list-none flex flex-col font-medium">
                    <label htmlFor="message_text">Message Text:</label>
                    <textarea
                        className='rounded-lg px-1 py-2 border border-solid border-navbar focus:outline-active'
                        required
                        id="message_text"
                        value={messageText}
                        onChange={(event) => setMessageText(event.target.value)}
                    />
                </li>
                <button 
                    className="bg-active px-1 py-1 rounded-lg text-[#ffff]"
                    type="submit"
                >
                    Send Message
                </button>
            </form>
        </div>
    );
};

export default PostMessage;

