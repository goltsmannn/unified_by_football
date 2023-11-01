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
                const response = await axios.get('http://127.0.0.1:8000/api/map/activity',config);
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
            placemark_id: event.placemark.id,
            user_id: event.user.id,
            delete: true,
        }
        try{
            const response = await axios.post(`http://127.0.0.1:8000/api/map/activity`, data, config);
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
        return(
<>
            {(authContext.user.id === Number(user_id) || pageUser.show_activity )?
                <div id="activity-wrapper" className="bg-active mt-[20px] text-[#ffff] rounded-md p-4" > 
                    {activity?.length > 0 ?activity.map((event)=>{
                        const date = new Date(event.created);
                        return(<div id="activity-block">
                            <p>Activity List</p>
                            <div id="placemark-part" className="mt-4">
                                <p>Pitch: {event.placemark.name}</p>
                                <p>From: {date.toLocaleString()}</p>
                                <p>To: {new Date(date.setHours(date.getHours() + event.expiry)).toLocaleString()}</p>
                                {(authContext.user.id === Number(user_id)) &&
                                    <button className="bg-[#cf0404] text-[#ffff] px-2 py-1 rounded-md" onClick={()=>handleRemoveActivity(event)}>Remove activity</button>
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