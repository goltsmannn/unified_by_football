import axios from "axios";
import AuthContext from "context/AuthContext";
import useBlackList from "hooks/useBlackList";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const MessageList = ({filter_by})=>{
    const [messages, setMessages] = useState([]);
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const blacklistedUsers = useBlackList();
    const [blackListedId, setBlackListedId] = useState([]);
    const location = useLocation();


    useEffect(()=>{
        const fetchData = async() => {
            try{
                const config = {
                    headers: { Authorization: `Bearer ${authContext.authToken.replaceAll('"', '')}` }              
                }
                const response = await axios.get(`${authContext.requestHost}/api/users/messages/all/${authContext.user.id}/${filter_by}`, config);
                setMessages(response.data);
            }
            catch(error){
                console.log('caught error while getting all mails');
                console.log(error);
            }
        }
        fetchData();
    }, [authContext.user, filter_by]);

    /** Listing blacklisted users to hide messages from them */
    useEffect(()=>{
        blacklistedUsers.forEach((blacklistedUser)=>{
            setBlackListedId((blackListedId)=>[...blackListedId, blacklistedUser.user_to.id]);
        });
    }, [blacklistedUsers]);


    return(
        <div className="h-[calc(100vh-56px)] w-full">
            <div className="">
            <div id="write-message" className="my-2 w-full text-center bg-navbar text-[#ffff] font-bold text-xl border-2 border-lightgreen p-4 mb-4 rounded-md cursor-pointer transition duration-300 ease-in-out hover:bg-accent hover:text-text hover:border-background2border">
                        <Link to="/message/post">Compose Message</Link>
                    </div>
                    {location.pathname==='/message'?
                        <div id="submitted-messages" className="my-2 w-full  text-center bg-white text-active font-bold text-xl border-2 border-lightgreen p-4 mb-4 rounded-md cursor-pointer transition duration-300 ease-in-out hover:bg-accent hover:text-text hover:border-background2border">
                            <Link to="submitted">Sent Messages</Link>
                        </div>:
                        <div id="received-messages" className="my-2 w-full  text-center bg-white text-active font-bold text-xl border-2 border-lightgreen p-4 mb-4 rounded-md cursor-pointer transition duration-300 ease-in-out hover:bg-accent hover:text-text hover:border-background2border">
                            <Link to="/message">Received Messages</Link>
                        </div>          
                    }                
                <div id="message-section-wrapper" className="mt-20 shadow shadow-active">
                    <h2 className="text-2xl text-center m-4">{location.pathname==='/message'?"Inbox":"Sent"}</h2>
                    <div id="message-list" className="m-4">
                        {messages.length>0?messages.map((message)=> {
                            if(!blackListedId.includes(message.sender.id)){
                                return(
                                <div id="message-wrapper" style={{backgroundColor: message.sender.id===1 ? '#FFA07A' :'#FFF'}} 
                                className="w-full text-navbar border-2 border-navbar p-4 mb-4 rounded-md cursor-pointer transition duration-300 ease-in-out hover:text-active hover:border-active" key={message.id} onClick={()=>navigate(`/message/${message.id}`)}>
                                    <div className="font-bold mb-2">Subject: {message.message_topic}</div>
                                    <div className="mb-2">From: {message.sender.username}</div>
                                    <div>Received: {new Date(message.message_datetime).toLocaleString()}</div>
                                </div>
                                );    
                            }
                        }): <div className="text-2xl text-center font-bold text-red shadow shadow-red p-5 mt-20">No messages yet</div>}
                    </div>
                    <div id="navigation-links" className="mb-4">
                        {/* will be needed for pagination in the future */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MessageList;