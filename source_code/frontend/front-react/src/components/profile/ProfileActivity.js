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
            try{
                const config = {
                    headers:{
                        Authorization: `Bearer ${authContext.authToken.replaceAll('"', '')}`,
                    },
                    params: {
                        get_by: 'user',
                        user_id: pageUser.id,
                    }
                }
                const response = await axios.get('http://127.0.0.1:8000/api/map/activity/get',config);
                console.log(response.data);
                setActivity(response.data);
            }
            catch(error){
                console.error('error while getting activity', error);
            }
        }
        fetchData();
    }, [pageUser]);


    if(!authContext.user){
        return(
            <div>Просмотр активности доступен только авторизованным пользователям</div>
        );
    }
    else{
        return(
            <>
            {(authContext.user.id === Number(user_id) || pageUser.show_activity )?
                <div id="activity-wrapper">
                    {activity.map((event)=>{
                        const date = new Date(event.created);
                        return(<div id="activity-block">
                            <p>a</p>
                            <div id="placemark-part">
                                <p>Поле: {event.placemark.name}</p>
                                <p>Начало: {date.toLocaleString()}</p>
                                <p>Окончание: {new Date(date.setHours(date.getHours() + event.expiry)).toLocaleString()}</p>
                            </div>
                        </div>);
                    })}
                </div>
            : <></>}
            </>
        );
    }
}

export default ProfileActivity;