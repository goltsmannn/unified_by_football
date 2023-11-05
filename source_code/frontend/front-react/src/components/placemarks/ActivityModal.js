import AuthContext from "context/AuthContext";
import React, { useContext, useState } from "react";
import axios from "axios";
import closeIcon from '../../img/free-icon-close-4013407.png';
import { useParams } from "react-router-dom";


const ActivityModal = ({setModalIsOpen}) => {
    const [activityValue, setActivityValue] = useState(1);
    const [activityError, setActivityError] = useState("");
    const authContext = useContext(AuthContext);
    const {placemark_id} = useParams();


    const handleSubmitActivity = async (e) => {
        e.preventDefault();
        const data = {
            placemark_id: placemark_id,
            user_id: authContext.user.id,
            expiry: activityValue,
            delete: false,
        }
        const config = {
            headers: {
                Authorization: `Bearer ${authContext.authToken.replaceAll('"', '')}` 
            }
        }
        try{
            const response = await axios.post(`http://127.0.0.1:8000/api/map/activity`, data, config);
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