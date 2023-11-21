import axios from "axios";
import AuthContext from "context/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";


const ProfileActivity = ({pageUser}) => {
    const authContext = useContext(AuthContext);
    const {user_id} = useParams();
    const [activity, setActivity] = useState([]);

    useEffect(()=>{
        const fetchData = async () => {
            const config = {
                headers:{
                    Authorization: `Bearer ${authContext.authToken.replaceAll('"', '')}`,
                },
                params: {
                    get_by: 'user',
                    user_id: pageUser.id,
                }
            }
            try{
                const response = await axios.get(`${authContext.requestHost}/api/map/activity`,config);
                setActivity(response.data);
            }
            catch(error){
                console.error('Error while fetching activity', error)
            }
        }
        fetchData();
    }, [pageUser]);

    const handleRemoveActivity = async (event) => {
        const config = {
            headers: {
                Authorization: `Bearer ${authContext.authToken.replaceAll('"', '')}` 
            }
        }
        const data = {
            delete: true,
            activity_id: event.id,
        }
        try{
            const response = await axios.post(`${authContext.requestHost}/api/map/activity`, data, config);
            setActivity(response.data);
        }
        catch (error) {
            console.error('Error while removing activity', error);
        }
    }

    const handleFinishEarly = async (event) => {
        const config = {
            headers: {
                Authorization: `Bearer ${authContext.authToken.replaceAll('"', '')}` 
            }
        }
        const data = {
            finished_early: true,
            activity_id: event.id,
        }
        try{
            const response = await axios.post(`${authContext.requestHost}/api/map/activity`, data, config);
            setActivity(response.data);
        }
        catch (error) {
            console.error('Error while removing activity', error);
        }
    }


    if(!authContext.user){
        return(
            <div>Log in to View Activity</div>
        );
    }
    else{
     //   console.log(authContext.user.id, Number(user_id));
        return(
<>
            {(authContext.user.id === Number(user_id) || pageUser.show_activity === true)?
                <div id="activity-wrapper" className="bg-active mt-[20px] text-[#ffff] rounded-md p-4" > 
                    <p>Activity List</p>

                    {activity?.length > 0 ?activity.map((event)=>{
                        const beginDT = new Date(event.created);
                        const tmp = new Date(event.created);
                        const endDT = event.finished_early? new Date(event.finished_early): new Date(tmp.setHours(tmp.getHours() + event.expiry));
                        return(<div id="activity-block">
                            <div id="placemark-part" className="mt-4">
                                <p>Pitch: {event.placemark.name}</p>
                                <p>From: {beginDT.toLocaleString()}</p>
                                <p>To: {endDT.toLocaleString()}</p>
                                {(authContext.user.id === Number(user_id)) && 
                                    <>
                                        <button className="bg-[#cf0404] text-[#ffff] px-2 py-1 rounded-md" onClick={()=>handleRemoveActivity(event)}>Remove activity</button>
                                        {endDT > new Date() && 
                                            <div id="report" className=" flex flex-row-reverse justify-end justify-between">
                                                <button className="flex justify-end text-white bg-[#cf0404] rounded p-2" onClick={()=>handleFinishEarly(event)}>Finish</button>
                                            </div>}
                                    </>
                                }
                </div>
                        </div>);
                    }): <div className="text-white">No tracked activity yet...</div>}
                </div>
            :<div>Activity is hidden</div>}
            </>
        );
    }
}

export default ProfileActivity;