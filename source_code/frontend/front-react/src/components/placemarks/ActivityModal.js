import axios from "axios";
import AuthContext from "context/AuthContext";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import closeIcon from '../../img/free-icon-close-4013407.png';


const ActivityModal = ({setModalIsOpen, placemark}) => {
    const [activityValue, setActivityValue] = useState(1);
    const [activityError, setActivityError] = useState("");
    const authContext = useContext(AuthContext);
    const {placemark_id} = useParams();

    /**
     * Sending messages to all users that added placemark to favorites,
     * once there is new activity on the placemark
     */
    const massMessage = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${authContext.authToken.replaceAll('"', '')}` 
            }
        }
        const data = {
            user_id: 1,
            message_topic: `User ${authContext.user.username} has started activity on placemark "${placemark.name}"`,
            message_text: `The user will be there for ${activityValue} hour(-s). Please, check the activity section of the pitch for more details.`,
        };
        
        try{
            const response = await axios.get(`${authContext.requestHost}/api/users/subscribed_at/${placemark_id}`, config);
            const subscribedUsers = response.data;
            for(const user of subscribedUsers){
                console.log(user);
                console.log({...data, recipient_username: user.username});
                await axios.post(`${authContext.requestHost}/api/users/messages/create`, {...data, recipient_username: user.username}, config);
            }
        }
        catch(error){
            console.error('Error while sending mass message', error);
        }
    }


    const handleSubmitActivity = async (e) => {
        e.preventDefault();
        const data = {
            placemark_id: placemark_id,
            expiry: activityValue,
            delete: false,
        }
        const config = {
            headers: {
                Authorization: `Bearer ${authContext.authToken.replaceAll('"', '')}` 
            }
        }
        try{
            const response = await axios.post(`${authContext.requestHost}/api/map/activity`, data, config);
            setActivityError("");
            setModalIsOpen(false);
        }
        catch (error){
            const err = error.response.data.detail;
            console.log(String(err));
            if(String(err)=='EXPIRY_ERROR'){
                setActivityError("Finish your previous activity first (profile)");
            }
        }   
        if(activityError===""){
            massMessage();
        }
    }


    return(
        <div
            id="modal-wrapper"
            className="w-full flex top-0 right-0 bg-overlay fixed z-40 flex justify-center items-center h-screen"
        >
            <div className="w-full rounded-md shadow-lg max-w-md h-[20] px-[25px] py-[20px] bg-[#ffff]" id="modal">
                <button className="p-[5px] text-navbar font-xl bg-[#ffff] flex justify-center leading-none w-[25px] h-[25px] items-center hover:rounded-full hover:text-[#ffff] hover:bg-[#54545426]"
                onClick={()=>setModalIsOpen(false)}>
                    <img src={closeIcon}/>                           
                </button>
                {activityError===""?
                    <>
                        <div>
                            <h2 className="text-center text-xl">Activity Form</h2>
                            <label htmlFor="activity-slider">Choose Duration: </label>
                            <input
                                type="range"
                                min="1"
                                max="6"
                                value={activityValue}
                                onChange={(e) => setActivityValue(e.target.value)}
                                id="activity-slider"
                            />
                            <p>Will be for: {activityValue} (hour(-s))</p>
                        </div>
                        <button className="bg-navbar text-[#ffff] text-center px-2 py-1 rounded-md" onClick={handleSubmitActivity}>Submit</button>
                    </>:
                    <div className="bg-red text-white rounded-lg border border-solid border-navbar text-center">{activityError}</div>
                }
            </div>
        </div>
    );
}
export default ActivityModal;